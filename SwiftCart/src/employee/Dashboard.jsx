import { useState } from 'react';

const mockOrders = [
  { id: 'ORD001', details: '5x T-Shirts, Size M', status: 'pending' },
  { id: 'ORD002', details: '2x Shoes, Size 9', status: 'pending' },
  { id: 'ORD004', details: '1x Backpack', status: 'processed' },
  { id: 'ORD005', details: '1x Backpack', status: 'processed' },
  { id: 'ORD006', details: '1x Backpack', status: 'processed' },
  { id: 'ORD007', details: '1x Backpack', status: 'processed' },
  { id: 'ORD008', details: '1x Backpack', status: 'processed' },
  { id: 'ORD009', details: '2x Shoes, Size 9', status: 'pending' },
  { id: 'ORD0010', details: '2x Shoes, Size 9', status: 'pending' },
  { id: 'ORD0011', details: '2x Shoes, Size 9', status: 'pending' },
  { id: 'ORD0012', details: '2x Shoes, Size 9', status: 'pending' },
  { id: 'ORD0013', details: '2x Shoes, Size 9', status: 'pending' },
  { id: 'ORD0014', details: '2x Shoes, Size 9', status: 'pending' },
];

const EmployeeDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState('pending');

  const handleProcess = (id) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: 'processed' } : order)
    );
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);


  return (
    <div className=" bg-slate-100 p-2">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Employee {localStorage.getItem('usertype')}</h1>
        
        <div className="flex gap-4 mb-6">
            {/* pending button */}
          <button
            onClick={() => setActiveTab('pending')} className={`px-4 py-2 rounded ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>

            {/* Proceesed button */}
          <button
            onClick={() => setActiveTab('processed')}
            className={`px-4 py-2 rounded ${activeTab === 'processed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Processed
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-600">No {activeTab} orders found.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="border rounded p-4 bg-gray-50 shadow-sm">
                <h2 className="font-semibold text-lg">Order ID: {order.id}</h2>
                <p className="text-gray-700 mb-2">{order.details}</p>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleProcess(order.id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                  >
                    Process
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
