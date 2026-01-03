import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Button from '@/components/common/Button'
import { Category } from '@/types'

const productSchema = z.object({
    name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự'),
    price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    quantity: z.coerce.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
    category_id: z.string().min(1, 'Vui lòng chọn danh mục'),
    image: z.string().url('Vui lòng nhập URL hình ảnh hợp lệ'),
    status: z.enum(['active', 'inactive', 'out_of_stock', 'low_stock', 'draft']),
    description: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

const STATUS_OPTIONS = [
    { value: 'active', label: 'Đang bán' },
    { value: 'inactive', label: 'Ngừng bán' },
    { value: 'out_of_stock', label: 'Hết hàng' },
    { value: 'low_stock', label: 'Sắp hết hàng' },
    { value: 'draft', label: 'Bản nháp' },
]

const COLOR_OPTIONS = [
    { value: 'Đen', label: 'Đen' },
    { value: 'Trắng', label: 'Trắng' },
    { value: 'Xám', label: 'Xám' },
    { value: 'Be', label: 'Be' },
    { value: 'Navy', label: 'Navy' },
    { value: 'Đỏ', label: 'Đỏ' },
    { value: 'Xanh lá', label: 'Xanh lá' },
    { value: 'Vàng', label: 'Vàng' },
    { value: 'Hồng', label: 'Hồng' },
    { value: 'Cam', label: 'Cam' },
    { value: 'Tím', label: 'Tím' },
    { value: 'Nâu', label: 'Nâu' }
]

const SIZE_OPTIONS = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: '28', label: '28' },
    { value: '29', label: '29' },
    { value: '30', label: '30' },
    { value: '31', label: '31' },
    { value: '32', label: '32' },
    { value: '33', label: '33' },
    { value: '34', label: '34' }
]

interface ProductFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (values: ProductFormValues) => Promise<void>
    initialData?: any // Can be AdminProductItem or Product
    categories: Category[]
    isSubmitting?: boolean
    title: string
}

const ProductFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    categories,
    isSubmitting = false,
    title,
}: ProductFormModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: 0,
            quantity: 0,
            category_id: '',
            image: '',
            status: 'draft',
            description: '',
            color: '',
            size: '',
        },
    })

    useEffect(() => {
        if (isOpen && initialData) {
            // Find category id if initialData has category_name or category object
            let categoryId = ''
            if (initialData.category && typeof initialData.category === 'object') {
                categoryId = initialData.category._id || initialData.category.id || ''
            } else if (initialData.category) {
                categoryId = initialData.category
            }

            // If categoryId is still empty, look in categories list for name match if initialData.category_name exists
            if (!categoryId && initialData.category_name) {
                const cat = categories.find(c => c.name === initialData.category_name)
                if (cat) categoryId = cat._id
            }

            reset({
                name: initialData.name || '',
                price: initialData.price || 0,
                quantity: initialData.stock_quantity ?? initialData.quantity ?? 0,
                category_id: categoryId,
                image: initialData.thumbnail_url || initialData.image || '',
                status: initialData.status || 'active',
                description: initialData.description || '',
                color: Array.isArray(initialData.colors) && initialData.colors.length > 0 ? initialData.colors[0] : '',
                size: Array.isArray(initialData.sizes) && initialData.sizes.length > 0 ? initialData.sizes[0] : '',
            })
        } else if (isOpen) {
            reset({
                name: '',
                price: 0,
                quantity: 0,
                category_id: '',
                image: '',
                status: 'draft',
                description: '',
                color: '',
                size: '',
            })
        }
    }, [isOpen, initialData, reset, categories])

    const categoryOptions = categories.map((cat) => ({
        value: cat._id,
        label: cat.name,
    }))

    const handleFormSubmit = (data: ProductFormValues) => {
        const transformedData = {
            ...data,
            colors: data.color ? [data.color] : [],
            sizes: data.size ? [data.size] : [],
        }
        delete (transformedData as any).color
        delete (transformedData as any).size
        onSubmit(transformedData as any)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            label="Tên sản phẩm"
                            placeholder="Nhập tên sản phẩm"
                            {...register('name')}
                            error={errors.name?.message}
                        />
                    </div>

                    <Input
                        label="Giá bán (VNĐ)"
                        type="number"
                        placeholder="0"
                        {...register('price')}
                        error={errors.price?.message}
                    />

                    <Input
                        label="Số lượng"
                        type="number"
                        placeholder="0"
                        {...register('quantity')}
                        error={errors.quantity?.message}
                    />

                    <Select
                        label="Danh mục"
                        placeholder="Chọn danh mục"
                        options={categoryOptions}
                        {...register('category_id')}
                        error={errors.category_id?.message}
                    />

                    {initialData ? (
                        <Select
                            label="Trạng thái"
                            placeholder="Chọn trạng thái"
                            options={STATUS_OPTIONS}
                            {...register('status')}
                            error={errors.status?.message}
                        />
                    ) : (
                        <div className="hidden">
                            <input type="hidden" {...register('status')} value="draft" />
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <Input
                            label="URL Hình ảnh"
                            placeholder="https://example.com/image.jpg"
                            {...register('image')}
                            error={errors.image?.message}
                        />
                    </div>

                    <Select
                        label="Màu sắc"
                        placeholder="Chọn màu sắc"
                        options={COLOR_OPTIONS}
                        {...register('color')}
                        error={errors.color?.message}
                    />

                    <Select
                        label="Kích thước"
                        placeholder="Chọn kích thước"
                        options={SIZE_OPTIONS}
                        {...register('size')}
                        error={errors.size?.message}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-main dark:text-gray-200">
                        Mô tả sản phẩm
                    </label>
                    <textarea
                        className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
              bg-white dark:bg-[#111d21] text-text-main dark:text-white
              focus:ring-2 focus:ring-primary focus:border-transparent outline-none
              transition-all duration-300 text-sm min-h-[100px]
            `}
                        placeholder="Mô tả chi tiết sản phẩm..."
                        {...register('description')}
                    ></textarea>
                    {errors.description && (
                        <p className="text-sm text-red-500 dark:text-red-400">{errors.description.message}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit" isLoading={isSubmitting}>
                        Lưu sản phẩm
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default ProductFormModal
