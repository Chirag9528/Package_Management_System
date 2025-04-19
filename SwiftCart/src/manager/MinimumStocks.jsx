import React, { useEffect, useState } from 'react';

const MinimumStocks = () => {
  const [lowStocks, setLowStocks] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const manager_id = localStorage.getItem('id')
    const fetchlowstock = async () =>{
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/m/get_low_stocks?managerId=${manager_id}`,{
        method: 'GET',
        credentials: 'include'
      })
      .then(response => response.json())
      .catch(console.log('data can be fetched'))

      if(response.success){
        // console.log(response.data)
        setLowStocks(response.data);
        setLoading(false)
        console.log("Data fetched successfully")
      }else{
        console.log("sorry")
      }
    }
    fetchlowstock()
  },[])
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Items That Need Restocking</h2>
      {loading ? (
                <div className="flex justify-center items-center min-h-60">
                    <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                    <p className="ml-4 text-indigo-600 font-medium">Loading stocks...</p>
                </div>
            ):
      (<ul>
        {lowStocks.map((item, index) => (
          <li key={index} className="border p-2 my-2 rounded bg-yellow-50 text-black">
            <p>Item id: {item.itm_id}</p>
            <p>Item name: {item.itm_name}</p>
            <p>Current stock: {item.stock}</p>
          </li>
        ))}

      </ul>)}
    </div>
  );
};

export default MinimumStocks;
