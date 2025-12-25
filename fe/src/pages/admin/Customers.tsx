import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import { formatDate } from '@/utils/formatters'
import type { User } from '@/types'

const AdminCustomers = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showSuccess, showError, showInfo } = useToast()

  const [customers, setCustomers] = useState<User[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: PAGINATION.DEFAULT_LIMIT,
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
  })
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [customerToUpdate, setCustomerToUpdate] = useState<User | null>(null)
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active')

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await adminService.getCustomers(filters)
      setCustomers(response.customers)
      setPagination(response.pagination)
    } catch (error: any) {
      console.error('Failed to fetch customers:', error)
      showError(error.response?.data?.message || 'Không thể tải danh sách khách hàng')
    } finally {
      setIsLoading(false)
    }
  }, [filters, showError])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (filters.keyword) params.set('keyword', filters.keyword)
    if (filters.status) params.set('status', filters.status)
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

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

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Tên khách hàng',
      render: (customer) => (
        <div>
          <p className="font-medium">{customer.full_name || `${customer.first_name} ${customer.last_name}`}</p>
          <p className="text-xs text-text-sub dark:text-gray-400">{customer.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
      render: (customer) => (
        <span className="text-sm">{customer.phonenumber || 'N/A'}</span>
      ),
    },
    {
      key: 'orders',
      header: 'Số đơn hàng',
      render: (customer) => (
        <span className="text-sm">{customer.orders_count || 0}</span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (customer) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            customer.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          {customer.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày đăng ký',
      render: (customer) => (
        <span className="text-sm">{formatDate(customer.createdAt || '')}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (customer) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Navigate to customer detail page
              showInfo('Chức năng xem chi tiết sẽ được implement sau')
            }}
          >
            Xem
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCustomerToUpdate(customer)
              setNewStatus(customer.status === 'active' ? 'inactive' : 'active')
              setStatusModalOpen(true)
            }}
          >
            {customer.status === 'active' ? 'Khóa' : 'Mở khóa'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-6">
              Quản lý khách hàng
            </h1>

            {/* Filters */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, keyword: e.target.value, page: 1 }))
                  }
                />
                <Select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                  }
                  options={[
                    { value: '', label: 'Tất cả trạng thái' },
                    { value: 'active', label: 'Hoạt động' },
                    { value: 'inactive', label: 'Đã khóa' },
                  ]}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      page: 1,
                      limit: PAGINATION.DEFAULT_LIMIT,
                      keyword: '',
                      status: '',
                    })
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              columns={columns}
              data={customers}
              loading={isLoading}
              emptyMessage="Không có khách hàng nào"
            />

            {/* Pagination */}
            {pagination.total_page > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.total_page}
                  onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                />
              </div>
            )}
          </div>
        </div>

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
