import React from 'react';
import useAdminData from '../../hooks/useAdminData';
import AdminTable from './AdminTable';

const UsersList = () => {
  // Assuming your backend has an endpoint at /api/Admin/users
  const { data: users, loading, error } = useAdminData('users');

  const columns = [
    { header: 'User ID', accessor: 'userID' },
    { header: 'First Name', accessor: 'firstName' },
    { header: 'Last Name', accessor: 'lastName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
  ];

  return (
    <div>
       <div className="admin-content-header">
        <h2>Users Management</h2>
      </div>
      <AdminTable columns={columns} data={users} loading={loading} error={error} />
    </div>
  );
};

export default UsersList;
