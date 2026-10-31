import { query } from '../database/db.js';

export class AdminService {
  static async getDashboardMetrics() {
    const customersCount = await query(`SELECT COUNT(*) as count FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER')`);
    const productsCount = await query(`SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL`);
    const ordersCount = await query(`SELECT COUNT(*) as count FROM orders`);
    const revenueSum = await query(`SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'PAID'`);
    const enquiriesCount = await query(`SELECT COUNT(*) as count FROM enquiries WHERE status = 'NEW'`);
    const serviceRequestsCount = await query(`SELECT COUNT(*) as count FROM service_requests WHERE status IN ('REQUESTED', 'ASSIGNED', 'SCHEDULED')`);
    const warrantyClaimsCount = await query(`SELECT COUNT(*) as count FROM warranty_claims WHERE status IN ('FILED', 'IN_REVIEW')`);
    const lowStockCount = await query(`SELECT COUNT(*) as count FROM products WHERE available_quantity <= 10 AND deleted_at IS NULL`);

    const recentOrders = await query(`SELECT id, order_number, customer_name, total_amount, order_status, created_at FROM orders ORDER BY id DESC LIMIT 5`);
    const recentEnquiries = await query(`SELECT id, enquiry_number, name, email, phone, location, status, created_at FROM enquiries ORDER BY id DESC LIMIT 5`);
    const recentServices = await query(`SELECT id, ticket_number, customer_name, service_type, status, created_at FROM service_requests ORDER BY id DESC LIMIT 5`);

    return {
      overview: {
        total_customers: customersCount[0]?.count || 0,
        total_products: productsCount[0]?.count || 0,
        total_orders: ordersCount[0]?.count || 0,
        total_revenue: parseFloat(revenueSum[0]?.total || 0),
        new_enquiries: enquiriesCount[0]?.count || 0,
        pending_services: serviceRequestsCount[0]?.count || 0,
        pending_warranty_claims: warrantyClaimsCount[0]?.count || 0,
        low_stock_products: lowStockCount[0]?.count || 0,
      },
      recent_activity: {
        recent_orders: recentOrders,
        recent_enquiries: recentEnquiries,
        recent_services: recentServices,
      },
      chart_data: {
        monthly_sales: [
          { month: 'May', revenue: 120000 },
          { month: 'Jun', revenue: 185000 },
          { month: 'Jul', revenue: 210000 },
          { month: 'Aug', revenue: 290000 },
          { month: 'Sep', revenue: 350000 },
          { month: 'Oct', revenue: 410000 },
        ]
      }
    };
  }

  static async getCustomerLogins({ search = '', status = 'all', date = '', page = 1, limit = 20 } = {}) {
    let whereClauses = [];
    let params = [];

    if (search && search.trim()) {
      whereClauses.push('(customer_name LIKE ? OR email LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (date && date.trim()) {
      whereClauses.push('(login_date = ? OR DATE(created_at) = ?)');
      params.push(date.trim(), date.trim());
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(*) as count FROM customer_logins ${whereSql}`, params);
    const total = countRes[0]?.count || 0;

    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const records = await query(
      `SELECT * FROM customer_logins ${whereSql} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const todayDateStr = new Date().toISOString().slice(0, 10);
    const todayRes = await query(
      `SELECT COUNT(*) as count FROM customer_logins WHERE (login_date LIKE ? OR DATE(created_at) = ?)`,
      [`%${todayDateStr}%`, todayDateStr]
    );

    return {
      records,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      summary: {
        totalLogins: total,
        todayLogins: todayRes[0]?.count || 0,
      }
    };
  }
}
