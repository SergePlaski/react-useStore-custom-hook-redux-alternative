import { useStore } from '../hooks-store/store'; 
import ProductItem from '../components/Products/ProductItem';

import './Products.css';

const Products = () => {
  const productsList = useStore()[0]?.products;

  return (
    <ul className="products-list">
      {productsList.map(prod => (
        <ProductItem
          key={prod.id}
          id={prod.id}
          title={prod.title}
          description={prod.description}
          isFav={prod.isFavorite}
        />
      ))}
    </ul>
  );
};

export default Products;
