import { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <img 
          src={product.imageUrl || "/api/placeholder/400/320"} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {/* {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )} */}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        
        {/* <div className="flex items-center mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                fill={i < product.rating ? "gold" : "none"} 
                stroke={i < product.rating ? "gold" : "gray"}
                className="mr-1"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.reviews} reviews)</span>
        </div> */}
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-end gap-2">
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-gray-500 text-sm line-through">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          
          <Link 
            to={`/product/${product.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition"
          >
            <ShoppingCart size={14} />
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
