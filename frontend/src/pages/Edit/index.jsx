import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import Input from '../../components/Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './index.scss';

const validationSchema = Yup.object({
  name: Yup.string().required('Nama produk diperlukan'),
  price: Yup.number().required('Harga produk diperlukan').positive('Harga harus positif'),
  stock: Yup.number().required('Stock produk diperlukan').min(0, 'Stock tidak boleh negatif'),
  status: Yup.boolean(),
  image: Yup.mixed()
});

const Edit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v2/product/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      price: product?.price || '',
      stock: product?.stock || '',
      status: product?.status || false,
      image: null
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('stock', values.stock);
      formData.append('status', values.status);
      if (values.image) {
        formData.append('image', values.image);
      }

      confirmAlert({
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin menyimpan perubahan?',
        buttons: [
          {
            label: 'Iya',
            onClick: async () => {
              try {
                const response = await fetch(`http://localhost:3000/api/v2/product/${id}`, {
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

  if (!product) {
    return <div>Loading...</div>;
  }

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
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name && formik.touched.name ? <div className="error">{formik.errors.name}</div> : null}
          </div>

          <div className="form-group">
            <label>Harga Produk</label>
            <input
              type="number"
              name="price"
              onChange={formik.handleChange}
              value={formik.values.price}
            />
            {formik.errors.price && formik.touched.price ? <div className="error">{formik.errors.price}</div> : null}
          </div>

          <div className="form-group">
            <label>Stock Produk</label>
            <input
              type="number"
              name="stock"
              onChange={formik.handleChange}
              value={formik.values.stock}
            />
            {formik.errors.stock && formik.touched.stock ? <div className="error">{formik.errors.stock}</div> : null}
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
            {product.image_url && (
              <div className="image-container">
                <img src={product.image_url} alt="Produk" className="product-image" />
              </div>
            )}
            <input
              type="file"
              name="image"
              onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])}
            />
            {formik.errors.image && formik.touched.image ? <div className="error">{formik.errors.image}</div> : null}
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
