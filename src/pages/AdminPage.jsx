import React, { useState } from 'react';
import '../styling/AdminPage.css';
import AdminNavbar from '../components/AdminNavbar';
import ProductsList from '../components/admin/ProductsList';
import UsersList from '../components/admin/UsersList';

// Placeholder for Orders
const OrdersList = () => <h2>Orders Management (Coming Soon)</h2>;

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsList />;
      case 'users':
        return <UsersList />;
      case 'orders':
        return <OrdersList />;
      default:
        return <ProductsList />;
    }
  };

  return (
    <div className="admin-container">
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="admin-content">
        {renderContent()}
      </main>
      <footer className="admin-footer">
        <p>© 2024 StyleAura Admin Panel</p>
      </footer>
    </div>
  );
};

export default AdminPage;
