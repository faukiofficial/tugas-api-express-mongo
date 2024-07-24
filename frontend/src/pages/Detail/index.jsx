import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './index.scss';

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://cruds-eduwork-server.onrender.com/api/v2/product/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <Link to="/" className="btn btn-primary">Kembali</Link>

      <table className="table">
        <tbody>
          <tr>
            <td>ID</td>
            <td>: {product._id}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>: {product.name}</td>
          </tr>
          <tr>
            <td>Price</td>
            <td>: Rp. {product.price.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Stock</td>
            <td>: {product.stock}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>: {product.status ? 'Available' : 'Unavailable'}</td>
          </tr>
          <tr>
            <td>Image</td>
            <td>: 
              {product.image ? (
                <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} width="100" />
              ) : (
                ' No image available'
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Detail;
