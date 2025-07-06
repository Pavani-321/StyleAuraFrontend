import React, { useState } from 'react';
import useAdminData from '../../hooks/useAdminData';
import AdminTable from './AdminTable'; // A new reusable table component
import '../../styling/ProductList.css';

const ProductsList = () => {
  const { data: products, loading, error, refetch } = useAdminData('products');

  // Debug: log products to inspect category field
  console.log('Products data:', products);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageURL: '',
    categoryID: '',
    stockQuantity: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const columns = [
    { header: 'ID', accessor: 'productID' },
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Price', accessor: 'price' },
    { header: 'CategoryID', accessor: 'categoryID' },
    { header: 'Stock Quantity', accessor: 'stockQuantity' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('https://localhost:7216/api/Products/AddProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          imageURL: form.imageURL,
          stockQuantity: parseInt(form.stockQuantity, 10),
          categoryID: parseInt(form.categoryID, 10),
        }),
      });
      if (!response.ok) throw new Error('Failed to add product');
      setShowPopup(false);
      setForm({ name: '', description: '', price: '', imageURL: '', categoryID: '', stockQuantity: '' });
      if (refetch) refetch();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="admin-content-header">
        <h2>Products Management</h2>
        <button className="create-btn" onClick={() => setShowPopup(true)}>Add New Product</button>
      </div>
      <AdminTable columns={columns} data={products} loading={loading} error={error} />
      {showPopup && (
        <div className="popup-overlay" style={{ position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div className="popup-content" style={{ background:'#fff', padding:24, borderRadius:8, minWidth:320, boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
            <h3>Add New Product</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:12 }}>
                <label>Name:</label><br />
                <input name="name" value={form.name} onChange={handleInputChange} required />
              </div>
              <div style={{ marginBottom:12 }}>
                <label>Description:</label><br />
                <input name="description" value={form.description} onChange={handleInputChange} required />
              </div>
              <div style={{ marginBottom:12 }}>
                <label>Price:</label><br />
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleInputChange} required />
              </div>
              <div style={{ marginBottom:12 }}>
                <label>Image URL:</label><br />
                <input name="imageURL" value={form.imageURL} onChange={handleInputChange} required />
              </div>
              <div style={{ marginBottom:12 }}>
                <label>Category ID:</label><br />
                <input name="categoryID" type="number" value={form.categoryID} onChange={handleInputChange} required />
              </div>
              <div style={{ marginBottom:12 }}>
                <label>Stock Quantity:</label><br />
                <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleInputChange} required />
              </div>
              {submitError && <div style={{ color:'red', marginBottom:8 }}>{submitError}</div>}
              <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Product'}</button>
              <button type="button" onClick={() => setShowPopup(false)} style={{ marginLeft:8 }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
