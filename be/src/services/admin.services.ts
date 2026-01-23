import databaseServices from './database.services'
import { OrderStatus } from '~/models/schemas/Order.schema'
import { ObjectId } from 'mongodb'
import { createNotification } from './notifications.services'
import { NotificationTypeEnum } from '~/models/schemas/Notification.schema'

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

class AdminService {
  async getAdminProducts(params: {
    page?: number
    limit?: number
    keyword?: string
    category_id?: string
    status?: 'active' | 'out_of_stock' | 'low_stock' | 'draft'
    sort_by?: string
    order?: 'asc' | 'desc'
  }) {
    const page = params.page && params.page > 0 ? params.page : 1
    const limit = params.limit && params.limit > 0 ? params.limit : 10

    const match: any = {}

    // Build $and array for complex conditions
    const andConditions: any[] = [
      { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }
    ]

    // keyword: search by name or slug (fallback for SKU)
    if (params.keyword) {
      const regex = new RegExp(params.keyword, 'i')
      andConditions.push({ $or: [{ name: regex }, { slug: regex }] })
    }

    // category: accept slug or ObjectId string
    if (params.category_id) {
      let catId: ObjectId | undefined
      try {
        catId = new ObjectId(params.category_id)
      } catch (_) {
        // not a valid ObjectId, try slug
      }

      if (catId) {
        andConditions.push({ category: catId })
      } else {
        const cat = await databaseServices.categories.findOne({ slug: params.category_id })
        if (cat?._id) andConditions.push({ category: cat._id })
      }
    }

    // status mapping
    if (params.status === 'out_of_stock') {
      andConditions.push({ $or: [{ status: 'out_of_stock' }, { quantity: 0 }] })
    } else if (params.status === 'low_stock') {
      andConditions.push({ $or: [{ status: 'low_stock' }, { quantity: { $gt: 0, $lt: 10 } }] })
    } else if (params.status === 'active') {
      // Active: quantity > 0 and status is not 'inactive' or 'draft'
      andConditions.push({ quantity: { $gt: 0 } })
      andConditions.push({ status: { $nin: ['inactive', 'draft'] } })
    } else if (params.status === 'draft') {
      // Draft: status must be 'draft'
      andConditions.push({ status: 'draft' })
    }

    // Apply $and if we have multiple conditions, otherwise use the single condition
    if (andConditions.length > 1) {
      match.$and = andConditions
    } else if (andConditions.length === 1) {
      Object.assign(match, andConditions[0])
    }

    // sorting
    const sort: any = {}
    const sortBy = params.sort_by || 'created_at'
    sort[sortBy] = params.order === 'asc' ? 1 : -1

    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      databaseServices.products.find(match).sort(sort).skip(skip).limit(limit).toArray(),
      databaseServices.products.countDocuments(match)
    ])

    // fetch categories for name mapping
    const categoryIds = Array.from(
      new Set(items.map((p) => (p.category ? p.category.toString() : undefined)).filter((v): v is string => Boolean(v)))
    ).map((id) => new ObjectId(id))

    const categories = categoryIds.length
      ? await databaseServices.categories
        .find({ _id: { $in: categoryIds } })
        .project({ name: 1 })
        .toArray()
      : []

    const catMap = new Map(categories.map((c) => [c._id?.toString(), c.name]))
    const toVnCurrency = (n: number) => `${new Intl.NumberFormat('vi-VN').format(n)}đ`

    const mapStatus = (p: any) => {
      const qty = p.quantity ?? 0
      // Respect DB status first
      if (p.status === 'inactive')
        return { stock_status: 'inactive', status: 'inactive', status_label: 'Ngừng bán', status_color: 'red' }
      if (p.status === 'draft')
        return { stock_status: 'draft', status: 'draft', status_label: 'Bản nháp', status_color: 'gray' }

      // Then check stock
      if (qty === 0 || p.status === 'out_of_stock')
        return { stock_status: 'out_of_stock', status: 'out_of_stock', status_label: 'Hết hàng', status_color: 'red' }
      if (qty < 10 || p.status === 'low_stock')
        return { stock_status: 'low_stock', status: 'active', status_label: 'Sắp hết', status_color: 'yellow' }

      return { stock_status: 'in_stock', status: 'active', status_label: 'Đang bán', status_color: 'green' }
    }

    const mapped = items.map((p) => {
      const qty = p.quantity ?? 0
      const m = mapStatus(p)
      return {
        _id: p._id?.toString() || '',
        id: p._id?.toString() || '',
        name: p.name,
        sku: p.slug,
        image: p.image,
        thumbnail_url: p.image,
        category: p.category?.toString() || '',
        category_name: catMap.get(p.category?.toString()) || '',
        price: p.price,
        price_display: toVnCurrency(p.price || 0),
        stock_quantity: qty,
        stock_status: m.stock_status,
        status: p.status || m.status,
        status_label: m.status_label,
        status_color: m.status_color,
        description: p.description || '',
        colors: p.colors || [],
        sizes: p.sizes || []
      }
    })

    const startIdx = total === 0 ? 0 : (page - 1) * limit + 1
    const endIdx = Math.min(page * limit, total)

    return {
      products: mapped,
      pagination: {
        page,
        limit,
        total_page: Math.ceil(total / limit) || 1,
        total
      }
    }
  }
  async getAdminOrderStats() {
    const [total, pending, processing, shipping, completed, cancelled] = await Promise.all([
      databaseServices.orders.countDocuments({}),
      databaseServices.orders.countDocuments({ status: OrderStatus.Pending }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Processing }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Shipping }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Completed }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Cancelled })
    ])
    return { pending, processing, shipping, completed, cancelled, total }
  }

  /**
   * Lấy phân bổ đơn hàng theo trạng thái (cho order status distribution)
   * Backend endpoint: GET /admin/dashboard/order-status-distribution
   */
  async getOrderStatusDistribution(params?: { start_date?: string; end_date?: string }) {
    const match: any = {}
    if (params?.start_date || params?.end_date) {
      match.created_at = {}
      if (params?.start_date) match.created_at.$gte = new Date(params.start_date)
      if (params?.end_date) match.created_at.$lte = new Date(params.end_date)
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$cost_summary.total' }
        }
      }
    ]

    const results = await databaseServices.orders.aggregate(pipeline).toArray()

    const statusMap: Record<string, { label: string; color: string; icon: string }> = {
      pending: { label: 'Chờ xử lý', color: '#f59e0b', icon: 'schedule' },
      processing: { label: 'Đang xử lý', color: '#3b82f6', icon: 'settings' },
      shipping: { label: 'Đang giao', color: '#8b5cf6', icon: 'local_shipping' },
      completed: { label: 'Hoàn thành', color: '#10b981', icon: 'check_circle' },
      cancelled: { label: 'Đã hủy', color: '#ef4444', icon: 'cancel' }
    }

    return results
      .map((item) => {
        const status = item._id || 'pending'
        const config = statusMap[status] || statusMap.pending

        return {
          status,
          label: config.label,
          count: item.count || 0,
          revenue: item.revenue || 0,
          color: config.color,
          icon: config.icon
        }
      })
      .filter((item) => item.count > 0) // Chỉ hiển thị status có đơn hàng
      .sort((a, b) => {
        // Sort theo thứ tự: pending, processing, shipping, completed, cancelled
        const order = ['pending', 'processing', 'shipping', 'completed', 'cancelled']
        return order.indexOf(a.status) - order.indexOf(b.status)
      })
  }

  async getAdminOrders(params: {
    page?: number
    limit?: number
    keyword?: string
    status?: 'pending' | 'shipping' | 'completed' | 'cancelled' | 'processing'
    date_from?: string
    date_to?: string
    sort_by?: string
    order?: 'asc' | 'desc'
  }) {
    const page = params.page && params.page > 0 ? params.page : 1
    const limit = params.limit && params.limit > 0 ? params.limit : 10

    const match: any = {}
    if (params.status) match.status = params.status

    if (params.date_from || params.date_to) {
      match.created_at = {}
      if (params.date_from) {
        const d = new Date(params.date_from)
        d.setHours(0, 0, 0, 0)
        match.created_at.$gte = d
      }
      if (params.date_to) {
        const d = new Date(params.date_to)
        d.setHours(23, 59, 59, 999)
        match.created_at.$lte = d
      }
    }

    const sort: any = {}
    const sortBy = params.sort_by || 'created_at'
    sort[sortBy] = params.order === 'asc' ? 1 : -1

    // Build pipeline with optional keyword search on order_code OR user name/email
    const pipeline: any[] = [{ $match: match }]

    pipeline.push(
      {
        $lookup: {
          from: process.env.DB_USERS_COLLECTION as string,
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
    )

    if (params.keyword) {
      const regex = new RegExp(params.keyword, 'i')
      pipeline.push({
        $match: {
          $or: [{ order_code: regex }, { 'user.full_name': regex }, { 'user.email': regex }]
        }
      })
    }

    const countPipeline = [...pipeline, { $count: 'total' }]
    pipeline.push({ $sort: sort }, { $skip: (page - 1) * limit }, { $limit: limit })

    const [rows, totalAgg] = await Promise.all([
      databaseServices.orders.aggregate(pipeline).toArray(),
      databaseServices.orders.aggregate(countPipeline).toArray()
    ])

    const total = totalAgg[0]?.total || 0

    const fmtMoney = (n: number) => `${new Intl.NumberFormat('vi-VN').format(n)}đ`
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Chờ xử lý', color: 'yellow' },
      processing: { label: 'Đang xử lý', color: 'blue' },
      shipping: { label: 'Đang giao', color: 'blue' },
      completed: { label: 'Hoàn thành', color: 'green' },
      cancelled: { label: 'Đã hủy', color: 'red' }
    }

    const paymentLabel = (method?: string) => {
      const cod = method?.toLowerCase().includes('cod')
      return cod ? { status: 'unpaid', label: 'Chưa thanh toán' } : { status: 'paid', label: 'Đã thanh toán' }
    }

    const items = rows.map((o) => {
      const first = o.items?.[0]
      const more = Math.max((o.items?.length || 0) - 1, 0)
      const sm = statusMap[o.status] || { label: o.status, color: 'yellow' }
      const pay = paymentLabel(o.shipping_info?.payment_method)
      const created = o.created_at ? new Date(o.created_at) : new Date()
      const created_at_display = created.toLocaleDateString('vi-VN')
      const created_time_display = created.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      return {
        _id: o._id?.toString() || '',
        id: o._id?.toString() || '',
        order_code: o.order_code,
        customer: {
          id: o.user?._id?.toString() || '',
          name: o.user?.full_name || o.shipping_info?.receiver_name || '',
          email: o.user?.email || o.shipping_info?.email || '',
          avatar_url: o.user?.avatar || ''
        },
        product_summary: first ? `${first.name} (x${first.quantity})` : '',
        product_more_count: more,
        created_at: o.created_at ? o.created_at.toISOString() : undefined,
        created_at_display,
        created_time_display,
        total: o.cost_summary?.total || 0,
        total_display: fmtMoney(o.cost_summary?.total || 0),
        payment_status: pay.status,
        payment_status_label: pay.label,
        status: o.status,
        status_label: sm.label,
        status_color: sm.color
      }
    })

    return {
      orders: items,
      pagination: {
        page,
        limit,
        total_page: Math.ceil(total / limit) || 1,
        total
      }
    }
  }

  async updateAdminOrderStatus(id: string, status: OrderStatus) {
    const _id = new ObjectId(id)
    const order = await databaseServices.orders.findOne({ _id })

    if (!order) {
      throw new Error('Order not found')
    }

    // Validate status transition: không cho chuyển từ cancelled sang các status khác
    if (order.status === OrderStatus.Cancelled && status !== OrderStatus.Cancelled) {
      throw new Error('Cannot change status from cancelled to other status')
    }

    await databaseServices.orders.updateOne(
      { _id },
      {
        $set: {
          status,
          updated_at: new Date()
        }
      }
    )

    const statusLabels: Record<OrderStatus, string> = {
      [OrderStatus.Pending]: 'Chờ xử lý',
      [OrderStatus.Processing]: 'Đang xử lý',
      [OrderStatus.Shipping]: 'Đang giao',
      [OrderStatus.Completed]: 'Hoàn thành',
      [OrderStatus.Cancelled]: 'Đã hủy'
    }

    // Tạo notification cho customer
    try {
      await createNotification({
        user_id: order.user_id.toString(),
        type: NotificationTypeEnum.OrderStatusUpdate,
        title: 'Cập nhật trạng thái đơn hàng',
        message: `Đơn hàng ${order.order_code} của bạn đã được cập nhật trạng thái thành "${statusLabels[status]}"`,
        data: {
          order_id: id,
          order_code: order.order_code
        }
      })
    } catch (error) {
      console.error('Error creating notification:', error)
      // Không throw error để không ảnh hưởng đến việc update order
    }

    return {
      message: `Đã cập nhật trạng thái đơn hàng thành ${statusLabels[status]}`,
      order_id: id,
      new_status: status
    }
  }

  async createAdminProduct(payload: {
    name: string
    price: number
    quantity: number
    category_id: string
    image: string
    status?: string
    description?: string
    is_featured?: boolean
    colors?: string[]
    sizes?: string[]
  }) {
    // Basic slug generation (can be improved)
    const slug = payload.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

    const doc: any = {
      name: payload.name,
      slug: `${slug}-${Date.now()}`,
      price: payload.price,
      quantity: payload.quantity,
      image: payload.image,
      description: payload.description || '',
      is_featured: payload.is_featured || false,
      colors: payload.colors || [],
      sizes: payload.sizes || [],
      status: payload.status || 'active',
      created_at: new Date(),
      updated_at: new Date()
    }

    if (payload.category_id) {
      let catId: ObjectId | undefined
      try {
        catId = new ObjectId(payload.category_id)
      } catch (_) {
        // ignore invalid ObjectId
      }
      if (catId) {
        doc.category = catId
      } else {
        const cat = await databaseServices.categories.findOne({ slug: payload.category_id })
        if (cat?._id) doc.category = cat._id
      }
    }

    const result = await databaseServices.products.insertOne(doc)
    return this.getAdminProductDetail(result.insertedId.toString())
  }

  async getAdminProductDetail(id: string) {
    const _id = new ObjectId(id)
    const p = await databaseServices.products.findOne({ _id })
    if (!p) return null
    const cat = p.category
      ? await databaseServices.categories.findOne({ _id: p.category }, { projection: { name: 1 } })
      : null
    return {
      ...p,
      category_name: cat?.name || ''
    }
  }

  async updateAdminProduct(
    id: string,
    payload: {
      name?: string
      price?: number
      quantity?: number
      category_id?: string
      image?: string
      status?: string
      description?: string
      is_featured?: boolean
      colors?: string[]
      sizes?: string[]
    }
  ) {
    const _id = new ObjectId(id)
    const set: any = { updated_at: new Date() }
    if (payload.name !== undefined) set.name = payload.name
    if (payload.price !== undefined) set.price = payload.price
    if (payload.quantity !== undefined) set.quantity = payload.quantity
    if (payload.image !== undefined) set.image = payload.image
    if (payload.status !== undefined) set.status = payload.status
    if (payload.description !== undefined) set.description = payload.description
    if (payload.is_featured !== undefined) set.is_featured = payload.is_featured
    if (payload.colors !== undefined) set.colors = payload.colors
    if (payload.sizes !== undefined) set.sizes = payload.sizes
    if (payload.category_id) {
      let catId: ObjectId | undefined
      try {
        catId = new ObjectId(payload.category_id)
      } catch (_) {
        // ignore invalid ObjectId, will try slug fallback
      }
      if (catId) {
        set.category = catId
      } else {
        const cat = await databaseServices.categories.findOne({ slug: payload.category_id })
        if (cat?._id) set.category = cat._id
      }
    }

    await databaseServices.products.updateOne({ _id }, { $set: set })
    return this.getAdminProductDetail(id)
  }

  async deleteAdminProduct(id: string) {
    const _id = new ObjectId(id)
    await databaseServices.products.updateOne({ _id }, { $set: { deleted_at: new Date(), updated_at: new Date() } })
    return { message: 'Đã xóa sản phẩm (soft delete) thành công' }
  }
  async getAdminProductsMetadata() {
    const categories = await databaseServices.categories
      .find({}, { projection: { name: 1, slug: 1 } })
      .sort({ name: 1 })
      .toArray()

    const formatted = categories.map((c) => ({ id: c._id, name: c.name, slug: c.slug }))

    const statuses = [
      { value: 'active', label: 'Đang bán' },
      { value: 'out_of_stock', label: 'Hết hàng' },
      { value: 'draft', label: 'Bản nháp' }
    ]

    return { categories: formatted, statuses }
  }
  async getDashboardStats(params?: { start_date?: string; end_date?: string }) {
    const now = new Date()
    const todayStart = startOfDay(now)

    // Determine current period
    let currentStart: Date
    let currentEnd: Date = params?.end_date ? new Date(params.end_date) : now
    let previousStart: Date
    let previousEnd: Date

    if (params?.start_date && params?.end_date) {
      // Custom date range
      currentStart = new Date(params.start_date)
      currentEnd = new Date(params.end_date)
      const periodDays = Math.ceil((currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24))
      previousEnd = addDays(currentStart, -1)
      previousStart = addDays(previousEnd, -periodDays)
    } else if (params?.start_date) {
      // Start date only - use until now
      currentStart = new Date(params.start_date)
      const periodDays = Math.ceil((currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24))
      previousEnd = addDays(currentStart, -1)
      previousStart = addDays(previousEnd, -periodDays)
    } else {
      // Default: current month
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
      previousEnd = addDays(currentStart, -1)
      previousStart = new Date(previousEnd.getFullYear(), previousEnd.getMonth(), 1)
    }

    // Current period stats
    const currentMatch: any = {
      status: { $ne: OrderStatus.Cancelled },
      created_at: { $gte: currentStart, $lte: currentEnd }
    }

    const [
      currentRevenue,
      currentOrders,
      currentCustomers,
      currentProducts
    ] = await Promise.all([
      databaseServices.orders
        .aggregate([{ $match: currentMatch }, { $group: { _id: null, revenue: { $sum: '$cost_summary.total' } } }])
        .toArray()
        .then((r) => r[0]?.revenue || 0),
      databaseServices.orders.countDocuments(currentMatch),
      databaseServices.users.countDocuments({ createdAt: { $gte: currentStart, $lte: currentEnd } }),
      databaseServices.products.countDocuments({
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        createdAt: { $gte: currentStart, $lte: currentEnd }
      })
    ])

    // Previous period stats (for comparison)
    const previousMatch: any = {
      status: { $ne: OrderStatus.Cancelled },
      created_at: { $gte: previousStart, $lte: previousEnd }
    }

    const [
      previousRevenue,
      previousOrders,
      previousCustomers,
      previousProducts
    ] = await Promise.all([
      databaseServices.orders
        .aggregate([{ $match: previousMatch }, { $group: { _id: null, revenue: { $sum: '$cost_summary.total' } } }])
        .toArray()
        .then((r) => r[0]?.revenue || 0),
      databaseServices.orders.countDocuments(previousMatch),
      databaseServices.users.countDocuments({ createdAt: { $gte: previousStart, $lte: previousEnd } }),
      databaseServices.products.countDocuments({
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        createdAt: { $gte: previousStart, $lte: previousEnd }
      })
    ])

    // Calculate percentage change
    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    // Calculate average order value
    const averageOrderValue = currentOrders > 0 ? currentRevenue / currentOrders : 0
    const previousAverageOrderValue = previousOrders > 0 ? previousRevenue / previousOrders : 0
    const averageOrderValueChange = calculateChange(averageOrderValue, previousAverageOrderValue)

    // Calculate conversion rate (simplified: orders / customers * 100)
    // Note: This is a simplified calculation. Real conversion rate would need visitor data
    const conversionRate = currentCustomers > 0 ? (currentOrders / currentCustomers) * 100 : 0
    const previousConversionRate = previousCustomers > 0 ? (previousOrders / previousCustomers) * 100 : 0
    const conversionRateChange = calculateChange(conversionRate, previousConversionRate)

    return {
      total_revenue: currentRevenue,
      total_orders: currentOrders,
      total_customers: currentCustomers,
      total_products: currentProducts,
      average_order_value: averageOrderValue,
      conversion_rate: conversionRate,
      revenue_change: calculateChange(currentRevenue, previousRevenue),
      orders_change: calculateChange(currentOrders, previousOrders),
      customers_change: calculateChange(currentCustomers, previousCustomers),
      products_change: calculateChange(currentProducts, previousProducts),
      average_order_value_change: averageOrderValueChange,
      conversion_rate_change: conversionRateChange
    }
  }

  async getRevenueChart(params?: { start_date?: string; end_date?: string; days?: number }) {
    // default last 30 days
    const end = params?.end_date ? new Date(params.end_date) : new Date()
    const start = params?.start_date ? new Date(params.start_date) : addDays(end, -(params?.days ?? 30))

    const pipeline = [
      { $match: { status: { $ne: OrderStatus.Cancelled }, created_at: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$created_at', timezone: 'Asia/Ho_Chi_Minh' } }
          },
          revenue: { $sum: '$cost_summary.total' },
          orders: { $sum: 1 }
        }
      },
      { $project: { _id: 0, date: '$_id.day', revenue: 1, orders: 1 } },
      { $sort: { date: 1 } }
    ]

    const rows = await databaseServices.orders.aggregate(pipeline).toArray()

    // fill missing days
    const points: Array<{ date: string; revenue: number; orders: number }> = []
    for (let d = startOfDay(start); d <= startOfDay(end); d = addDays(d, 1)) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const found = rows.find((r) => r.date === key)
      points.push({ date: key, revenue: found?.revenue || 0, orders: found?.orders || 0 })
    }

    return points
  }

  async getStatsOverview(params?: { start_date?: string; end_date?: string }) {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = addDays(todayStart, -7)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const yearStart = new Date(now.getFullYear(), 0, 1)

    const calculateStats = async (start: Date, end: Date) => {
      const match: any = {
        status: { $ne: OrderStatus.Cancelled },
        created_at: { $gte: start, $lte: end }
      }

      const [total_revenue, total_orders, total_customers, total_products] = await Promise.all([
        databaseServices.orders
          .aggregate([{ $match: match }, { $group: { _id: null, revenue: { $sum: '$cost_summary.total' } } }])
          .toArray()
          .then((r) => r[0]?.revenue || 0),
        databaseServices.orders.countDocuments(match),
        databaseServices.users.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        databaseServices.products.countDocuments({
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
          createdAt: { $gte: start, $lte: end }
        })
      ])

      return { total_revenue, total_orders, total_customers, total_products }
    }

    const [today, this_week, this_month, this_year] = await Promise.all([
      calculateStats(todayStart, now),
      calculateStats(weekStart, now),
      calculateStats(monthStart, now),
      calculateStats(yearStart, now)
    ])

    return { today, this_week, this_month, this_year }
  }

  /**
   * Lấy revenue theo category (cho pie chart)
   * Backend endpoint: GET /admin/dashboard/category-revenue
   */
  async getCategoryRevenue(params?: { start_date?: string; end_date?: string }) {
    const match: any = { status: { $ne: OrderStatus.Cancelled } }
    if (params?.start_date || params?.end_date) {
      match.created_at = {}
      if (params?.start_date) match.created_at.$gte = new Date(params.start_date)
      if (params?.end_date) match.created_at.$lte = new Date(params.end_date)
    }

    const pipeline = [
      { $match: match },
      { $unwind: '$items' },
      {
        $lookup: {
          from: process.env.DB_PRODUCTS_COLLECTION as string,
          let: { product_id: '$items.product_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$product_id']
                }
              }
            }
          ],
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: false } },
      {
        $match: {
          'product.category': { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: process.env.DB_CATEGORIES_COLLECTION as string,
          let: { category_id: '$product.category' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$category_id']
                }
              }
            }
          ],
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: '$category._id',
          name: { $first: '$category.name' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { revenue: -1 } }
    ]

    const results = await databaseServices.orders.aggregate(pipeline).toArray()
    
    // Debug: Log để kiểm tra
    console.log('[getCategoryRevenue] Match filter:', JSON.stringify(match, null, 2))
    console.log('[getCategoryRevenue] Results count:', results.length)
    if (results.length > 0) {
      console.log('[getCategoryRevenue] Sample result:', JSON.stringify(results[0], null, 2))
    } else {
      // Debug: Kiểm tra xem có orders không
      const orderCount = await databaseServices.orders.countDocuments(match)
      console.log('[getCategoryRevenue] Total orders matching filter:', orderCount)
      
      // Debug: Kiểm tra xem có products với categories không
      const sampleOrder = await databaseServices.orders.findOne(match)
      if (sampleOrder && sampleOrder.items && sampleOrder.items.length > 0) {
        console.log('[getCategoryRevenue] Sample order items:', sampleOrder.items.length)
        const productIds = sampleOrder.items.map((item: any) => item.product_id)
        const products = await databaseServices.products
          .find({ _id: { $in: productIds } })
          .toArray()
        console.log('[getCategoryRevenue] Products found:', products.length)
        products.forEach((p: any) => {
          console.log(`[getCategoryRevenue] Product ${p.name}: category = ${p.category}`)
        })
      }
    }

    // Calculate total revenue for percentage
    const totalRevenue = results.reduce((sum, item) => sum + (item.revenue || 0), 0)

    // Map to colors (có thể config sau)
    const colors = ['#19b3e6', '#8b5cf6', '#f97316', '#10b981', '#ef4444', '#06b6d4', '#84cc16', '#f59e0b']

    const mapped = results.map((item, index) => ({
      id: item._id?.toString() || '',
      name: item.name || 'Khác',
      value: item.revenue || 0,
      percentage: totalRevenue > 0 ? ((item.revenue || 0) / totalRevenue) * 100 : 0,
      color: colors[index % colors.length]
    }))

    console.log('Mapped Category Revenue:', JSON.stringify(mapped, null, 2))

    return mapped
  }

  /**
   * Lấy top products bán chạy (cho top products list)
   * Backend endpoint: GET /admin/dashboard/top-products
   */
  async getTopProducts(params?: { start_date?: string; end_date?: string; limit?: number }) {
    const match: any = { status: { $ne: OrderStatus.Cancelled } }
    if (params?.start_date || params?.end_date) {
      match.created_at = {}
      if (params?.start_date) match.created_at.$gte = new Date(params.start_date)
      if (params?.end_date) match.created_at.$lte = new Date(params.end_date)
    }

    const limit = params?.limit || 10

    const pipeline = [
      { $match: match },
      { $unwind: '$items' },
      {
        $lookup: {
          from: process.env.DB_PRODUCTS_COLLECTION as string,
          let: { product_id: '$items.product_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$product_id']
                }
              }
            }
          ],
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$items.product_id',
          name: { $first: '$items.name' },
          image: { $first: '$items.thumbnail_url' },
          revenue: { $sum: '$items.total' },
          sold_count: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit }
    ]

    const results = await databaseServices.orders.aggregate(pipeline).toArray()

    // Filter out any potential duplicates by id (shouldn't happen but just in case)
    const uniqueResults = results.filter(
      (item, index, self) => index === self.findIndex((t) => t._id?.toString() === item._id?.toString())
    )

    return uniqueResults.map((item) => ({
      id: item._id?.toString() || '',
      name: item.name || 'Sản phẩm không xác định',
      image: item.image || undefined,
      revenue: item.revenue || 0,
      sold_count: item.sold_count || 0
    }))
  }

  /**
   * Lấy chi tiết doanh thu theo ngày
   * Backend endpoint: GET /admin/dashboard/daily-revenue
   */
  async getDailyRevenue(params?: { start_date?: string; end_date?: string; limit?: number }) {
    const match: any = { status: { $ne: OrderStatus.Cancelled } }
    if (params?.start_date || params?.end_date) {
      match.created_at = {}
      if (params?.start_date) match.created_at.$gte = new Date(params.start_date)
      if (params?.end_date) match.created_at.$lte = new Date(params.end_date)
    }

    const limit = params?.limit || 7 // Default 7 days

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$created_at'
            }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$cost_summary.total' },
          profit: {
            $sum: {
              $subtract: ['$cost_summary.total', { $multiply: ['$cost_summary.total', 0.3] }] // Giả sử profit = 70% revenue
            }
          },
          new_customers: { $addToSet: '$user_id' }
        }
      },
      {
        $project: {
          date: '$_id',
          orders: 1,
          revenue: 1,
          profit: 1,
          new_customers: { $size: '$new_customers' }
        }
      },
      { $sort: { date: -1 } },
      { $limit: limit }
    ]

    const results = await databaseServices.orders.aggregate(pipeline).toArray()

    // Calculate average revenue for status determination
    const avgRevenue = results.length > 0
      ? results.reduce((sum, item) => sum + (item.revenue || 0), 0) / results.length
      : 0

    return results.map((item) => {
      // Determine status based on revenue compared to average
      let status: 'good' | 'warning' | 'bad' = 'good'
      if (item.revenue < avgRevenue * 0.7) {
        status = 'bad'
      } else if (item.revenue < avgRevenue * 0.9) {
        status = 'warning'
      }

      return {
        date: item.date,
        orders: item.orders || 0,
        revenue: item.revenue || 0,
        profit: item.profit || 0,
        new_customers: item.new_customers || 0,
        status
      }
    })
  }

  async getAdminCustomers(params: {
    page?: number
    limit?: number
    keyword?: string
    status?: 'active' | 'inactive' | 'new'
    sort_by?: 'created_at' | 'total_spent' | 'order_count'
    order?: 'asc' | 'desc'
  }) {
    const page = params.page && params.page > 0 ? params.page : 1
    const limit = params.limit && params.limit > 0 ? params.limit : 10

    const match: any = {}
    if (params.keyword) {
      const regex = new RegExp(params.keyword, 'i')
      match.$or = [{ full_name: regex }, { email: regex }, { phonenumber: regex }]
    }

    // status mapping using verify and createdAt
    const now = new Date()
    const newSince = new Date(now)
    newSince.setDate(newSince.getDate() - 30)
    if (params.status === 'inactive') {
      match.verify = 2 // UserVerifyStatus.Banned
    } else if (params.status === 'new') {
      match.createdAt = { $gte: newSince }
      // Exclude banned users when filtering for 'new'
      match.verify = { $ne: 2 } // Not banned
    } else if (params.status === 'active') {
      // Active users: not banned
      match.verify = { $ne: 2 } // Not banned
    }

    const sortBy = params.sort_by || 'created_at'
    const order = params.order === 'asc' ? 1 : -1

    // Aggregate users with orders stats
    const pipeline: any[] = [{ $match: match }]
    pipeline.push(
      {
        $lookup: {
          from: process.env.DB_ORDERS_COLLECTION as string,
          localField: '_id',
          foreignField: 'user_id',
          as: 'orders'
        }
      },
      {
        $addFields: {
          order_count: { $size: { $ifNull: ['$orders', []] } },
          total_spent: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'o',
                in: { $ifNull: ['$$o.cost_summary.total', 0] }
              }
            }
          }
        }
      },
      { $project: { orders: 0 } }
    )

    // Sorting
    const sort: any = {}
    if (sortBy === 'created_at') sort.createdAt = order
    else if (sortBy === 'total_spent') sort.total_spent = order
    else if (sortBy === 'order_count') sort.order_count = order
    else sort.createdAt = -1

    const countPipeline = [...pipeline, { $count: 'total' }]
    pipeline.push({ $sort: sort }, { $skip: (page - 1) * limit }, { $limit: limit })

    const [rows, totalAgg] = await Promise.all([
      databaseServices.users.aggregate(pipeline).toArray(),
      databaseServices.users.aggregate(countPipeline).toArray()
    ])

    const total = totalAgg[0]?.total || 0
    const toVn = (n: number) => `${new Intl.NumberFormat('vi-VN').format(n)}đ`

    const items = rows.map((u) => {
      const isInactive = u.verify === 2 // Banned
      const isNew = u.createdAt && u.createdAt >= newSince
      const status = isInactive ? 'inactive' : isNew ? 'new' : 'active'
      const map: any = {
        inactive: { label: 'Bị khóa', color: 'red' },
        new: { label: 'Mới', color: 'blue' },
        active: { label: 'Hoạt động', color: 'green' }
      }
      const s = map[status]
      const code = `#USR-${u._id?.toString().slice(-6).toUpperCase()}`
      return {
        _id: u._id?.toString() || '',
        id: u._id?.toString() || '',
        customer_code: code,
        first_name: u.full_name?.split(' ')[0] || '',
        last_name: u.full_name?.split(' ').slice(1).join(' ') || '',
        full_name: u.full_name || '',
        name: u.full_name || '',
        avatar_url: u.avatar || null,
        email: u.email || '',
        phonenumber: u.phonenumber || '',
        phone: u.phonenumber || '',
        type: 'registered',
        status: status,
        orders_count: u.order_count || 0,
        stats: {
          order_count: u.order_count || 0,
          total_spent: u.total_spent || 0,
          total_spent_display: toVn(u.total_spent || 0)
        },
        status_label: s.label,
        status_color: s.color,
        createdAt: u.createdAt ? u.createdAt.toISOString() : undefined,
        joined_at: u.createdAt,
        joined_at_display: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : ''
      }
    })

    return {
      customers: items,
      pagination: {
        page,
        limit,
        total_page: Math.ceil(total / limit) || 1,
        total
      }
    }
  }

  async getAdminCustomerDetail(id: string) {
    const _id = new ObjectId(id)
    const user = await databaseServices.users.findOne({ _id })
    if (!user) return null
    const recent_orders_raw = await databaseServices.orders
      .find({ user_id: _id }, { projection: { order_code: 1, created_at: 1, status: 1, cost_summary: 1 } })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray()
    
    // Map orders to ensure cost_summary.total is accessible
    const recent_orders = recent_orders_raw.map((order: any) => ({
      order_code: order.order_code,
      created_at: order.created_at ? order.created_at.toISOString() : undefined,
      status: order.status,
      total: order.cost_summary?.total || 0,
      'cost_summary.total': order.cost_summary?.total || 0,
      cost_summary: {
        total: order.cost_summary?.total || 0
      }
    }))
    
    return {
      id: user._id,
      info: {
        name: user.full_name,
        email: user.email,
        phone: user.phonenumber || ''
      },
      addresses: user.address ? [{ id: 1, full_address: user.address, is_default: true }] : [],
      recent_orders
    }
  }

  async updateAdminCustomerStatus(id: string, status: 'active' | 'inactive') {
    const _id = new ObjectId(id)
    const verify = status === 'inactive' ? 2 : 1 // Banned : Verified
    await databaseServices.users.updateOne({ _id }, { $set: { verify, updatedAt: new Date() } })
    
    // Tạo notification cho customer khi tài khoản bị khóa
    if (status === 'inactive') {
      try {
        await createNotification({
          user_id: id,
          type: NotificationTypeEnum.AccountBanned,
          title: 'Tài khoản bị khóa',
          message: 'Tài khoản của bạn đã bị khóa bởi quản trị viên. Vui lòng liên hệ hỗ trợ để được giải quyết.',
          data: {}
        })
      } catch (error) {
        console.error('Error creating notification for banned account:', error)
        // Không throw error để không ảnh hưởng đến việc khóa tài khoản
      }
    }
    
    return { message: status === 'inactive' ? 'Đã khóa tài khoản khách hàng' : 'Đã mở khóa tài khoản khách hàng' }
  }

  // ========== SETTINGS ==========
  private async getOrInitSettings() {
    let doc = await databaseServices.settings.findOne({ key: 'system' })
    if (!doc) {
      doc = {
        key: 'system',
        general: {
          store_name: 'YORI Fashion',
          phone: '',
          email: '',
          address: '',
          logo_url: ''
        },
        payment: {
          cod: { enabled: true, label: 'Thanh toán khi nhận hàng (COD)' },
          bank_transfer: { enabled: true, label: 'Chuyển khoản ngân hàng', config_needed: false },
          momo: { enabled: false, label: 'Ví điện tử Momo', config_needed: true }
        },
        shipping: {
          default_fee: 30000,
          free_shipping_threshold: 500000,
          partners: {
            ghn: { enabled: true, label: 'Giao Hàng Nhanh (GHN)' },
            viettel_post: { enabled: true, label: 'Viettel Post' },
            ghtk: { enabled: false, label: 'Giao Hàng Tiết Kiệm (GHTK)' },
            jnt: { enabled: false, label: 'J&T Express' }
          }
        },
        updated_at: new Date()
      }
      await databaseServices.settings.insertOne(doc)
    }
    return doc
  }

  async getAdminSettings() {
    const doc = await this.getOrInitSettings()
    return { general: doc.general, payment: doc.payment, shipping: doc.shipping }
  }

  async updateAdminSettingsGeneral(payload: { store_name?: string; phone?: string; email?: string; address?: string }) {
    const doc = await this.getOrInitSettings()
    const general = { ...doc.general, ...payload }
    await databaseServices.settings.updateOne({ key: 'system' }, { $set: { general, updated_at: new Date() } })
    return { message: 'Cập nhật thông tin cửa hàng thành công' }
  }

  async updateAdminSettingsLogo(payload: { logo_url: string }) {
    if (!payload.logo_url) return { message: 'Thiếu logo_url' }
    const doc = await this.getOrInitSettings()
    const general = { ...doc.general, logo_url: payload.logo_url }
    await databaseServices.settings.updateOne({ key: 'system' }, { $set: { general, updated_at: new Date() } })
    return { message: 'Logo đã được cập nhật', data: { logo_url: payload.logo_url } }
  }

  async updateAdminSettingsPayment(payload: { cod?: boolean; bank_transfer?: boolean; momo?: boolean }) {
    const doc = await this.getOrInitSettings()
    const payment = { ...doc.payment }
    if (typeof payload.cod === 'boolean') payment.cod.enabled = payload.cod
    if (typeof payload.bank_transfer === 'boolean') payment.bank_transfer.enabled = payload.bank_transfer
    if (typeof payload.momo === 'boolean') payment.momo.enabled = payload.momo
    await databaseServices.settings.updateOne({ key: 'system' }, { $set: { payment, updated_at: new Date() } })
    return { message: 'Đã cập nhật cấu hình thanh toán' }
  }

  async updateAdminSettingsShipping(payload: {
    default_fee?: number
    free_shipping_threshold?: number
    partners?: { ghn?: boolean; viettel_post?: boolean; ghtk?: boolean; jnt?: boolean }
  }) {
    const doc = await this.getOrInitSettings()
    const shipping = { ...doc.shipping }
    if (typeof payload.default_fee === 'number') {
      shipping.default_fee = payload.default_fee
    }
    if (typeof payload.free_shipping_threshold === 'number') {
      shipping.free_shipping_threshold = payload.free_shipping_threshold
    }
    if (payload.partners) {
      shipping.partners.ghn.enabled = payload.partners.ghn ?? shipping.partners.ghn.enabled
      shipping.partners.viettel_post.enabled = payload.partners.viettel_post ?? shipping.partners.viettel_post.enabled
      shipping.partners.ghtk.enabled = payload.partners.ghtk ?? shipping.partners.ghtk.enabled
      shipping.partners.jnt.enabled = payload.partners.jnt ?? shipping.partners.jnt.enabled
    }
    await databaseServices.settings.updateOne({ key: 'system' }, { $set: { shipping, updated_at: new Date() } })
    return { message: 'Đã cập nhật cấu hình vận chuyển' }
  }
}

export default new AdminService()
