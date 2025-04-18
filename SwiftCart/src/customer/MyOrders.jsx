import React, { useEffect, useState } from 'react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  // Simulate fetching orders
  useEffect(() => {
    // Replace this with actual fetch/API call
    const mockOrders = [
      {
        id: 1,
        item: 'Wireless Mouse',
        quantity: 2,
        price: 599,
        status: 'Delivered',
        date: '2025-04-10',
      },
      {
        id: 2,
        item: 'Laptop Stand',
        quantity: 1,
        price: 1299,
        status: 'Processing',
        date: '2025-04-11',
      },
      {
        id: 3,
        item: 'USB-C Charger',
        quantity: 1,
        price: 899,
        status: 'Shipped',
        date: '2025-04-09',
      },
    ];

    setOrders(mockOrders);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-black-600">Sorry! We are not able to fetch your orders.</p>
      ) : (
        <div className="text-black grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-1">{order.item}</h2>
              <p className="text-sm text-black-600">Order ID: #{order.id}</p>
              <p className="text-sm">Quantity: {order.quantity}</p>
              <p className="text-sm">Price: ₹{order.price}</p>
              <p className="text-sm">Status: <span className="font-medium">{order.status}</span></p>
              <p className="text-sm text-black-500">Date: {order.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
