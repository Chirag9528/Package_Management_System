import React from 'react'
import {  useOutletContext } from 'react-router-dom'

export default function AllStocks() {
   
    const {allstock} = useOutletContext();
    
    
    return (
        <div className=" bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">All Stocks</h1>
            <div className="flex flex-col items-center gap-6">
                {allstock.map((stock) => (
                    <div
                        key={stock.item_id}
                        className="w-full  bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200"
                    >
                        <h2 className="text-xl font-semibold text-indigo-700 mb-2">{stock.item_name}</h2>
                        <p className="text-sm text-gray-500 mb-1"><span className="font-medium text-gray-700">Item ID:</span> {stock.item_id}</p>
                        <p className="text-sm text-gray-500 mb-1"><span className="font-medium text-gray-700">Quantity:</span> {stock.quantity}</p>
                        <p className="text-sm text-gray-500 mb-1"><span className="font-medium text-gray-700">Description:</span> {stock.description}</p>
                        <p className="text-sm text-gray-500 mb-1"><span className="font-medium text-gray-700">Warehouse ID:</span> {stock.warehouse_id}</p>
                        <p className="text-sm text-gray-500 mb-1"><span className="font-medium text-gray-700">Current Stock:</span> {stock.curr_stock}</p>
                        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Price:</span> ₹{stock.price}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
