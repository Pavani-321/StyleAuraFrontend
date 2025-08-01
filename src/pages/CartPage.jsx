import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import RemoveButton from "../components/RemoveButton";

const CartPage = () => {
  const { cart, removeFromCart, changeQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Your cart is empty</h3>
        <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Cart</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.productID}>
                <td className="d-flex align-items-center gap-3">
                  <img src={item.productImageUrl} alt={item.productName} style={{ width: 60, height: 60, objectFit: 'contain', background: '#f8f9fa', borderRadius: 8 }} />
                  <span>{item.productName}</span>
                </td>
                <td>₹{item.price.toFixed(2)}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => changeQuantity(item.productID, -1)} disabled={item.quantity === 1}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => changeQuantity(item.productID, 1)}>+</button>
                  </div>
                </td>
                <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <RemoveButton onClick={() => removeFromCart(item.productID)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Total: ₹{total.toFixed(2)}</h4>
        <Link to="/checkout" className="btn btn-success btn-lg">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default CartPage;