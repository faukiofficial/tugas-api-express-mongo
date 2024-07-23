import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './index.scss';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    status: false,
    image_url: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v2/product/${id}`);
        const data = await response.json();
        setProduct({
          name: data.name,
          price: data.price,
          stock: data.stock,
          status: data.status,
          image_url: data.image_url
        });
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (event) => {
    setNewImage(event.target.files[0]);
    setImageSelected(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    confirmAlert({
      title: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin menyimpan perubahan?',
      buttons: [
        {
          label: 'Iya',
          onClick: () => submitForm()
        },
        {
          label: 'Batal',
          onClick: () => toast.info('Perubahan dibatalkan.')
        }
      ]
    });
  };

  const submitForm = async () => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    formData.append('status', product.status);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v2/product/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui produk');
      }

      toast.success('Produk berhasil diperbarui!');
      navigate('/'); // Redirect to home or another page after success
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Edit Produk</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <Input
            name="name"
            type="text"
            placeholder="Nama Produk..."
            label="Nama"
            value={product.name}
            onChange={handleChange}
          />
          <Input
            name="price"
            type="number"
            placeholder="Harga Produk..."
            label="Harga"
            value={product.price}
            onChange={handleChange}
          />
          <Input
            name="stock"
            type="number"
            placeholder="Stock Produk..."
            label="Stock"
            value={product.stock}
            onChange={handleChange}
          />
          <Input
            name="status"
            type="checkbox"
            label="Active"
            checked={product.status}
            onChange={handleChange}
          />
          <div className="form-group">
            <label>Gambar Produk</label>
            {product.image_url && (
              <div className="image-container">
                <img src={product.image_url} alt="Produk" className="product-image" />
                <div className={`overlay ${imageSelected ? 'selected' : ''}`}>
                  <span className="change-image-text" onClick={() => document.getElementById('imageInput').click()}>
                    {imageSelected ? "Klik 'Simpan' untuk mengganti foto" : "Ganti gambar"}
                  </span>
                </div>
              </div>
            )}
            <input
              type="file"
              id="imageInput"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
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

export default Edit;
