import { useState } from 'react';
import { ShoppingCart, Star, TruckIcon, Shield, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProductDetail = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    onAddToCart({
      productId: product.id,
      quantity,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl
    });
    navigate('/orders');
  };
  
  if (!product) {
    return <div className="text-center py-12">Loading product details...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="ml-1">Back to products</span>
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
            <img 
              src={product.imageUrl || "/api/placeholder/600/400"} 
              alt={product.name} 
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
            
            <div className="flex items-center mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < product.rating ? "gold" : "none"} 
                    stroke={i < product.rating ? "gold" : "gray"}
                    className="mr-1"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">({product.reviews} reviews)</span>
            </div>
            
            <div className="mt-4">
              <span className="text-gray-800 text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-gray-500 text-lg line-through ml-3">${product.oldPrice.toFixed(2)}</span>
              )}
              {product.discount > 0 && (
                <span className="ml-3 bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                  Save {product.discount}%
                </span>
              )}
            </div>
            
            <div className="mt-6 border-t border-b border-gray-200 py-4">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="mt-6 flex flex-col space-y-3">
              <div className="flex items-center text-gray-600">
                <TruckIcon size={18} className="mr-2" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Shield size={18} className="mr-2" />
                <span>2 year warranty included</span>
              </div>
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="mr-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border border-gray-300 rounded-md px-3 py-2 w-16 text-center"
                />
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition"
              >
                <ShoppingCart size={20} className="mr-2" />
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;