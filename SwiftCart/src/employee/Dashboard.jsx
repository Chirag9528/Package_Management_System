import { useEffect, useState } from 'react';

const EmployeeDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(()=>{
    const fetch_pending_orders = async ()=>{
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/e/get_all_pending_requests`,{
        method : 'GET',
        headers : {
          'Authorization' : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNodWJoYW15YWRhdjk1MjhAZ21haWwuY29tIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNzQ0NDAyMDc0LCJleHAiOjE3NDQ0ODg0NzR9.OiToRCyHo6i0hBCd3mwDAt54gyk5Yu0b_-aR2zASC-0"
        },
        credentials : "include"
      })
      .then(response => response.json())
      .catch(error => console.log(error))

      if (response && response.success){
        setOrders(response.data);
      }
    }
    fetch_pending_orders();
  },[])


  // const handleProcess = (id) => {
  //   setOrders(prev => prev.map(order => order.id === id ? { ...order, status: 'processed' } : order)
  //   );
  // };

  // const filteredOrders = orders.filter(order => order.status === activeTab);


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

        {/* <div className="space-y-4">
          {orders.map(order => (
            <div key={order.ord_id} className="border rounded p-4 bg-gray-50 shadow-sm text-black">
              <h4 className="font-semibold text-lg">Order ID: {order.ord_id}</h4>
              <h2 className="font-semibold text-lg mb-2 text-black">{order.ord_name}</h2>
              {order.status === 'pending' && (
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                >
                  Process
                </button>
              )}
            </div>
          ))}
        </div> */}
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.req_id} className="border rounded p-4 bg-gray-50 shadow-sm text-black">
              <h4 className="text-left font-semibold text-lg">Order ID: {order.ord_id}</h4>
              <h2 className="text-left font-semibold text-lg mb-1">Order Name: {order.ord_name}</h2>
              <p className="text-left text-lg font-semibold mb-1">Warehouse ID: {order.w_house_id}</p>
              <p className="text-left text-lg font-semibold mb-1">Quantity: {order.ord_qty}</p>
              <p className="text-left text-lg font-semibold mb-2">
                Order Date: {new Date(order.ord_date).toLocaleString()}
              </p>
              <button
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
              >
                Process
              </button>
              {/* )} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
