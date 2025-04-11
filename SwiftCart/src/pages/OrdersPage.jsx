import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import OrdersList from '../components/OrdersList';

// Mock data - replace with actual API calls
const mockOrders = [
  {
    id: "ORD-1234",
    date: "2025-04-01T10:30:00",
    status: "Delivered",
    total: 129.98,
    items: [
      {
        productId: 1,
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        quantity: 1,
        imageUrl: null
      },
      {
        productId: 3,
        name: "Portable Power Bank",
        price: 29.99,
        quantity: 1,
        imageUrl: null
      },
      {
        productId: 6,
        name: "Laptop Backpack",
        price: 39.99,
        quantity: 0.5, 
        imageUrl: null
      }
    ]
  },
  {
    id: "ORD-1235",
    date: "2025-03-25T14:15:00",
    status: "Shipped",
    total: 199.99,
    items: [
      {
        productId: 5,
        name: "Ultra HD Action Camera",
        price: 199.99,
        quantity: 1,
        imageUrl: null
      }
    ]
  }
];

const OrdersPage = ({ orders: propOrders }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // If orders are passed as props, use them
    if (propOrders && propOrders.length > 0) {
      setOrders(propOrders);
      setLoading(false);
      return;
    }
    
    // Otherwise simulate API fetch
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
    
    // In real app, fetch from your backend
    // fetch('/api/orders')
    //   .then(res => res.json())
    //   .then(data => {
    //     setOrders(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Error fetching orders:', err);
    //     setLoading(false);
    //   });
  }, [propOrders]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
        
        {loading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
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
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;