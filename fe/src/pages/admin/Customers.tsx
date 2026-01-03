import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import { useToast } from '@/contexts/ToastContext'
import * as adminService from '@/services/admin.service'
import { PAGINATION } from '@/utils/constants'
import { formatDateShort, formatPriceSimple, formatPrice } from '@/utils/formatters'
import type { User } from '@/types'
import type { CustomerDetail } from '@/types/admin.types'

// Extended User type for admin customers with additional fields from backend
interface AdminCustomer extends User {
  customer_code?: string
  avatar_url?: string | null
  stats?: {
    order_count: number
    total_spent: number
    total_spent_display?: string
  }
  joined_at_display?: string
  status_label?: string
  status_color?: string
}

const AdminCustomers = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showSuccess, showError, showInfo } = useToast()

  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '')
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: PAGINATION.DEFAULT_LIMIT,
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
  })
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [customerToUpdate, setCustomerToUpdate] = useState<AdminCustomer | null>(null)
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active')
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [customerDetail, setCustomerDetail] = useState<CustomerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Sync filters with URL params on mount
  useEffect(() => {
    const keyword = searchParams.get('keyword') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')

    setSearchKeyword(keyword)
    setFilters({
      page,
      limit: PAGINATION.DEFAULT_LIMIT,
      keyword,
      status,
    })
  }, []) // Only run on mount

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('Fetching customers with filters:', filters)
      const response = await adminService.getCustomers(filters)
      console.log('Customers response:', response)
      setCustomers(response.customers)
      setPagination(response.pagination)
    } catch (error: any) {
      console.error('Failed to fetch customers:', error)
      showError(error.response?.data?.message || 'Không thể tải danh sách khách hàng')
    } finally {
      setIsLoading(false)
    }
  }, [filters, showError])

  // Debounce search keyword
  useEffect(() => {
    // Skip if this is the initial mount (already set from URL)
    if (searchKeyword === filters.keyword) return

    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        keyword: searchKeyword.trim(),
        page: 1, // Reset to page 1 when search changes
      }))
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchKeyword]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (filters.keyword && filters.keyword.trim()) {
      params.set('keyword', filters.keyword.trim())
    }
    if (filters.status && filters.status.trim()) {
      params.set('status', filters.status.trim())
    }
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])


  const handleExportExcel = async () => {
    try {
      setIsLoading(true)
      showInfo('Đang tải dữ liệu để xuất Excel...')

      // Fetch all customers with current filters but without pagination limit
      // Use a large limit to get all matching customers
      const response = await adminService.getCustomers({
        ...filters,
        page: 1,
        limit: 10000, // Large limit to get all data
      })

      if (response.customers.length === 0) {
        showError('Không có dữ liệu để xuất Excel')
        return
      }

      // Format data for Excel export
      const exportData = response.customers.map((customer) => ({
        'Mã khách hàng': customer.customer_code || `#USR-${customer._id.slice(-6).toUpperCase()}`,
        'Họ và tên': customer.full_name || `${customer.first_name} ${customer.last_name}`.trim(),
        'Email': customer.email || '',
        'Số điện thoại': customer.phonenumber || '',
        'Số đơn hàng': customer.orders_count || customer.stats?.order_count || 0,
        'Tổng chi tiêu (VNĐ)': formatPriceSimple(customer.total_spent || customer.stats?.total_spent || 0),
        'Trạng thái': customer.status_label || (customer.status === 'active' ? 'Hoạt động' : 'Bị khóa'),
        'Ngày tham gia': customer.joined_at_display || formatDateShort(customer.createdAt || new Date().toISOString()),
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths for better readability
      const colWidths = [
        { wch: 18 }, // Mã khách hàng
        { wch: 25 }, // Họ và tên
        { wch: 30 }, // Email
        { wch: 15 }, // Số điện thoại
        { wch: 12 }, // Số đơn hàng
        { wch: 20 }, // Tổng chi tiêu
        { wch: 15 }, // Trạng thái
        { wch: 15 }, // Ngày tham gia
      ]
      ws['!cols'] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách khách hàng')

      // Generate filename with current date and time
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-')
      const filename = `Danh_sach_khach_hang_${dateStr}_${timeStr}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)

      showSuccess(`Đã xuất file Excel thành công: ${filename} (${exportData.length} khách hàng)`)
    } catch (error: any) {
      console.error('Export Excel error:', error)
      showError(error.response?.data?.message || 'Không thể xuất file Excel')
    } finally {
      setIsLoading(false)
    }
  }


  // Helper function to check if customer can be locked (active or new)
  const canLockCustomer = (customer: AdminCustomer) => {
    return customer.status === 'active' || customer.status === 'new'
  }

  // Helper function to check if customer can be unlocked (inactive)
  const canUnlockCustomer = (customer: AdminCustomer) => {
    return customer.status === 'inactive'
  }

  const handleUpdateStatus = async () => {
    if (!customerToUpdate) return

    try {
      await adminService.updateCustomerStatus(customerToUpdate._id, newStatus)
      showSuccess(
        `Đã ${newStatus === 'active' ? 'kích hoạt' : 'khóa'} tài khoản khách hàng thành công`
      )
      setStatusModalOpen(false)
      setCustomerToUpdate(null)
      fetchCustomers()
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể cập nhật trạng thái khách hàng')
    }
  }

  const handleViewDetail = async (customerId: string) => {
    try {
      setDetailLoading(true)
      setDetailModalOpen(true)
      const detail = await adminService.getCustomerDetail(customerId)
      setCustomerDetail(detail)
    } catch (error: any) {
      console.error('Failed to fetch customer detail:', error)
      showError(error.response?.data?.message || 'Không thể tải thông tin chi tiết khách hàng')
      setDetailModalOpen(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const getStatusBadge = (customer: AdminCustomer) => {
    const status = customer.status || 'active'
    if (customer.status_label && customer.status_color) {
      const colorMap: Record<string, string> = {
        green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      }
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            colorMap[customer.status_color] ||
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }`}
        >
          {customer.status_label}
        </span>
      )
    }
    // Fallback to default status
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}
      >
        {status === 'active' ? 'Hoạt động' : 'Bị khóa'}
      </span>
    )
  }

  const getCustomerCode = (customer: AdminCustomer) => {
    if (customer.customer_code) return customer.customer_code
    // Fallback: generate from _id
    const id = customer._id || ''
    return `#USR-${id.slice(-6).toUpperCase()}`
  }

  const formatTotalSpent = (customer: AdminCustomer) => {
    if (customer.stats?.total_spent_display) {
      return customer.stats.total_spent_display
    }
    const amount = customer.total_spent || customer.stats?.total_spent || 0
    return `${formatPriceSimple(amount)}đ`
  }

  const getAvatarUrl = (customer: AdminCustomer) => {
    return customer.avatar_url || customer.avatar || null
  }

  const getInitials = (customer: AdminCustomer) => {
    const name = customer.full_name || `${customer.first_name} ${customer.last_name}`.trim()
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const columns: Column<AdminCustomer>[] = [
    {
      key: 'stt',
      header: 'STT',
      headerClassName: 'w-16 text-center',
      cellClassName: 'w-16 text-center',
      render: (_customer, index) => {
        const page = Number(pagination.page) || 1
        const limit = Number(pagination.limit) || PAGINATION.DEFAULT_LIMIT
        const idx = typeof index === 'number' ? index : 0
        const stt = (page - 1) * limit + idx + 1
        return <span className="text-text-sub dark:text-gray-400 font-medium">{isNaN(stt) ? '-' : String(stt)}</span>
      },
    },
    {
      key: 'customer',
      header: 'Khách hàng',
      headerClassName: 'min-w-[250px]',
      render: (customer) => {
        const avatarUrl = getAvatarUrl(customer)
        const isLocked = customer.status === 'inactive'
        return (
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <div
                className={`size-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 ${
                  isLocked ? 'grayscale' : ''
                }`}
              >
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  src={avatarUrl}
                  onError={(e) => {
                    // Fallback to initials if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.className = 'size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0'
                      parent.textContent = getInitials(customer)
                    }
                  }}
                />
              </div>
            ) : (
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                {getInitials(customer)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-text-main dark:text-white">
                {customer.full_name || `${customer.first_name} ${customer.last_name}`.trim()}
                {isLocked && ' (Locked)'}
              </span>
              <span className="text-xs text-text-sub dark:text-gray-400">{getCustomerCode(customer)}</span>
            </div>
        </div>
        )
      },
    },
    {
      key: 'contact',
      header: 'Liên hệ',
      headerClassName: 'min-w-[150px]',
      render: (customer) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-text-sub dark:text-gray-400">
            <span className="material-symbols-outlined text-[14px]">mail</span>
            <span className="text-xs">{customer.email}</span>
          </div>
          {customer.phonenumber && (
            <div className="flex items-center gap-2 text-text-sub dark:text-gray-400">
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span className="text-xs">{customer.phonenumber}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'orders',
      header: 'Đơn hàng',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (customer) => (
        <span className="font-medium text-text-main dark:text-white">
          {customer.orders_count || customer.stats?.order_count || 0}
        </span>
      ),
    },
    {
      key: 'total_spent',
      header: 'Tổng chi tiêu',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (customer) => {
        const amount = customer.total_spent || customer.stats?.total_spent || 0
        return (
        <span
            className={`font-bold ${
              amount > 0 ? 'text-primary' : 'text-text-sub dark:text-gray-500'
          }`}
        >
            {formatTotalSpent(customer)}
        </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (customer) => getStatusBadge(customer),
    },
    {
      key: 'joined_at',
      header: 'Ngày tham gia',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (customer) => (
        <span className="text-text-sub dark:text-gray-400 text-xs">
          {customer.joined_at_display ||
            formatDateShort(customer.createdAt || new Date().toISOString())}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (customer) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Xem chi tiết"
            onClick={() => handleViewDetail(customer._id)}
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button
            className={`p-1.5 rounded-lg transition-colors ${
              canLockCustomer(customer)
                ? 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                : 'text-gray-400 opacity-50 cursor-not-allowed'
            }`}
            title={canLockCustomer(customer) ? 'Khóa tài khoản' : 'Tài khoản đã bị khóa'}
            disabled={!canLockCustomer(customer)}
            onClick={() => {
              if (canLockCustomer(customer)) {
                setCustomerToUpdate(customer)
                setNewStatus('inactive')
                setStatusModalOpen(true)
              }
            }}
          >
            <span className="material-symbols-outlined text-[18px]">block</span>
          </button>
          <button
            className={`p-1.5 rounded-lg transition-colors ${
              canUnlockCustomer(customer)
                ? 'text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'text-gray-400 opacity-50 cursor-not-allowed'
            }`}
            title={canUnlockCustomer(customer) ? 'Mở khóa tài khoản' : 'Tài khoản đang hoạt động'}
            disabled={!canUnlockCustomer(customer)}
            onClick={() => {
              if (canUnlockCustomer(customer)) {
              setCustomerToUpdate(customer)
                setNewStatus('active')
              setStatusModalOpen(true)
              }
            }}
          >
            <span className="material-symbols-outlined text-[18px]">lock_open</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-main dark:text-white">
              Danh sách khách hàng
            </h2>
            <p className="text-sm text-text-sub dark:text-gray-400 mt-1">
              Quản lý thông tin và trạng thái tài khoản của {pagination.total || 0} người dùng.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2c32] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Xuất Excel
            </Button>
          </div>
        </div>

            {/* Filters */}
        <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-1 max-w-lg relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">
                filter_list
              </span>
                <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
                <Select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                  }
                className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-text-main dark:text-white focus:ring-primary focus:border-primary outline-none cursor-pointer"
                  options={[
                    { value: '', label: 'Tất cả trạng thái' },
                  { value: 'active', label: 'Đang hoạt động' },
                  { value: 'inactive', label: 'Bị khóa' },
                  { value: 'new', label: 'Mới đăng ký' },
                ]}
              />
            </div>
              </div>
            </div>

        {/* Data Table - Desktop */}
        <div className="hidden md:block bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={customers}
              loading={isLoading}
              emptyMessage="Không có khách hàng nào"
            />
          </div>

            {/* Pagination */}
            {pagination.total_page > 1 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1a2c32]">
              <span className="text-sm text-text-sub dark:text-gray-400">
                Hiển thị{' '}
                <span className="font-medium text-text-main dark:text-white">
                  {(pagination.page - 1) * pagination.limit + 1}-
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                trên <span className="font-medium text-text-main dark:text-white">{pagination.total}</span>{' '}
                khách hàng
              </span>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_page}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              />
            </div>
          )}
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : customers.length === 0 ? (
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                inbox
              </span>
              <p className="text-text-sub dark:text-gray-400">Không có khách hàng nào</p>
            </div>
          ) : (
            customers.map((customer) => {
              const avatarUrl = getAvatarUrl(customer)
              const isLocked = customer.status === 'inactive'
              return (
                <div
                  key={customer._id}
                  className={`bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 ${
                    isLocked ? 'bg-red-50/30 dark:bg-red-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="mt-2 w-8 text-center">
                      <span className="text-text-sub dark:text-gray-400 font-medium text-sm">
                        {(() => {
                          const page = Number(pagination.page) || 1
                          const limit = Number(pagination.limit) || PAGINATION.DEFAULT_LIMIT
                          const idx = customers.indexOf(customer)
                          if (idx < 0) return '-'
                          const stt = (page - 1) * limit + idx + 1
                          return isNaN(stt) ? '-' : String(stt)
                        })()}
                      </span>
                    </div>
                    {avatarUrl ? (
                      <div
                        className={`size-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 ${
                          isLocked ? 'grayscale' : ''
                        }`}
                      >
                        <img
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          src={avatarUrl}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.className = 'size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0'
                              parent.textContent = getInitials(customer)
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {getInitials(customer)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-text-main dark:text-white block">
                        {customer.full_name || `${customer.first_name} ${customer.last_name}`.trim()}
                        {isLocked && ' (Locked)'}
                      </span>
                      <span className="text-xs text-text-sub dark:text-gray-400 block">
                        {getCustomerCode(customer)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-text-sub dark:text-gray-400">
                      <span className="material-symbols-outlined text-[14px]">mail</span>
                      <span className="text-xs">{customer.email}</span>
                    </div>
                    {customer.phonenumber && (
                      <div className="flex items-center gap-2 text-text-sub dark:text-gray-400">
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span className="text-xs">{customer.phonenumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-xs text-text-sub dark:text-gray-400">Đơn hàng</span>
                      <p className="font-medium text-text-main dark:text-white">
                        {customer.orders_count || customer.stats?.order_count || 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-text-sub dark:text-gray-400">Tổng chi tiêu</span>
                      <p
                        className={`font-bold ${
                          (customer.total_spent || customer.stats?.total_spent || 0) > 0
                            ? 'text-primary'
                            : 'text-text-sub dark:text-gray-500'
                        }`}
                      >
                        {formatTotalSpent(customer)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>{getStatusBadge(customer)}</div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Xem chi tiết"
                        onClick={() => handleViewDetail(customer._id)}
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-colors ${
                          canLockCustomer(customer)
                            ? 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                            : 'text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                        title={canLockCustomer(customer) ? 'Khóa tài khoản' : 'Tài khoản đã bị khóa'}
                        disabled={!canLockCustomer(customer)}
                        onClick={() => {
                          if (canLockCustomer(customer)) {
                            setCustomerToUpdate(customer)
                            setNewStatus('inactive')
                            setStatusModalOpen(true)
                          }
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">block</span>
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-colors ${
                          canUnlockCustomer(customer)
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
                            : 'text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                        title={canUnlockCustomer(customer) ? 'Mở khóa tài khoản' : 'Tài khoản đang hoạt động'}
                        disabled={!canUnlockCustomer(customer)}
                        onClick={() => {
                          if (canUnlockCustomer(customer)) {
                            setCustomerToUpdate(customer)
                            setNewStatus('active')
                            setStatusModalOpen(true)
                          }
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">lock_open</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-text-sub dark:text-gray-400">
                      Ngày tham gia: {customer.joined_at_display || formatDateShort(customer.createdAt || new Date().toISOString())}
                    </span>
                  </div>
                </div>
              )
            })
          )}

          {/* Mobile Pagination */}
          {pagination.total_page > 1 && (
            <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.total_page}
                  onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                />
              </div>
            )}
          </div>
        </div>

        {/* Customer Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false)
          setCustomerDetail(null)
        }}
        title="Chi tiết khách hàng"
        size="lg"
      >
        <div className="p-6">
          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : customerDetail ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4">
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-text-sub dark:text-gray-400 uppercase tracking-wider">
                      Họ và tên
                    </label>
                    <p className="text-text-main dark:text-white font-medium mt-1">
                      {customerDetail.info.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-sub dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </label>
                    <p className="text-text-main dark:text-white font-medium mt-1">
                      {customerDetail.info.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-sub dark:text-gray-400 uppercase tracking-wider">
                      Số điện thoại
                    </label>
                    <p className="text-text-main dark:text-white font-medium mt-1">
                      {customerDetail.info.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {customerDetail.addresses && customerDetail.addresses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4">
                    Địa chỉ
                  </h3>
                  <div className="space-y-3">
                    {customerDetail.addresses.map((address, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-text-main dark:text-white">
                              {address.full_address}
                            </p>
                            {address.is_default && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mt-2">
                                Địa chỉ mặc định
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Orders */}
              <div>
                <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4">
                  Đơn hàng gần đây ({customerDetail.recent_orders?.length || 0})
                </h3>
                {customerDetail.recent_orders && customerDetail.recent_orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider">
                            Mã đơn hàng
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider">
                            Ngày đặt
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider text-right">
                            Tổng tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {customerDetail.recent_orders.map((order, index) => {
                          const orderDate = order.created_at
                            ? new Date(order.created_at).toLocaleDateString('vi-VN')
                            : 'N/A'
                          const statusMap: Record<string, { label: string; className: string }> = {
                            pending: {
                              label: 'Chờ xử lý',
                              className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                            },
                            processing: {
                              label: 'Đang xử lý',
                              className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                            },
                            shipping: {
                              label: 'Đang giao',
                              className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                            },
                            completed: {
                              label: 'Hoàn thành',
                              className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                            },
                            cancelled: {
                              label: 'Đã hủy',
                              className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                            },
                          }
                          const statusConfig =
                            statusMap[order.status] || {
                              label: order.status,
                              className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
                            }
                          return (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-text-main dark:text-white">
                                {order.order_code || 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm text-text-sub dark:text-gray-400">
                                {orderDate}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}
                                >
                                  {statusConfig.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-primary text-right">
                                {formatPrice((order as any).total || (order as any)['cost_summary.total'] || (order as any).cost_summary?.total || 0)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600 mb-2">
                      shopping_bag
                    </span>
                    <p className="text-text-sub dark:text-gray-400">Khách hàng chưa có đơn hàng nào</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-sub dark:text-gray-400">Không thể tải thông tin chi tiết</p>
            </div>
          )}
        </div>
      </Modal>

        {/* Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false)
          setCustomerToUpdate(null)
        }}
        title="Cập nhật trạng thái"
        size="sm"
      >
        <div className="p-6">
          <p className="text-text-main dark:text-white mb-4">
            Bạn có chắc chắn muốn {newStatus === 'active' ? 'kích hoạt' : 'khóa'} tài khoản của{' '}
            <strong>{customerToUpdate?.full_name || customerToUpdate?.email}</strong>?
          </p>
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setStatusModalOpen(false)
                setCustomerToUpdate(null)
              }}
            >
              Hủy
            </Button>
            <Button variant="primary" onClick={handleUpdateStatus}>
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}

export default AdminCustomers
