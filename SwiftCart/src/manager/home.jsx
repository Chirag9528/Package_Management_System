import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();  
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('pending');
  const [allstock, setallstock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync tab with URL
    if (location.pathname.includes('all_stocks')) {
      setActiveTab('pending');
    } else if (location.pathname.includes('stocks_required')) {
      setActiveTab('processed');
    } else if (location.pathname.includes('pending_requests')) {
      setActiveTab('pending_requests');
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchitem = async () => {
      setLoading(true);
      const val = localStorage.getItem('id');
      console.log("Manager ID:", val);

      try {
        const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/get_all_stocks?managerId=${val}`, {
          method: 'GET',
          credentials: 'include',
        });

        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.success) {
            setallstock(data.data);
          } else {
            console.log("Backend error:", data);
          }
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
        }

      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchitem();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white min-h-screen p-6">
      {loading ? (
        <div className="flex justify-center items-center min-h-60">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          <p className="ml-4 text-indigo-600 font-medium">Loading stocks...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center tracking-tight">
            📊 Manager Dashboard
          </h1>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex gap-4 bg-indigo-100 p-2 rounded-full shadow-inner">
              <button
                onClick={() => {
                  setActiveTab('pending');
                  navigate('/manager/home/all_stocks');
                }}
                className={`px-6 py-2 text-sm font-medium rounded-full transition duration-300 ${
                  activeTab === 'pending'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                View All Stocks
              </button>

              <button
                onClick={() => {
                  setActiveTab('processed');
                  navigate('/manager/home/stocks_required');
                }}
                className={`px-6 py-2 text-sm font-medium rounded-full transition duration-300 ${
                  activeTab === 'processed'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                Minimum Stocks
              </button>

              <button
                onClick={() => {
                  setActiveTab('pending_requests');
                  navigate('/manager/home/pending_requests');
                }}
                className={`px-6 py-2 text-sm font-medium rounded-full transition duration-300 ${
                  activeTab === 'pending_requests'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                Pending Requests
              </button>
            </div>
          </div>

          {/* Main Content */}
          <main className="mt-4">
            <Outlet context={{ allstock }} />
          </main>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
