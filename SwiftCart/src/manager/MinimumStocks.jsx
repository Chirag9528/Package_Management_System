import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react'; // Optional: warning icon
import { useNavigate } from 'react-router-dom';

const MinimumStocks = () => {
  const [lowStocks, setLowStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const manager_id = localStorage.getItem('id');
    const fetchlowstock = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/get_low_stocks?managerId=${manager_id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        if (data.success) {
          setLowStocks(data.data);
          console.log("Data fetched successfully");
        } else {
          console.log("Backend error");
        }
      } catch (err) {
        console.log("Data can't be fetched:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchlowstock();
  }, []);

  const handleProcessOrder = (item)=>{
    navigate(`/manager/home/stocks_required/${item.itm_id}`,{
      state:{itemState: item}
    }

    )
  }

  return (
    <div className="p-6 bg-slate-50 rounded-2xl shadow-inner">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-red-600 tracking-tight">
          Items That Need Restocking
      </h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-60">
          <div className="animate-spin h-10 w-10 border-4 border-red-500 border-t-transparent rounded-full"></div>
          <p className="ml-4 text-red-600 font-medium">Fetching low stock data...</p>
        </div>
      ) : lowStocks.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          All stocks are sufficient!
        </div>
      ) : (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStocks.map((item, index) => (
            <li
              key={index}
              className="bg-yellow-100 border border-yellow-300 rounded-xl p-5 shadow-md transition hover:shadow-lg"
            >
             
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-800">Item ID:</span> {item.itm_id}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-800">Item Name:</span> {item.itm_name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-800">Current Stock:</span> {item.stock}
              </p>

              <button
                onClick={() => handleProcessOrder(item)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200"
              >
                Process Restock
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MinimumStocks;
