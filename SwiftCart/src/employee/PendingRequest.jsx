import React, {useState , useEffect } from 'react'
import OrderRequestCard from './OrderRequestCard';

function PendingRequest() {
    const [orders, setOrders] = useState([]);
    useEffect(()=>{
        const fetchOrders = async () => {
            const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/e/get_all_pending_requests`, {
                method: 'GET',
                credentials: "include"
            })
            .then(response => response.json())
            .catch(error => console.log(error));
        
            if (response && response.success) {
                setOrders(response.data);
            }
        };
        fetchOrders();
    },[])
    return (
    <div className="space-y-4">
        {orders.length > 0 ? (
        orders.map(order => (
            <OrderRequestCard order={order}/>
        ))
        ) : (
        <div className="text-center py-4 text-gray-500">No pending orders found</div>
        )}
    </div>
    )
}

export default PendingRequest