import databaseServices from './database.services'
import { OrderStatus } from '~/models/schemas/Order.schema'

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

class AdminService {
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
}

export default new AdminService()
