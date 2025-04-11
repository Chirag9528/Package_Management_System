import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductDetail from '../components/ProductDetail';

// Mock data - replace with actual API calls
const mockProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    oldPrice: 99.99,
    discount: 20,
    rating: 4,
    reviews: 152,
    imageUrl: null,
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life. Features include Bluetooth 5.0 connectivity, comfortable over-ear design, and high-quality audio reproduction. Perfect for work, travel, or everyday use."
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: 49.99,
    oldPrice: null,
    discount: 0,
    rating: 5,
    reviews: 89,
    imageUrl: null,
    description: "Track your steps, heart rate, sleep patterns and more with this advanced fitness tracker. Includes smartphone notifications and 7-day battery life. Water-resistant design makes it perfect for any activity."
  },
  // Add more products as needed
];

const ProductPage = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === parseInt(id));
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);
    
    // In real app, fetch from your backend
    // fetch(`/api/products/${id}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setProduct(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Error fetching product details:', err);
    //     setLoading(false);
    //   });
  }, [id]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      
      {loading ? (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="bg-gray-200 h-96 rounded"></div>
              </div>
              <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ProductDetail product={product} onAddToCart={addToCart} />
      )}
    </div>
  );
};

export default ProductPage;