import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

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
    imageUrl: "https://picsum.photos/seed/picsum/200/300",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life."
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: 49.99,
    oldPrice: null,
    discount: 0,
    rating: 5,
    reviews: 89,
    imageUrl: "https://picsum.photos/seed/picsum/200/300",
  
    description: "Track your steps, heart rate, sleep patterns and more with this advanced fitness tracker."
  },
  {
    id: 3,
    name: "Portable Power Bank",
    price: 29.99,
    oldPrice: 39.99,
    discount: 25,
    rating: 4,
    reviews: 74,
    imageUrl: "https://picsum.photos/seed/picsum/200/300",
    description: "10,000mAh capacity power bank with fast charging capabilities for all your devices."
  },
  {
    id: 4,
    name: "Smart Home Speaker",
    price: 129.99,
    oldPrice: null,
    discount: 0,
    rating: 4,
    reviews: 63,
    imageUrl: "https://picsum.photos/seed/picsum/200/300",
    description: "Voice-controlled smart speaker with premium sound quality and virtual assistant."
  },
  {
    id: 5,
    name: "Ultra HD Action Camera",
    price: 199.99,
    oldPrice: 249.99,
    discount: 20,
    rating: 5,
    reviews: 36,
    imageUrl: "https://picsum.photos/seed/picsum/200/300",
    description: "Waterproof 4K action camera with image stabilization and wide-angle lens."
  },
  {
    id: 6,
    name: "Laptop Backpack",
    price: 39.99,
    oldPrice: null,
    discount: 0,
    rating: 4,
    reviews: 127,
    imageUrl: "https://picsum.photos/seed/picsum/200/300",
    description: "Water-resistant backpack with laptop compartment, USB charging port and anti-theft design."
  }
];


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
    
    
    // In real app, fetch from your backend
    // fetch('/api/products')
    //   .then(res => res.json())
    //   .then(data => {
    //     setProducts(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Error fetching products:', err);
    //     setLoading(false);
    //   });
  }, []);
  
  return (
    <div className=" bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-72 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
