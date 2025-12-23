import databaseServices from './database.services'
import { OrderStatus } from '~/models/schemas/Order.schema'
import { ObjectId } from 'mongodb'

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

    const match: any = { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }

    // keyword: search by name or slug (fallback for SKU)
    if (params.keyword) {
      const regex = new RegExp(params.keyword, 'i')
      match.$or = [{ name: regex }, { slug: regex }]
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
        match.category = catId
      } else {
        const cat = await databaseServices.categories.findOne({ slug: params.category_id })
        if (cat?._id) match.category = cat._id
      }
    }
    // status mapping
    if (params.status === 'out_of_stock') {
      match.quantity = 0
    } else if (params.status === 'low_stock') {
      match.quantity = { $gt: 0, $lt: 10 }
    } else if (params.status === 'active') {
      match.quantity = { $gt: 0 }
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
    const mapStatus = (qty: number) => {
      if (!qty || qty === 0)
        return { stock_status: 'out_of_stock', status: 'out_of_stock', status_label: 'Hết hàng', status_color: 'red' }
      if (qty > 0 && qty < 10)
        return { stock_status: 'low_stock', status: 'active', status_label: 'Sắp hết', status_color: 'yellow' }
      return { stock_status: 'in_stock', status: 'active', status_label: 'Đang bán', status_color: 'green' }
    }

    const mapped = items.map((p) => {
      const qty = p.quantity ?? 0
      const m = mapStatus(qty)
      return {
        id: p._id,
        name: p.name,
        sku: p.slug,
        thumbnail_url: p.image,
        category_name: catMap.get(p.category?.toString()) || '',
        price: p.price,
        price_display: toVnCurrency(p.price || 0),
        stock_quantity: qty,
        stock_status: m.stock_status,
        status: m.status,
        status_label: m.status_label,
        status_color: m.status_color
      }
    })

    const startIdx = total === 0 ? 0 : (page - 1) * limit + 1
    const endIdx = Math.min(page * limit, total)

    return {
      items: mapped,
      meta: {
        total_items: total,
        total_pages: Math.ceil(total / limit) || 1,
        current_page: page,
        limit,
        showing_text:
          total === 0 ? 'Không có sản phẩm nào' : `Hiển thị ${startIdx}-${endIdx} trên tổng số ${total} sản phẩm`
      }
    }
  }
  async getAdminOrderStats() {
    const [total_orders, pending_count, shipping_count, cancelled_count] = await Promise.all([
      databaseServices.orders.countDocuments({}),
      databaseServices.orders.countDocuments({ status: OrderStatus.Pending }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Shipping }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Cancelled })
    ])
    return { total_orders, pending_count, shipping_count, cancelled_count }
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
        id: o._id,
        order_code: o.order_code,
        customer: {
          id: o.user?._id,
          name: o.user?.full_name || o.shipping_info?.receiver_name || '',
          email: o.user?.email || o.shipping_info?.email || '',
          avatar_url: o.user?.avatar || ''
        },
        product_summary: first ? `${first.name} (x${first.quantity})` : '',
        product_more_count: more,
        created_at: o.created_at,
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

    const startIdx = total === 0 ? 0 : (page - 1) * limit + 1
    const endIdx = Math.min(page * limit, total)
    return {
      items,
      meta: {
        total_items: total,
        total_pages: Math.ceil(total / limit) || 1,
        current_page: page,
        limit,
        showing_text:
          total === 0
            ? 'Không có đơn hàng nào'
            : `Hiển thị ${startIdx}-${endIdx} trong số ${new Intl.NumberFormat('vi-VN').format(total)} đơn hàng`
      }
    }
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
      description?: string
      is_featured?: boolean
    }
  ) {
    const _id = new ObjectId(id)
    const set: any = { updated_at: new Date() }
    if (payload.name !== undefined) set.name = payload.name
    if (payload.price !== undefined) set.price = payload.price
    if (payload.quantity !== undefined) set.quantity = payload.quantity
    if (payload.image !== undefined) set.image = payload.image
    if (payload.description !== undefined) set.description = payload.description
    if (payload.is_featured !== undefined) set.is_featured = payload.is_featured
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

    const [
      total_users,
      total_orders,
      pending_orders,
      processing_orders,
      shipping_orders,
      completed_orders,
      cancelled_orders
    ] = await Promise.all([
      databaseServices.users.countDocuments({}),
      databaseServices.orders.countDocuments({}),
      databaseServices.orders.countDocuments({ status: OrderStatus.Pending }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Processing }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Shipping }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Completed }),
      databaseServices.orders.countDocuments({ status: OrderStatus.Cancelled })
    ])

    const new_users_today = await databaseServices.users.countDocuments({ createdAt: { $gte: todayStart } })
    const new_orders_today = await databaseServices.orders.countDocuments({ created_at: { $gte: todayStart } })

    // revenue in optional date range (default: total non-cancelled)
    const match: any = { status: { $ne: OrderStatus.Cancelled } }
    if (params?.start_date || params?.end_date) {
      match.created_at = {}
      if (params?.start_date) match.created_at.$gte = new Date(params.start_date)
      if (params?.end_date) match.created_at.$lte = new Date(params.end_date)
    }

    const revenueAgg = await databaseServices.orders
      .aggregate([{ $match: match }, { $group: { _id: null, revenue: { $sum: '$cost_summary.total' } } }])
      .toArray()

    const total_revenue = revenueAgg[0]?.revenue || 0

    return {
      counters: {
        total_users,
        total_orders,
        total_revenue,
        pending_orders,
        processing_orders,
        shipping_orders,
        completed_orders,
        cancelled_orders,
        new_users_today,
        new_orders_today
      }
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
          amount: { $sum: '$cost_summary.total' }
        }
      },
      { $project: { _id: 0, date: '$_id.day', amount: 1 } },
      { $sort: { date: 1 } }
    ]

    const rows = await databaseServices.orders.aggregate(pipeline).toArray()

    // fill missing days
    const points: Array<{ date: string; amount: number }> = []
    for (let d = startOfDay(start); d <= startOfDay(end); d = addDays(d, 1)) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const found = rows.find((r) => r.date === key)
      points.push({ date: key, amount: found?.amount || 0 })
    }

    const total = points.reduce((s, p) => s + p.amount, 0)
    return { range: { start: start.toISOString(), end: end.toISOString() }, total, points }
  }

  async getStatsOverview(params?: { start_date?: string; end_date?: string }) {
    const match: any = {}
    if (params?.start_date || params?.end_date) {
      match.created_at = {}
      if (params?.start_date) match.created_at.$gte = new Date(params.start_date)
      if (params?.end_date) match.created_at.$lte = new Date(params.end_date)
    }

    // Orders count by status
    const [orderTotals, statusCounts, revenueByStatus] = await Promise.all([
      databaseServices.orders.countDocuments(match),
      databaseServices.orders
        .aggregate([
          { $match: match },
          { $group: { _id: '$status', count: { $count: {} } } },
          { $project: { _id: 0, status: '$_id', count: 1 } }
        ])
        .toArray(),
      databaseServices.orders
        .aggregate([
          { $match: match },
          { $group: { _id: '$status', amount: { $sum: '$cost_summary.total' } } },
          { $project: { _id: 0, status: '$_id', amount: 1 } }
        ])
        .toArray()
    ])

    // Top products (by revenue & quantity) in range
    const topProducts = await databaseServices.orders
      .aggregate([
        { $match: match },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product_id',
            product_id: { $first: '$items.product_id' },
            name: { $first: '$items.name' },
            thumbnail_url: { $first: '$items.thumbnail_url' },
            quantity: { $sum: '$items.quantity' },
            revenue: { $sum: '$items.total' }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 }
      ])
      .toArray()

    // Recent orders (last 5)
    const recentOrders = await databaseServices.orders
      .find(match, {
        projection: {
          order_code: 1,
          status: 1,
          created_at: 1,
          'cost_summary.total': 1
        }
      })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray()

    // Customers baseline
    const totalUsers = await databaseServices.users.countDocuments({})

    const overview = {
      totals: {
        total_orders: orderTotals,
        total_users: totalUsers,
        total_revenue: revenueByStatus.reduce((s, r) => s + (r.amount || 0), 0)
      },
      status_counts: statusCounts,
      revenue_by_status: revenueByStatus,
      top_products: topProducts,
      recent_orders: recentOrders.map((o) => ({
        order_code: o.order_code,
        status: o.status,
        created_at: o.created_at,
        created_at_display: o.created_at?.toLocaleString('vi-VN'),
        total: o.cost_summary?.total || 0
      }))
    }

    return overview
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
        id: u._id,
        customer_code: code,
        name: u.full_name,
        avatar_url: u.avatar || null,
        email: u.email,
        phone: u.phonenumber || '',
        type: 'registered',
        stats: {
          order_count: u.order_count || 0,
          total_spent: u.total_spent || 0,
          total_spent_display: toVn(u.total_spent || 0)
        },
        status,
        status_label: s.label,
        status_color: s.color,
        joined_at: u.createdAt,
        joined_at_display: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : ''
      }
    })

    const startIdx = total === 0 ? 0 : (page - 1) * limit + 1
    const endIdx = Math.min(page * limit, total)
    return {
      items,
      meta: {
        total_items: total,
        total_pages: Math.ceil(total / limit) || 1,
        current_page: page,
        limit,
        showing_text:
          total === 0
            ? 'Không có khách hàng nào'
            : `Hiển thị ${startIdx}-${endIdx} trên ${new Intl.NumberFormat('vi-VN').format(total)} khách hàng`
      }
    }
  }

  async getAdminCustomerDetail(id: string) {
    const _id = new ObjectId(id)
    const user = await databaseServices.users.findOne({ _id })
    if (!user) return null
    const recent_orders = await databaseServices.orders
      .find({ user_id: _id }, { projection: { order_code: 1, created_at: 1, status: 1, 'cost_summary.total': 1 } })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray()
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
    return { message: status === 'inactive' ? 'Đã khóa tài khoản khách hàng' : 'Đã mở khóa tài khoản khách hàng' }
  }
}

export default new AdminService()
