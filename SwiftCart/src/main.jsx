import React from 'react'
import ReactDom from 'react-dom/client'
import { createBrowserRouter , RouterProvider  } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import Login from './components/Login.jsx'
import CustomerHome from './customer/Dashboard.jsx'
import EmployeeHome from './employee/Dashboard.jsx'
import MyOrders from './customer/MyOrders.jsx'
import PendingRequest from './employee/PendingRequest.jsx'
import ProcessedRequest from './employee/ProcessedRequest.jsx'
import ProcessOrder from './employee/ProcessOrder.jsx'
import ManagerDashboard from './manager/home.jsx'
import AllStocks from './manager/AllStocks.jsx'
import MinimumStocks from './manager/MinimumStocks.jsx'
import Process_Request from './manager/Process_Request.jsx'
import PendingStocksRequests from './manager/PendingStocksRequest.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element : <HomePage/>
      },
      {
        path: "/product",
        element : <ProductPage/>
      },
      {
        path: "/orders",
        element : <OrdersPage/>
      },
      {
        path: "/login/:type",
        element: <Login/>
      },
      {
        path:"/customer/home",
        element: <CustomerHome/>
      },
      {
        path:"/customer/myorder",
        element: <MyOrders/>
      },
      {
        path:"/employee/home",
        element: <EmployeeHome/>,
        children: [
          {
            path: "/employee/home",
            element: <PendingRequest/>
          },
          {
            path : "/employee/home/processed_requests",
            element: <ProcessedRequest/>
          },
          {
            path : "/employee/home/pending_requests",
            element: <PendingRequest/>
          }
        ]
      },
      {
        path:"/manager/home",
        element: <ManagerDashboard/>,
        children: [
          {
            path: "all_stocks", 
            element: <AllStocks/>
          },
          {
            path: "stocks_required", 
            element:<MinimumStocks/>
          },
          {
            path: "pending_requests", 
            element:<PendingStocksRequests/>
          }
        ]
      },
      {
        path:"/manager/home/stocks_required/:stock_id",
        element: <Process_Request/>
      },
      {
        path: "/process_order/:orderId",
        element: <ProcessOrder/>
      }
    ]
  }
])

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
