import ProductDetail from '../components/ProductDetail';
import { useLocation } from 'react-router-dom';

const ProductPage = () => {
  const location = useLocation()
  const {obj} = location.state || {}

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail product={obj} />
    </div>
  );
};

export default ProductPage;