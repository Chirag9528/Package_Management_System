import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [allitems , setAllItems] = useState([]);

  useEffect (()=>{
    const fetchitems = async ()=>{
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}/api/c/get_all_items`,{
        method : 'GET',
        credentials : "include"
      })
      .then(response => response.json())
      .catch(error => console.log(error))

      if (response && response.success){
        setAllItems(response.data);
      }
    }
    fetchitems();
    setLoading(false)
  },[])
  
  return (
    <div className=" bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome home</h1>
        {loading ? (
          
          <p>loading item</p>
          
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allitems.map(product => (
              <ProductCard key={product.item_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
