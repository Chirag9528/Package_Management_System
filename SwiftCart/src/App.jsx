import './App.css'
import {Outlet} from 'react-router-dom'
import Navbar from './components/Navbar'

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
      <main>
        <Navbar />
        <Outlet/>
      </main>
    </>
  )
}

export default App
