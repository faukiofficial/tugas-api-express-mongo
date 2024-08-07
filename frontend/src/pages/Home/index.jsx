import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS
import './index.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://cruds-eduwork-server.onrender.com/api/v2/product?search=${search}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Konfirmasi Hapus Data',
      message: 'Anda yakin ingin menghapus data ini?',
      buttons: [
        {
          label: 'Iya',
          onClick: async () => {
            try {
              await fetch(`https://cruds-eduwork-server.onrender.com/api/v2/product/${id}`, {
                method: 'DELETE',
              });
              setProducts(products.filter(product => product._id !== id));
              toast.success('Data berhasil dihapus');
            } catch (error) {
              console.error('Error deleting product:', error);
              toast.error('Gagal menghapus data');
            }
          }
        },
        {
          label: 'Batalkan',
          onClick: () => console.log('Delete cancelled')
        }
      ]
    });
  };

  return (
    <div className="main">
      <Link to="/tambah" className="btn btn-primary">Tambah Produk</Link>
      <div className="search">
        <input
          type="text"
          placeholder="Masukan kata kunci..."
          value={search}
          onChange={handleSearch}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th className="text-right">Price</th>
            <th className="text-right">Status</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>
                {product.image && (
                  <img src={`https://cruds-eduwork-server.onrender.com${product.image}`} alt={product.name} width="50" />
                )}
              </td>
              <td className="text-right">RP. {product.price.toLocaleString()}</td>
              <td className="text-right">{product.status ? 'Available' : 'Unavailable'}</td>
              <td className="text-center">
                <Link to={`/detail/${product._id}`} className="btn btn-sm btn-info">Detail</Link>
                <Link to={`/edit/${product._id}`} className="btn btn-sm btn-warning">Edit</Link>
                <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer 
        autoClose={4000} 
      />
    </div>
  );
};

export default Home;
