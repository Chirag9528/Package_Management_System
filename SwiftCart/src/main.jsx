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
