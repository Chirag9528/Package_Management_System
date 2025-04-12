import './App.css'
import {Outlet} from 'react-router-dom'
import Navbar from './components/Navbar'
import UserContextProvider from './Context/UserContextProvider'

function App() {
  // const [orders, setOrders] = useState([]);
  
  // const addToCart = (item) => {
  //   const newOrder = {
  //     id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
  //     date: new Date().toISOString(),
  //     status: "Pending",
  //     total: item.price * item.quantity,
  //     items: [item]
  //   };
    
  //   setOrders(prev => [newOrder, ...prev]);
  // };
  return (
    <>
      <UserContextProvider>
        <Navbar />
        <Outlet/>
      </UserContextProvider>
    </>
  )
}

export default App
