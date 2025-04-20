import { useState, useEffect } from 'react';
import OrdersList from '../components/OrdersList';

// Mock data structure that matches your database schema
const mockOrders = [
  {
    order_id: 1001,
    customer_id: 101,
    item_id: 201,
    order_date: "2025-04-15",
    status: "delivered",
    return_date: null,
    delivered_date: "2025-04-17",
    ordered_qty: 1,
    // Additional item info from JOIN
    item_name: "Premium Wireless Headphones",
    item_price: 129.99,
    item_image: null
  },
  {
    order_id: 1002,
    customer_id: 101,
    item_id: 202,
    order_date: "2025-04-10",
    status: "shipped",
    return_date: null,
    delivered_date: null,
    ordered_qty: 2,
    // Additional item info from JOIN
    item_name: "Cotton T-Shirt - Black",
    item_price: 19.99,
    item_image: null
  },
  {
    order_id: 1003,
    customer_id: 101,
    item_id: 203,
    order_date: "2025-04-10",
    status: "shipped",
    return_date: null,
    delivered_date: null,
    ordered_qty: 1,
    // Additional item info from JOIN
    item_name: "Athletic Socks Pack",
    item_price: 12.99,
    item_image: null
  },
  {
    order_id: 1004,
    customer_id: 101,
    item_id: 204,
    order_date: "2025-04-05",
    status: "cancelled",
    return_date: null,
    delivered_date: null,
    ordered_qty: 1,
    // Additional item info from JOIN
    item_name: "Smartphone Case",
    item_price: 24.99,
    item_image: null
  },
  {
    order_id: 1005,
    customer_id: 101,
    item_id: 205,
    order_date: "2025-03-28",
    status: "returned",
    return_date: "2025-04-05",
    delivered_date: "2025-04-01",
    ordered_qty: 1,
    // Additional item info from JOIN
    item_name: "Running Shoes - Size 10",
    item_price: 89.99,
    item_image: null
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/c/get_my_orders`,{
          method : 'GET',
          credentials : 'include'
      })
      .then(response => response.json())
      .catch(error => console.log(error))

      if (response && response.success){
        setOrders(response.data);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  
  // Group orders by order_date
  const groupOrdersByDate = (orders) => {
    const ordersByDate = {};
    
    orders.forEach(order => {
      const dateKey = order.order_date;
      
      if (!ordersByDate[dateKey]) {
        ordersByDate[dateKey] = [];
      }
      
      ordersByDate[dateKey].push(order);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.entries(ordersByDate)
      .map(([date, orders]) => ({ date, orders }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter) {
      const orderDate = new Date(order.order_date);
      const today = new Date();
      
      if (dateFilter === 'last-30') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        if (orderDate < thirtyDaysAgo) return false;
      } else if (dateFilter === 'last-90') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);
        if (orderDate < ninetyDaysAgo) return false;
      } else if (dateFilter === 'last-year') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        if (orderDate < oneYearAgo) return false;
      }
    }
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.item_name.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower) ||
        order.order_id.toString().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const groupedOrders = groupOrdersByDate(filteredOrders);
  
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
        
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">All Time</option>
              <option value="last-30">Last 30 Days</option>
              <option value="last-90">Last 90 Days</option>
              <option value="last-year">Last Year</option>
            </select>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-16 h-16 bg-gray-200 rounded mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : groupedOrders.length > 0 ? (
          <OrdersList groupedOrders={groupedOrders} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || dateFilter 
                ? "Try adjusting your filters to find what you're looking for." 
                : "You haven't placed any orders yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;