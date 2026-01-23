import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Button from '@/components/common/Button'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import { useToast } from '@/contexts/ToastContext'
import * as adminService from '@/services/admin.service'
import { PAGINATION } from '@/utils/constants'

interface Banner {
  _id: string
  title: string
  subtitle?: string
  image_url: string
  alt_text?: string
  cta_text?: string
  cta_link?: string
  order?: number
  position: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

const AdminBanners = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()

  const [banners, setBanners] = useState<Banner[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for banner modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null)

  // State for filters
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: PAGINATION.DEFAULT_LIMIT,
    position: searchParams.get('position') || '',
    is_active: searchParams.get('is_active') || '',
  })

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    alt_text: '',
    cta_text: '',
    cta_link: '',
    order: 0,
    position: 'home_hero',
    is_active: true,
  })

  const positionOptions = [
    { value: 'home_hero', label: 'Trang chủ - Hero' },
    { value: 'home_slider', label: 'Trang chủ - Slider' },
    { value: 'category', label: 'Danh mục' },
    { value: 'product', label: 'Sản phẩm' },
  ]

  const fetchBanners = useCallback(async () => {
    try {
      setIsLoading(true)
      const apiFilters: any = {
        page: filters.page,
        limit: filters.limit,
      }
      if (filters.position) apiFilters.position = filters.position
      if (filters.is_active !== '') apiFilters.is_active = filters.is_active === 'true'

      const response = await adminService.getBanners(apiFilters)
      setBanners(response.banners)
      setPagination(response.pagination)
    } catch (error: any) {
      console.error('Failed to fetch banners:', error)
      showError(error.response?.data?.message || 'Không thể tải danh sách banner')
    } finally {
      setIsLoading(false)
    }
  }, [filters, showError])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (filters.position) params.set('position', filters.position)
    if (filters.is_active) params.set('is_active', filters.is_active)
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const handleDelete = async () => {
    if (!bannerToDelete) return

    try {
      await adminService.deleteBanner(bannerToDelete._id)
      showSuccess('Đã xóa banner thành công')
      setDeleteModalOpen(false)
      setBannerToDelete(null)
      fetchBanners()
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể xóa banner')
    }
  }

  const handleBannerSubmit = async () => {
    try {
      setIsSubmitting(true)
      const submitData = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        image_url: formData.image_url,
        alt_text: formData.alt_text || undefined,
        cta_text: formData.cta_text || undefined,
        cta_link: formData.cta_link || undefined,
        order: formData.order || 0,
        position: formData.position,
        is_active: formData.is_active,
      }

      if (modalMode === 'add') {
        await adminService.createBanner(submitData)
        showSuccess('Đã thêm banner mới thành công')
      } else if (bannerToEdit) {
        await adminService.updateBanner(bannerToEdit._id, submitData)
        showSuccess('Đã cập nhật banner thành công')
      }
      setIsBannerModalOpen(false)
      resetForm()
      fetchBanners()
    } catch (error: any) {
      showError(error.response?.data?.message || `Lỗi khi ${modalMode === 'add' ? 'thêm' : 'cập nhật'} banner`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      alt_text: '',
      cta_text: '',
      cta_link: '',
      order: 0,
      position: 'home_hero',
      is_active: true,
    })
    setBannerToEdit(null)
  }

  const handleOpenEditModal = (banner: Banner) => {
    setModalMode('edit')
    setBannerToEdit(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      alt_text: banner.alt_text || '',
      cta_text: banner.cta_text || '',
      cta_link: banner.cta_link || '',
      order: banner.order || 0,
      position: banner.position,
      is_active: banner.is_active !== undefined ? banner.is_active : true,
    })
    setIsBannerModalOpen(true)
  }

  const handleOpenAddModal = () => {
    setModalMode('add')
    resetForm()
    setIsBannerModalOpen(true)
  }

  const columns: Column<Banner>[] = [
    {
      key: 'image',
      header: 'Banner',
      headerClassName: 'min-w-[200px]',
      render: (banner) => (
        <div className="flex items-center gap-4">
          <div className="size-20 rounded-lg bg-gray-100 flex-shrink-0 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <img
              src={banner.image_url}
              alt={banner.alt_text || banner.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-text-main dark:text-white">{banner.title}</span>
            {banner.subtitle && (
              <span className="text-sm text-text-sub mt-0.5">{banner.subtitle}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Vị trí',
      cellClassName: 'text-text-sub',
      render: (banner) => {
        const positionLabel = positionOptions.find((opt) => opt.value === banner.position)?.label || banner.position
        return <span className="text-sm">{positionLabel}</span>
      },
    },
    {
      key: 'order',
      header: 'Thứ tự',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (banner) => <span className="text-sm text-text-main dark:text-white">{banner.order || 0}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (banner) => {
        const isActive = banner.is_active !== false
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            {isActive ? 'Đang hiển thị' : 'Ẩn'}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (banner) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEditModal(banner)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setBannerToDelete(banner)
              setDeleteModalOpen(true)
            }}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-main dark:text-white">Quản lý Banner</h1>
            <p className="text-sm text-text-sub mt-1">Quản lý các banner hiển thị trên website</p>
          </div>
          <Button onClick={handleOpenAddModal}>Thêm Banner</Button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Vị trí</label>
              <select
                value={filters.position}
                onChange={(e) => setFilters({ ...filters, position: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
              >
                <option value="">Tất cả</option>
                {positionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Trạng thái</label>
              <select
                value={filters.is_active}
                onChange={(e) => setFilters({ ...filters, is_active: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
              >
                <option value="">Tất cả</option>
                <option value="true">Đang hiển thị</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <DataTable columns={columns} data={banners} isLoading={isLoading} />
        </div>

        {/* Pagination */}
        {pagination.total_page > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_page}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isBannerModalOpen}
          onClose={() => {
            setIsBannerModalOpen(false)
            resetForm()
          }}
          title={modalMode === 'add' ? 'Thêm Banner Mới' : 'Chỉnh Sửa Banner'}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề banner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Phụ đề</label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Nhập phụ đề (tùy chọn)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                URL hình ảnh <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img src={formData.image_url} alt="Preview" className="max-w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Alt text</label>
              <Input
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Mô tả hình ảnh (tùy chọn)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Vị trí</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
              >
                {positionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Thứ tự</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Trạng thái</label>
                <select
                  value={formData.is_active ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                >
                  <option value="true">Đang hiển thị</option>
                  <option value="false">Ẩn</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Text nút CTA</label>
              <Input
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Ví dụ: Khám Phá Ngay"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Link nút CTA</label>
              <Input
                value={formData.cta_link}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                placeholder="/collections/autumn-2024"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsBannerModalOpen(false)
                  resetForm()
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleBannerSubmit} disabled={isSubmitting || !formData.title || !formData.image_url}>
                {isSubmitting ? 'Đang xử lý...' : modalMode === 'add' ? 'Thêm Banner' : 'Cập nhật'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setBannerToDelete(null)
          }}
          title="Xác nhận xóa"
        >
          <div className="space-y-4">
            <p className="text-text-main dark:text-white">
              Bạn có chắc chắn muốn xóa banner <strong>{bannerToDelete?.title}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false)
                  setBannerToDelete(null)
                }}
              >
                Hủy
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default AdminBanners

