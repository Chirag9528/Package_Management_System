import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';


const EmployeeDashboard = () => {
  const navigate = useNavigate();  
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="bg-slate-100 p-2">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {setActiveTab('pending'); navigate('/employee/home/pending_requests')}} 
            className={`px-4 py-2 rounded ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>

          <button
            onClick={() => {setActiveTab('processed'); navigate('/employee/home/processed_requests')}}
            className={`px-4 py-2 rounded ${activeTab === 'processed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Processed
          </button>
        </div>
        <main>
          <Outlet/>
        </main>
        
      </div>
    </div>
  );
};

export default EmployeeDashboard;