import { ShoppingCart, Package, Home, LogIn, ChevronDown, User } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import userContext from '../Context/userContext';

const Navbar = () => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  // const [isLoggedIn, setIsloggedIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const {currUser,setcurrUser} = useContext(userContext);
  const isLoggedIn = !!currUser;

  // Re-run on every route change
  useEffect(() => {
    // const status = localStorage.getItem('usertype');
    // setIsloggedIn(!!status);
    setShowLoginOptions(false);
    setShowUserOptions(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    // setIsloggedIn(false);            //not required 
    setShowUserOptions(false);
    setcurrUser(null);
    navigate('/');
  };

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

          <Link to="/orders" className="flex items-center gap-1 hover:text-blue-300 transition">
            <ShoppingCart size={18} />
            <span>My Orders</span>
          </Link>

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
                <span>Account</span>
                <ChevronDown size={14} />
              </button>

              {showUserOptions && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
