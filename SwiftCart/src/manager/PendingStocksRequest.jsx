import { useEffect, useState } from 'react';

const PendingStocksRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAction = async(fwid,item_id)=>{
    const id = localStorage.getItem('id');
    const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/reject_order_request?managerId=${id}&fwid=${fwid}&itemId=${item_id}`,{
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .catch(err => console.log(err))

    console.log(response)
    if(response && response.success){
      console.log("orderd has been rejected\n");
      setRequests(prev =>
        prev.filter(
          req =>
            !(req.from_warehouse_id === fwid && req.itm_id === item_id)
        )
      )
    }
    else{
      console.log("rejection cancelled");
    }
  }

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const managerId = localStorage.getItem('id');
        const response = await fetch(
          `${import.meta.env.VITE_HOSTNAME}/api/m/get_pending_stock_requests?managerId=${managerId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();
        if (data.success) {
          setRequests(data.data);
        } else {
          console.error("Error from backend:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-60">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <p className="ml-4 text-indigo-600 font-medium">Loading pending requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-lg text-gray-600 mt-10">
        ✅ No pending requests at the moment!
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((req, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 transition hover:shadow-xl"
        >
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">
            📦 Item: {req.itm_id}
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            🧑 Requested by: <span className="font-medium">{req.from_warehouse_id}</span>
          </p>
          <p className="text-sm text-gray-600 mb-1">
            🔢 Quantity: <span className="font-medium">{req.stocks_required}</span>
          </p>
          <p className="text-sm text-gray-600 mb-3">
            ⏳ Status: <span className="text-yellow-600 font-semibold">Pending</span>
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => handleAction(req.req_id, 'accept')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
               Accept
            </button>
            <button
              onClick={() => handleAction(req.from_warehouse_id,req.itm_id)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-red-600"
            >
               Reject
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default PendingStocksRequests;
