import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import ToggleSwitch from '@/components/common/ToggleSwitch'
import LogoUpload from '@/components/admin/LogoUpload'
import Spinner from '@/components/common/Spinner'
import { useToast } from '@/contexts/ToastContext'
import * as adminService from '@/services/admin.service'
import type { Settings } from '@/types/settings.types'

const AdminSettings = () => {
  const { showSuccess, showError } = useToast()
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'shipping'>('general')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Payment form
  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    watch: watchPayment,
    setValue: setPaymentValue,
    formState: { errors: paymentErrors },
  } = useForm({
    defaultValues: {
      cod: true,
      bank_transfer: true,
      momo: false,
    },
  })

  // Shipping form
  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    watch: watchShipping,
    setValue: setShippingValue,
    formState: { errors: shippingErrors },
  } = useForm({
    defaultValues: {
      default_fee: 30000,
      free_shipping_threshold: 500000,
      ghn: true,
      viettel_post: true,
      ghtk: false,
      jnt: false,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Settings['general']>({
    defaultValues: {
      store_name: 'YORI Fashion',
      store_email: 'admin@yori.vn',
      store_phone: '0988 123 456',
      store_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    },
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (settings) {
      // Map backend fields to frontend form fields
      const generalData = {
        store_name: settings.general?.store_name || 'YORI Fashion',
        store_email: settings.general?.store_email || settings.general?.email || 'admin@yori.vn',
        store_phone: settings.general?.store_phone || settings.general?.phone || '0988 123 456',
        store_address: settings.general?.store_address || settings.general?.address || '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        logo_url: settings.general?.logo_url || '',
      }
      reset(generalData)
      if (settings.payment) {
        setPaymentValue('cod', settings.payment.cod?.enabled ?? true)
        setPaymentValue('bank_transfer', settings.payment.bank_transfer?.enabled ?? true)
        setPaymentValue('momo', settings.payment.momo?.enabled ?? false)
      }
      if (settings.shipping) {
        setShippingValue('default_fee', settings.shipping.default_fee ?? 30000)
        setShippingValue('free_shipping_threshold', settings.shipping.free_shipping_threshold ?? 500000)
        setShippingValue('ghn', settings.shipping.partners?.ghn?.enabled ?? true)
        setShippingValue('viettel_post', settings.shipping.partners?.viettel_post?.enabled ?? true)
        setShippingValue('ghtk', settings.shipping.partners?.ghtk?.enabled ?? false)
        setShippingValue('jnt', settings.shipping.partners?.jnt?.enabled ?? false)
      }
    } else {
      // Set default values when settings is null (initial load or error)
      reset({
        store_name: 'YORI Fashion',
        store_email: 'admin@yori.vn',
        store_phone: '0988 123 456',
        store_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      })
    }
  }, [settings, reset, setPaymentValue, setShippingValue])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getSettings()
      // Map backend response to frontend format
      const mappedData = {
        general: {
          store_name: data.general?.store_name || 'YORI Fashion',
          store_email: data.general?.email || data.general?.store_email || 'admin@yori.vn',
          store_phone: data.general?.phone || data.general?.store_phone || '0988 123 456',
          store_address: data.general?.address || data.general?.store_address || '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
          logo_url: data.general?.logo_url || '',
        },
        payment: data.payment,
        shipping: data.shipping,
      }
      setSettings(mappedData)
    } catch (error: any) {
      console.error('Failed to fetch settings:', error)
      showError(error.response?.data?.message || 'Không thể tải cài đặt')
      // Set default values even on error
      setSettings({
        general: {
          store_name: 'YORI Fashion',
          store_email: 'admin@yori.vn',
          store_phone: '0988 123 456',
          store_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
          logo_url: '',
        },
        payment: undefined,
        shipping: undefined,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitGeneral = async (data: Settings['general']) => {
    try {
      setIsSaving(true)
      await adminService.updateSettingsGeneral(data)
      showSuccess('Đã cập nhật cài đặt chung thành công')
      fetchSettings()
      setHasChanges(false)
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể cập nhật cài đặt')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoUpload = async (file: File) => {
    try {
      setIsSaving(true)
      const result = await adminService.uploadLogo(file)
      showSuccess('Đã tải logo thành công')
      setLogoFile(null)
      fetchSettings()
      setHasChanges(false)
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể tải logo')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (settings) {
      reset(settings.general)
      if (settings.payment) {
        setPaymentValue('cod', settings.payment.cod?.enabled ?? true)
        setPaymentValue('bank_transfer', settings.payment.bank_transfer?.enabled ?? true)
        setPaymentValue('momo', settings.payment.momo?.enabled ?? false)
      }
      if (settings.shipping) {
        setShippingValue('default_fee', settings.shipping.default_fee ?? 30000)
        setShippingValue('free_shipping_threshold', settings.shipping.free_shipping_threshold ?? 500000)
        setShippingValue('ghn', settings.shipping.partners?.ghn?.enabled ?? true)
        setShippingValue('viettel_post', settings.shipping.partners?.viettel_post?.enabled ?? true)
        setShippingValue('ghtk', settings.shipping.partners?.ghtk?.enabled ?? false)
        setShippingValue('jnt', settings.shipping.partners?.jnt?.enabled ?? false)
      }
    } else {
      // Reset to default values if no settings
      reset({
        store_name: 'YORI Fashion',
        store_email: 'admin@yori.vn',
        store_phone: '0988 123 456',
        store_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      })
    }
    setHasChanges(false)
  }

  const handleSaveAll = async () => {
    // Save general settings
    const generalData = watch()
    await onSubmitGeneral(generalData)

    // Save payment settings
    const paymentData = watchPayment()
    await onSubmitPayment(paymentData)

    // Save shipping settings
    const shippingData = watchShipping()
    await onSubmitShipping(shippingData)
  }

  const onSubmitPayment = async (data: any) => {
    try {
      setIsSaving(true)
      await adminService.updatePaymentSettings({
        cod: data.cod,
        bank_transfer: data.bank_transfer,
        momo: data.momo,
      })
      showSuccess('Đã cập nhật cài đặt thanh toán thành công')
      fetchSettings()
      setHasChanges(false)
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể cập nhật cài đặt thanh toán')
    } finally {
      setIsSaving(false)
    }
  }

  const onSubmitShipping = async (data: any) => {
    try {
      setIsSaving(true)
      await adminService.updateShippingSettings({
        default_fee: Number(data.default_fee),
        free_shipping_threshold: Number(data.free_shipping_threshold),
        partners: {
          ghn: data.ghn,
          viettel_post: data.viettel_post,
          ghtk: data.ghtk,
          jnt: data.jnt,
        },
      })
      showSuccess('Đã cập nhật cài đặt vận chuyển thành công')
      fetchSettings()
      setHasChanges(false)
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể cập nhật cài đặt vận chuyển')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: 'storefront' },
    { id: 'payment', label: 'Thanh toán', icon: 'payments' },
    { id: 'shipping', label: 'Vận chuyển', icon: 'local_shipping' },
  ]

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-[1000px] mx-auto w-full pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-main dark:text-white">Cài đặt hệ thống</h2>
            <p className="text-text-sub dark:text-gray-400 text-sm mt-1">
              Quản lý thông tin chung, thanh toán và vận chuyển cho cửa hàng.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Hủy bỏ
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (activeTab === 'general') {
                  handleSubmit(onSubmitGeneral)()
                } else if (activeTab === 'payment') {
                  handleSubmitPayment(onSubmitPayment)()
                } else if (activeTab === 'shipping') {
                  handleSubmitShipping(onSubmitShipping)()
                }
              }}
              isLoading={isSaving}
            >
              <span className="material-symbols-outlined text-[18px] mr-2">save</span>
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
          <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-text-sub dark:text-gray-400 hover:text-text-main dark:hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
          </div>
              </div>

        {/* Settings Sections */}
        <div className="space-y-6">
                {/* General Settings */}
                {activeTab === 'general' && (
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary">
                  <span className="material-symbols-outlined">storefront</span>
                </span>
                <h3 className="font-bold text-lg text-text-main dark:text-white">Thông tin chung</h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmitGeneral)} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Logo Upload */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                      <LogoUpload
                        currentLogoUrl={settings?.general.logo_url}
                        onFileSelect={(file) => {
                          setLogoFile(file)
                          handleLogoUpload(file)
                        }}
                        accept="image/*"
                        maxSize={2}
                      />
                    </div>

                    {/* Form Fields */}
                    <div className="w-full md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Tên cửa hàng"
                      {...register('store_name', { required: 'Tên cửa hàng là bắt buộc' })}
                      error={errors.store_name?.message}
                          className="bg-gray-50 dark:bg-gray-800"
                    />
                    <Input
                          label="Số điện thoại"
                          {...register('store_phone')}
                          error={errors.store_phone?.message}
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                      <Input
                        label="Email liên hệ"
                      type="email"
                      {...register('store_email', {
                        required: 'Email là bắt buộc',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email không hợp lệ',
                        },
                      })}
                      error={errors.store_email?.message}
                        className="bg-gray-50 dark:bg-gray-800"
                    />
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                          Địa chỉ cửa hàng
                        </label>
                        <textarea
                      {...register('store_address')}
                          rows={3}
                          className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary dark:text-white px-4 py-3 resize-none"
                        />
                        {errors.store_address && (
                          <p className="text-sm text-red-500 dark:text-red-400">
                            {errors.store_address.message}
                          </p>
                        )}
                      </div>
                    </div>
                    </div>
                  </form>
                    </div>
                  </div>
                )}

                {/* Payment Settings */}
                {activeTab === 'payment' && (
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600">
                  <span className="material-symbols-outlined">payments</span>
                </span>
                <h3 className="font-bold text-lg text-text-main dark:text-white">Phương thức thanh toán</h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmitPayment(onSubmitPayment)} className="space-y-4">
                  {/* COD */}
                  <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined">local_atm</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-main dark:text-white">
                          Thanh toán khi nhận hàng (COD)
                        </h4>
                        <p className="text-xs text-text-sub dark:text-gray-400">
                          Khách hàng thanh toán tiền mặt khi nhận được hàng.
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      {...registerPayment('cod')}
                      checked={watchPayment('cod')}
                      onChange={(e) => setPaymentValue('cod', e.target.checked)}
                    />
                  </div>

                  {/* Bank Transfer */}
                  <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">account_balance</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-main dark:text-white">Chuyển khoản ngân hàng</h4>
                        <p className="text-xs text-text-sub dark:text-gray-400">
                          Thanh toán qua số tài khoản ngân hàng của cửa hàng.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={() => {
                          // TODO: Implement bank transfer setup modal
                          showError('Chức năng này sẽ được implement sau')
                        }}
                      >
                        Thiết lập
                      </button>
                      <ToggleSwitch
                        {...registerPayment('bank_transfer')}
                        checked={watchPayment('bank_transfer')}
                        onChange={(e) => setPaymentValue('bank_transfer', e.target.checked)}
                      />
                    </div>
                  </div>

                  {/* Momo */}
                  <div
                    className={`flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-primary/50 transition-colors ${
                      !watchPayment('momo') ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                        <span className="material-symbols-outlined">qr_code_scanner</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-main dark:text-white">Ví điện tử Momo</h4>
                        <p className="text-xs text-text-sub dark:text-gray-400">
                          Thanh toán nhanh qua ứng dụng Momo.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={() => {
                          // TODO: Implement Momo API configuration modal
                          showError('Chức năng này sẽ được implement sau')
                        }}
                      >
                        Cấu hình API
                      </button>
                      <ToggleSwitch
                        {...registerPayment('momo')}
                        checked={watchPayment('momo')}
                        onChange={(e) => setPaymentValue('momo', e.target.checked)}
                      />
                    </div>
                    </div>
                  </form>
              </div>
            </div>
                )}

                {/* Shipping Settings */}
                {activeTab === 'shipping' && (
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                  <span className="material-symbols-outlined">local_shipping</span>
                </span>
                <h3 className="font-bold text-lg text-text-main dark:text-white">Cấu hình vận chuyển</h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmitShipping(onSubmitShipping)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                        Phí vận chuyển mặc định (VNĐ)
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          {...registerShipping('default_fee', {
                            required: 'Phí vận chuyển là bắt buộc',
                            min: { value: 0, message: 'Phí vận chuyển phải lớn hơn hoặc bằng 0' },
                          })}
                          error={shippingErrors.default_fee?.message}
                          className="bg-gray-50 dark:bg-gray-800 pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-sub dark:text-gray-400">
                          đ
                        </span>
                      </div>
                      <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
                        Áp dụng cho tất cả đơn hàng nếu không có cấu hình khác.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                        Miễn phí vận chuyển cho đơn từ
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          {...registerShipping('free_shipping_threshold', {
                            required: 'Ngưỡng miễn phí là bắt buộc',
                            min: { value: 0, message: 'Ngưỡng miễn phí phải lớn hơn hoặc bằng 0' },
                          })}
                          error={shippingErrors.free_shipping_threshold?.message}
                          className="bg-gray-50 dark:bg-gray-800 pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-sub dark:text-gray-400">
                          đ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <h4 className="font-bold text-sm text-text-main dark:text-white mb-4">
                      Đối tác vận chuyển
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* GHN */}
                      <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            {...registerShipping('ghn')}
                            checked={watchShipping('ghn')}
                            onChange={(e) => setShippingValue('ghn', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-text-main dark:text-white">
                            Giao Hàng Nhanh (GHN)
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400">open_in_new</span>
                      </label>

                      {/* Viettel Post */}
                      <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            {...registerShipping('viettel_post')}
                            checked={watchShipping('viettel_post')}
                            onChange={(e) => setShippingValue('viettel_post', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-text-main dark:text-white">
                            Viettel Post
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400">open_in_new</span>
                      </label>

                      {/* GHTK */}
                      <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            {...registerShipping('ghtk')}
                            checked={watchShipping('ghtk')}
                            onChange={(e) => setShippingValue('ghtk', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-text-main dark:text-white">
                            Giao Hàng Tiết Kiệm (GHTK)
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400">open_in_new</span>
                      </label>

                      {/* J&T */}
                      <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            {...registerShipping('jnt')}
                            checked={watchShipping('jnt')}
                            onChange={(e) => setShippingValue('jnt', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-text-main dark:text-white">
                            J&T Express
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400">open_in_new</span>
                      </label>
                    </div>
                    </div>
                  </form>
              </div>
            </div>
                )}
          </div>
        </div>
    </AdminLayout>
  )
}

export default AdminSettings
