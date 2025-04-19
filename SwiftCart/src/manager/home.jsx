import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();  
  const [activeTab, setActiveTab] = useState('pending');

  const [allstock, setallstock] = useState([]);
  const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchitem = async () => {
            setLoading(true);
            const val = localStorage.getItem('id');
            console.log("Manager ID:", val);
    
            try {
                const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/get_all_stocks?managerId=${val}`, {
                    method: 'GET',
                    credentials: 'include'
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
    <div className="bg-slate-100 p-2">
      {loading ? (
                <div className="flex justify-center items-center min-h-60">
                    <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                    <p className="ml-4 text-indigo-600 font-medium">Loading stocks...</p>
                </div>
            ) :
      (<div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {setActiveTab('pending'); navigate('/manager/home/all_stocks')}} 
            className={`px-4 py-2 rounded ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Veiw All Stock
          </button>

          <button
            onClick={() => {setActiveTab('processed'); navigate('/manager/home/stocks_required')}}
            className={`px-4 py-2 rounded ${activeTab === 'processed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Minimum Stocks
          </button>
        </div>

        <main>
            <Outlet  context = {{allstock}}/>
        </main>
        
      </div>)}
    </div>
  );
};

export default ManagerDashboard;