import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { place_orders } from '../../../backend/src/controllers/customer.controllers';

export default function Process_Request() {
    const location = useLocation();
    const item = location.state?.itemState;
    const [placedRequests, setPlacedRequests] = useState(new Set());


    const [available, setAvailable] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleStockSearch = () => {
        const id = localStorage.getItem('id');

        const fetchAllAvailable = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_HOSTNAME}/api/m/get_all_available_searchStocks?managerId=${id}&itemId=${item.itm_id}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                const text = await res.text();
                try {
                    const response = JSON.parse(text);
                    console.log("Parsed response:", response);

                    if (response.success) {
                        setAvailable(response.data);
                    } else {
                        console.log("Response.success is false");
                    }
                } catch (err) {
                    console.error("Could not parse JSON:", err);
                }
            } catch (err) {
                console.log("Data cannot be fetched", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAvailable();
    };

    const placeOrderStocks = (entry) =>{
        const id = localStorage.getItem('id');
        const place_request = async()=>{
            setLoading(true);
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_HOSTNAME}/api/m/place_stock_request?managerId=${id}&itemId=${item.itm_id}&w_id=${entry.wid}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                const text = await res.text();
                try {
                    const response = JSON.parse(text);
                    console.log("Parsed response:", response);

                    if (response.success) {
                        alert("request placed")
                       console.log("SUCCESS")
                       setPlacedRequests(prev => new Set([...prev, entry.wid]));
                    } else {
                        console.log("Response.success is false");
                    }
                } catch (err) {
                    console.error("Could not parse JSON:", err);
                }
            } catch (err) {
                console.log("Data cannot be fetched", err);
            } finally {
                setLoading(false);
            }
        }
        place_request()
    }

    if (!item) {
        return <div className="text-center p-6 text-red-500">No item data received.</div>;
    }

    return (
        <div className="p-6 m-5 mx-auto bg-white rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-blue-800 mb-4 border-b pb-2">📦 Process Restock Request</h2>

            <div className="bg-yellow-100 p-4 rounded-xl shadow-inner text-gray-800 space-y-1">
                <p><span className="font-semibold">🆔 Item ID:</span> {item.itm_id}</p>
                <p><span className="font-semibold">📛 Name:</span> {item.itm_name}</p>
                <p><span className="font-semibold">📦 Current Stock:</span> {item.stock}</p>
            </div>

            <button
                onClick={handleStockSearch}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-full transition-all"
            >
                🔍 Search Available Warehouses
            </button>

            {loading && (
                <div className="mt-6 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-green-600 border-dashed rounded-full animate-spin"></div>
                    <p className="text-gray-600 mt-2">Fetching available stock...</p>
                </div>
            )}

            {!loading && available.length > 0 && (
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full table-auto border border-gray-300 text-left text-black shadow-md rounded-xl overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 border">🏢 Warehouse ID</th>
                                <th className="px-4 py-3 border">📦 Item ID</th>
                                <th className="px-4 py-3 border">📍 Distance</th>
                                <th className="px-4 py-3 border">📊 Available Stock</th>
                                <th className="px-4 py-3 border">⚙️ Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {available.map((entry, index) => (
                                <tr key={index} className="hover:bg-green-50">
                                    <td className="px-4 py-2 border">{entry.wid}</td>
                                    <td className="px-4 py-2 border">{entry.itemid}</td>
                                    <td className="px-4 py-2 border">{entry.distance} km</td>
                                    <td className="px-4 py-2 border">{entry.currentstock}</td>
                                    <td className="px-4 py-2 border">
                                    <button
                                        onClick={() => placeOrderStocks(entry)}
                                        disabled={placedRequests.has(entry.wid)}
                                        className={`px-4 py-2 rounded-full transition ${
                                            placedRequests.has(entry.wid)
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        {placedRequests.has(entry.wid) ? 'Placed ' : 'Request'}
                                    </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
