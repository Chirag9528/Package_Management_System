import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ProcessOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId } = useParams();
  const { obj } = location.state
  console.log(obj)
  
  const [orderDetails, setOrderDetails] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [destinationCity, setDestinationCity] = useState('');
  const [transportOptions, setTransportOptions] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/e/get_order_details/${orderId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderDetails(data.data);
        // If the order already has a destination city, set it
        if (data.data.destination_city) {
          setDestinationCity(data.data.destination_city);
        }
      } else {
        console.error('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchTransport = async () => {
    if (!destinationCity.trim()) {
      alert('Please enter a destination city');
      return;
    }
    // logic to find transport vehicles
    
  };

  const selectTransport = async (transportId) => {
    // logic to process order
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="bg-slate-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Process Order</h1>
          <button 
            onClick={() => navigate('/employee/home/pending_requests')}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Order Details Section */}
        <div className="mb-8 border border-black rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-black">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
        <div>
              <p className="text-lg font-semibold mb-1">Order ID : &nbsp; {obj.ord_id}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Customer Name : &nbsp; {orderDetails.cust_name}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Item Id : &nbsp; {orderDetails.itm_id}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Warehouse Id : &nbsp; {obj.w_house_id}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Item Name : &nbsp; {obj.ord_name} </p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Quantity : &nbsp; {orderDetails.ord_qty}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Price : &nbsp; ${obj.cost}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Order Date : &nbsp; 
                {new Date(obj.ord_date).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Destination City : &nbsp; {orderDetails.cty}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Destination State : &nbsp; {orderDetails.st}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Destination Pincode : &nbsp; {orderDetails.pincd}</p>
            </div>
        </div>
      </div>
        {/* Transport Search Section */}
      <div className="mb-8 border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
        <div className="text-xl font-semibold mb-4 pb-2 text-black">Find Transportation</div>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow">
            <input
              type="text"
              id="destinationCity"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="w-full text-black p-3 border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
              placeholder="Enter destination city"
            />
          </div>
          <button
            onClick={searchTransport}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Search Transport
          </button>
        </div>
      </div>

        {/* Transport Options Section */}
        {searchPerformed && (
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Available Transport Options</h2>
            {transportOptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Transport ID</th>
                      <th className="py-2 px-4 text-left">Company</th>
                      <th className="py-2 px-4 text-left">Vehicle Type</th>
                      <th className="py-2 px-4 text-left">Departure Date</th>
                      <th className="py-2 px-4 text-left">Estimated Arrival</th>
                      <th className="py-2 px-4 text-left">Price</th>
                      <th className="py-2 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transportOptions.map((transport) => (
                      <tr key={transport.transport_id}>
                        <td className="py-2 px-4 border-t">{transport.transport_id}</td>
                        <td className="py-2 px-4 border-t">{transport.company_name}</td>
                        <td className="py-2 px-4 border-t">{transport.vehicle_type}</td>
                        <td className="py-2 px-4 border-t">{new Date(transport.departure_date).toLocaleString()}</td>
                        <td className="py-2 px-4 border-t">{new Date(transport.estimated_arrival).toLocaleString()}</td>
                        <td className="py-2 px-4 border-t">${transport.price.toFixed(2)}</td>
                        <td className="py-2 px-4 border-t">
                          <button
                            onClick={() => selectTransport(transport.transport_id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                          >
                            Ship
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">No transport options available for {destinationCity}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessOrder;