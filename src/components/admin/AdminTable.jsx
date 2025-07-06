import React from 'react';

const AdminTable = ({ columns, data, loading, error }) => {
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
          data.map((item) => (
            <tr key={item.id || item.userID}>
              {columns.map(col => <td key={col.accessor}>{item[col.accessor]}</td>)}
              <td>
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">Delete</button>
              </td>
            </tr>
          ))
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
