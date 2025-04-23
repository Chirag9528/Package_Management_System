import { useEffect, useState } from 'react';

const Posted_Stocks_Order = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const outgoing_request = async () => {
      try {
        const managerId = localStorage.getItem('id');
        const response = await fetch(
          `${import.meta.env.VITE_HOSTNAME}/api/m/get_pending_stock_outrequests?managerId=${managerId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();
        if (data.success) {
          console.log(data.data);
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

    outgoing_request();
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
            🧑 Requested to: <span className="font-medium">{req.to_warehouse_id}</span>
          </p>
          <p className="text-sm text-gray-600 mb-1">
            🔢 Quantity Required: <span className="font-medium">{req.stocks_required}</span>
          </p>
          <p className="text-sm text-gray-600 mb-3">
            ⏳ Status: <span className="text-yellow-600 font-semibold">{req.status}</span>
          </p>
         
        </div>
      ))}
    </div>
  );
};

export default Posted_Stocks_Order;
