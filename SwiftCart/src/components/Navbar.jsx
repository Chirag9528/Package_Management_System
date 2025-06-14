import { ShoppingCart, Package, Home, LogIn, ChevronDown, User, ArrowRight  } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import userContext from '../Context/userContext';

const Navbar = () => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const {currUser,setcurrUser} = useContext(userContext);
  const isLoggedIn = !!currUser;

  useEffect(()=>{
    const checkuser = async ()=>{
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/u/verify-accessToken`,{
        method: 'POST', 
        credentials: "include",
        headers: {
            "Content-Type": "application/json", 
        }
      })
      .then(response => response.json())
      .catch(error => console.log(error))
      if (response && response.success){
        setcurrUser(response.data.email)
      }
    }
    checkuser();
  })

  // Re-run on every route change
  useEffect(() => {
    setShowLoginOptions(false);
    setShowUserOptions(false);
  }, [location]);

  const handleLogout = async () => {
    const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/u/logout`,{
      method: 'POST', 
      credentials: "include",
      headers: {
          "Content-Type": "application/json", 
      }
    })
    .then(response => response.json())
    .catch(error => console.log(error))

    if (response && response.success){
        localStorage.clear();
        console.log("successfully logged out")
        setShowUserOptions(false);
        setcurrUser(null);
        navigate('/');
    }
  };

  const handleMyOrders = () =>{
    if(!currUser){
      alert("please login to see your orders")
      return;
    }
    navigate('/orders')
  }

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <Package size={24} />
          <span>SwiftCart</span>
        </Link>

        <div className="flex items-center gap-6 relative">
          <Link to="/" className="flex items-center gap-1 hover:text-blue-300 transition">
            <Home size={18} />
            <span>Home</span>
          </Link>

          {localStorage.getItem('role')==='customer' && <button 
              onClick={handleMyOrders}
            className="flex items-center gap-1 hover:text-blue-300 transition">
              <ShoppingCart size={18} />
              <span>My Orders</span>
            </button>
          }

          {!isLoggedIn ? (
            <>
              <button
                onClick={() => setShowLoginOptions(prev => !prev)}
                className="flex items-center gap-1 hover:text-blue-300 transition"
              >
                <LogIn size={18} />
                <span>Login</span>
                <ChevronDown size={14} />
              </button>

              {showLoginOptions && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                  <Link
                    to="/login/customer"
                    className="block px-4 py-2 hover:bg-slate-100"
                  >
                    Login as Customer
                  </Link>
                  <Link
                    to="/login/employee"
                    className="block px-4 py-2 hover:bg-slate-100"
                  >
                    Login as Employee
                  </Link>
                  <Link
                    to="/login/manager"
                    className="block px-4 py-2 hover:bg-slate-100"
                  >
                    Login as Manager
                  </Link>
                  
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setShowUserOptions(prev => !prev)}
                className="flex items-center gap-1 hover:text-blue-300 transition"
              >
                <User size={18} />
                <span>{localStorage.getItem('username') ? localStorage.getItem('username') : "Account"}</span>
                <ChevronDown size={14} />
              </button>

              {showUserOptions && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                    onClick={() => setShowUserOptions(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              )}

            </>
          )}

          <Link
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-blue-300 transition"
          >
            <ArrowRight size={20} />
          </Link>
        
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
