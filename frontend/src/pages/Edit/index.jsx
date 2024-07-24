import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './index.scss';

const validationSchema = Yup.object({
  name: Yup.string().required('Nama produk diperlukan'),
  price: Yup.number().required('Harga produk diperlukan').positive('Harga harus positif'),
  stock: Yup.number().required('Stock produk diperlukan').min(0, 'Stock tidak boleh negatif'),
  status: Yup.boolean()
});

const Edit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    status: false,
    image: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://cruds-eduwork-server.onrender.com/api/v2/product/${id}`);
        const data = await response.json();
        setProduct({
          name: data.name,
          price: data.price,
          stock: data.stock,
          status: data.status,
          image: data.image
        });
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: product.name,
      price: product.price,
      stock: product.stock,
      status: product.status
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('stock', values.stock);
      formData.append('status', values.status);
      if (newImage) {
        formData.append('image', newImage);
      }

      confirmAlert({
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin menyimpan perubahan?',
        buttons: [
          {
            label: 'Iya',
            onClick: async () => {
              try {
                const response = await fetch(`https://cruds-eduwork-server.onrender.com/api/v2/product/${id}`, {
                  method: 'PUT',
                  body: formData
                });

                if (!response.ok) {
                  throw new Error('Gagal memperbarui produk');
                }

                toast.success('Produk berhasil diperbarui!');
              } catch (error) {
                toast.error(error.message);
              }
            }
          },
          {
            label: 'Batal',
            onClick: () => toast.info('Perubahan dibatalkan.')
          }
        ]
      });
    }
  });

  const handleImageChange = (event) => {
    setNewImage(event.target.files[0]);
    setImageSelected(true);
    formik.setFieldValue('image', event.target.files[0]);
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Edit Produk</h2>
        <br />
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Nama Produk</label>
            <input
              type="text"
              name="name"
              placeholder="Nama Produk..."
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.errors.name && formik.touched.name ? (
              <div className="error">{formik.errors.name}</div>
            ) : null}
          </div>
          
          <div className="form-group">
            <label>Harga Produk</label>
            <input
              type="number"
              name="price"
              placeholder="Harga Produk..."
              value={formik.values.price}
              onChange={formik.handleChange}
            />
            {formik.errors.price && formik.touched.price ? (
              <div className="error">{formik.errors.price}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label>Stock Produk</label>
            <input
              type="number"
              name="stock"
              placeholder="Stock Produk..."
              value={formik.values.stock}
              onChange={formik.handleChange}
            />
            {formik.errors.stock && formik.touched.stock ? (
              <div className="error">{formik.errors.stock}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label>Status</label>
            <input
              type="checkbox"
              name="status"
              checked={formik.values.status}
              onChange={formik.handleChange}
            />
          </div>

          <div className="form-group">
            <label>Gambar Produk</label>
            {product.image && (
              <div className="image-container">
                <img 
                  src={`data:image/jpeg;base64,${product.image}`} 
                  alt="Produk" 
                  className="product-image" 
                  width="100"
                />
                <div className={`overlay ${imageSelected ? 'selected' : ''}`}>
                  <span 
                    className="change-image-text" 
                    onClick={() => document.getElementById('imageInput').click()}
                  >
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
