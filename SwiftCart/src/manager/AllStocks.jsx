import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';

export default function AllStocks() {
  const { allstock } = useOutletContext();
    console.log(allstock)
  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 tracking-tight">
        📦 All Stock Items
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allstock.map((stock) => (
          <div
            key={stock.item_id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-4 capitalize tracking-wide">
                {stock.item_name}
              </h2>

              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <span className="font-medium text-gray-900">🆔 Item ID:</span> {stock.item_id}
                </li>
                <li>
                  <span className="font-medium text-gray-900">📦 Capacity:</span> {stock.capacity}
                </li>
                <li>
                  <span className="font-medium text-gray-900">📊 Current Stock:</span> {stock.curr_stock}
                </li>
                <li>
                  <span className="font-medium text-gray-900">🏢 Warehouse ID:</span> {stock.warehouse_id}
                </li>
                <li>
                  <span className="font-medium text-gray-900">💰 Price:</span> ₹{stock.price}
                </li>
                <li>
                  <span className="font-medium text-gray-900">📝 Description:</span> {stock.description}
                </li>
              </ul>
            </div>

            <button
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-200"
              onClick={() => console.log("Will be added to checklist:")}
            >
              <ClipboardCheck size={18} />
              Add to Checklist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
