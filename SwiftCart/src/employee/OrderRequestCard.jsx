import React from 'react'
import { useNavigate } from 'react-router-dom';

function OrderRequestCard(props) {
    const order = props.order
    const navigate = useNavigate();
    const handleProcessOrder = (orderId) => {
        navigate(`/process_order/${orderId}` , {state : {obj : order}});
    };
    
    return (
    <div key={order.req_id} className="border rounded p-4 bg-gray-50 shadow-sm text-black">
        <h4 className="text-left font-semibold text-lg">Order ID: {order.ord_id}</h4>
        <h2 className="text-left font-semibold text-lg mb-1">Order Name: {order.ord_name}</h2>
        <p className="text-left text-lg font-semibold mb-1">Warehouse ID: {order.w_house_id}</p>
        <p className="text-left text-lg font-semibold mb-1">Quantity: {order.ord_qty}</p>
        <p className="text-left text-lg font-semibold mb-2">
            Order Date: {new Date(order.ord_date).toLocaleString()}
        </p>
        <button
            onClick={() => handleProcessOrder(order.ord_id)}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
            >
            Process
        </button>
    </div>
    )
}

export default OrderRequestCard