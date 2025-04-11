import { Package, Calendar, DollarSign } from 'lucide-react';

const OrdersList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">No orders yet</h2>
        <p className="text-gray-500 mt-2">Your order history will appear here</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Package size={20} className="text-blue-600 mr-2" />
              <span className="font-medium">Order #{order.id}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-1" />
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="p-4">
            {order.items.map(item => (
              <div key={item.productId} className="flex py-3 border-b last:border-b-0 border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={item.imageUrl || "/api/placeholder/64/64"} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {order.items.reduce((total, item) => total + item.quantity, 0)} items
            </div>
            <div className="flex items-center font-semibold">
              <DollarSign size={16} className="mr-1" />
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;