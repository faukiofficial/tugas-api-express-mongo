import { useState } from 'react';
import Input from '../../components/Input';
import './index.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tambah = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('status', status);
    formData.append('image', image);

    try {
      const response = await fetch('https://cruds-eduwork-server.onrender.com/api/v2/product', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal menambah produk');
      } else {
        toast.success('Produk berhasil ditambah!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Tambah Produk</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <Input
            name="name"
            type="text"
            placeholder="Nama Produk..."
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            name="price"
            type="number"
            placeholder="Harga Produk..."
            label="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            name="stock"
            type="number"
            placeholder="Stock Produk..."
            label="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <Input
            name="status"
            type="checkbox"
            label="Active"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          <Input
            name="image"
            type="file"
            label="Gambar"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button type="submit" className="btn btn-primary">Simpan</button>
        </form>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default Tambah;
