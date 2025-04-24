import { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const showdetails = ()=>{
    navigate("/product" , {state : {obj : product}})
  }
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <img 
          src={product.imageurl} 
          alt={product.name} 
          className={` object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />

      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate text-black text-left">{product.name}</h3>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-end gap-2">
            <span className="font-bold text-lg text-black">MRP: &nbsp; ${product.price}</span>
          </div>
          
          <button onClick={showdetails} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition">
            <ShoppingCart size={14} />
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
