import React from 'react';

const AdminNavbar = ({ children, activeTab, setActiveTab }) => (
  <>
    <nav className="admin-header">
      <span className="admin-logo">Admin Panel</span>
      <div style={{ marginBottom: 0 }}>
        <button className={activeTab === 'products' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('products')}>Products</button>
        <button className={activeTab === 'users' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('users')}>Users</button>
        <button className={activeTab === 'orders' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('orders')}>Orders</button>
        <button
          className="admin-logout"
          style={{ marginLeft: 16 }}
          onClick={() => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
    <div className="admin-content">
      {children}
    </div>
  </>
);

export default AdminNavbar;