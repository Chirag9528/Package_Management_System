import { useState } from 'react';

const OrderStatusBadge = ({ status }) => {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    processed: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-gray-100 text-gray-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrderItem = ({ order }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">Order #{order.order_id}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-500">
            Ordered on {formatDate(order.order_date)}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mr-4 mb-4 sm:mb-0">
          {order.item_image ? (
            <img src={order.item_image} alt={order.item_name} className="w-full h-full object-cover rounded-md" />
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 4l-8 4m8-4l-8-4m-8 4l8-4" />
            </svg>
          )}
        </div>
        
        <div className="flex-grow">
          <h4 className="text-lg font-medium text-gray-900">{order.item_name}</h4>
          <p className="text-md text-black">Quantity: {order.ordered_qty}</p>
          <p className="text-md text-black">Price: ${order.item_price}</p>
          <p className="text-md text-black">Total: ${(order.ordered_qty * order.item_price)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {['delivered', 'returned'].includes(order.status) && (
          <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Buy Again
          </button>
        )}
      </div>
    </div>
  );
};

const OrdersList = ({ groupedOrders }) => {
  return (
    <div className="space-y-8">
      {groupedOrders.map(({ date, orders }) => (
        <div key={date} className="space-y-2">
          <h2 className="text-lg font-medium text-gray-900">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => (
              <OrderItem key={order.order_id} order={order} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;