import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { token, setToken, setUser, user } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken && setToken(null);
    setUser && setUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  // Get first name from user object or sessionStorage fallback
  let username = '';
  if (user && typeof user === 'object') {
    if (user.username) {
      username = user.username.split(' ')[0];
    } else if (user.name) {
      username = user.name.split(' ')[0];
    } else if (user.email) {
      username = user.email.split('@')[0];
    }
  } else if (typeof user === 'string') {
    username = user.split(' ')[0];
  } else {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.username) {
          username = parsed.username.split(' ')[0];
        } else if (parsed.name) {
          username = parsed.name.split(' ')[0];
        } else if (parsed.email) {
          username = parsed.email.split('@')[0];
        }
      } catch {
        username = storedUser.split(' ')[0];
      }
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow sticky-top" style={{ minHeight: '70px', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1050 }}>
      <div className="container-fluid" style={{ maxWidth: '100%' }}>
        <Link className="navbar-brand fw-bold text-primary fs-2" to="/">StyleAura</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>
          </ul>
          <form className="d-flex me-3">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </form>
          {token && username && (
            <span className="text-secondary me-3" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
              <div style={{color:'blue'}}>Hello</div>{username}
            </span>
          )}
          {token ? (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          ) : (
            <Link className="btn btn-primary" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;