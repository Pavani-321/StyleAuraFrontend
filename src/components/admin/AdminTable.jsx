import React from 'react';

const AdminTable = ({ columns, data, loading, error, onDelete }) => {
  // Handler for delete button
  const handleDelete = async (id, item) => {
    console.log('Attempting to delete product. Item:', item, 'Resolved id:', id); // Debug log
    if (!id) {
      alert('No valid product ID found for deletion.');
      return;
    }
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;
    try {
      const response = await fetch(`https://localhost:7216/api/Products/${id}`, {
        method: 'DELETE',
      });
      const text = await response.text(); // Get response body for debugging
      if (!response.ok) throw new Error(`Failed to delete product. Status: ${response.status}. Response: ${text}`);
      if (onDelete) onDelete(id); // Optional: parent can refresh data
      alert('Product deleted successfully');
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  if (loading) return <p className="loading-message">Loading data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map(col => <th key={col.accessor}>{col.header}</th>)}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((item) => {
            const id = item.id || item.productID || item.userID;
            return (
              <tr key={id}>
                {columns.map(col => <td key={col.accessor}>{item[col.accessor]}</td>)}
                <td>
                  {/* <button className="action-btn edit">Edit</button> */}
                  <button style={{}} className="action-btn delete" onClick={() => handleDelete(id, item)}>Delete</button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={columns.length + 1}>No data found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AdminTable;
