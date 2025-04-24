import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PendingStocksRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [transportOptions, setTransportOptions] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [transportSearchLoading, setTransportSearchLoading] = useState(false);
  const navigate = useNavigate()

  const handleReject = async(fwid, item_id) => {
    const id = localStorage.getItem('id');
    const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/reject_order_request?managerId=${id}&fwid=${fwid}&itemId=${item_id}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .catch(err => console.log(err));

    if(response && response.success) {
      console.log("order has been rejected");
      setRequests(prev =>
        prev.filter(
          req =>
            !(req.from_warehouse_id === fwid && req.itm_id === item_id)
        )
      );
    } else {
      console.log("rejection cancelled");
    }
  };

  const handleAccept = (request) => {
    setSelectedRequest(request);
    setShowTransportModal(true);
    setSearchPerformed(false);
    setTransportOptions([]);
  };

  const searchTransport = async () => {
    setTransportSearchLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/get_available_transport`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          w_house_id: selectedRequest.from_warehouse_id
        })
      });
    
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
    
      const data = await response.json();
      console.log('Available transport:', data);
      setSearchPerformed(true);
      setTransportOptions(data.data);
    
    } catch (error) {
      console.error('Error fetching transport:', error);
    } finally {
      setTransportSearchLoading(false);
    }
  };

  const selectTransport = async (transportId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/transport_item_to_destination_warehouse`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transport_id: transportId,
          item_qty : selectedRequest.stocks_required,
          item_id: selectedRequest.itm_id,
          dest_warehouse_id: selectedRequest.from_warehouse_id
        })
      })
      .then(response => response.json())
      .catch(error => console.log(error))
      
      if (response && response.success) {
        alert("Stock request accepted and transport assigned successfully!");
        navigate(0);
        closeTransportModal();
      } else {
        alert("Failed to process request: " + data.message);
      }
    } catch (error) {
      console.error("Error accepting stock request:", error);
      alert("An error occurred while processing the request.");
    }
  };

  const closeTransportModal = () => {
    setShowTransportModal(false);
    setSelectedRequest(null);
    setSearchPerformed(false);
  };

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
    <div>
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
              🏭 Requested by Warehouse: <span className="font-medium">{req.from_warehouse_id}</span>
            </p>
            <p className="text-sm text-gray-600 mb-1">
              🔢 Quantity: <span className="font-medium">{req.stocks_required}</span>
            </p>
            <p className="text-sm text-gray-600 mb-3">
              ⏳ Status: <span className="text-yellow-600 font-semibold">Pending</span>
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => handleAccept(req)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(req.from_warehouse_id, req.itm_id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transport Modal */}
      {showTransportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Assign Transport</h2>
              <button 
                onClick={closeTransportModal}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedRequest && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-black">
                <h3 className="font-semibold text-lg mb-2">Request Details</h3>
                <p className="mb-1"><span className="font-medium">Item ID:</span> {selectedRequest.itm_id}</p>
                <p className="mb-1"><span className="font-medium">By Warehouse ID:</span> {selectedRequest.from_warehouse_id}</p>
                <p className="mb-1"><span className="font-medium">Quantity:</span> {selectedRequest.stocks_required}</p>
              </div>
            )}

            <div className="mb-6 flex justify-center">
              <button
                onClick={searchTransport}
                disabled={transportSearchLoading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 text-lg font-medium"
              >
                {transportSearchLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : "Find Available Transport"}
              </button>
            </div>

            {searchPerformed && (
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Available Transport Options</h3>
                {transportOptions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 text-left text-gray-700">Transport ID</th>
                          <th className="py-2 px-4 text-left text-gray-700">Driver Name</th>
                          <th className="py-2 px-4 text-left text-gray-700">Vehicle Number</th>
                          <th className="py-2 px-4 text-left text-gray-700">Departure Time</th>
                          <th className="py-2 px-4 text-left text-gray-700">Status</th>
                          <th className="py-2 px-4 text-left text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transportOptions.map((transport) => (
                          <tr key={transport.transport_id} className="border-t">
                            <td className="py-2 px-4 text-gray-800">{transport.trans_id}</td>
                            <td className="py-2 px-4 text-gray-800">{transport.dvr_name}</td>
                            <td className="py-2 px-4 text-gray-800">{transport.vehi_no}</td>
                            <td className="py-2 px-4 text-gray-800">{transport.dp_time}</td>
                            <td className={`py-2 px-4 ${transport.avlity === "available" ? "text-green-500" : "text-red-500"}`}>
                              {transport.avlity}
                            </td>
                            <td className="py-2 px-4">
                              <button
                                disabled={transport.avlity === "unavailable"}
                                onClick={() => selectTransport(transport.trans_id)}
                                className={`text-white px-3 py-1 rounded ${
                                  transport.avlity === "unavailable" 
                                    ? "bg-gray-300 cursor-not-allowed" 
                                    : "bg-green-600 hover:bg-green-700"
                                } transition`}
                              >
                                Assign
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700">No transport options available for this warehouse {selectedRequest.from_warehouse_id}.</p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeTransportModal}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingStocksRequests;