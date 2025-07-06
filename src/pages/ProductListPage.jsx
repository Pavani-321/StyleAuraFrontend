// ProductDetailPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext"; // Assuming this context is correct
import { AuthContext } from "../context/AuthContextContext"; // Assuming this context is correct

const ProductDetailPage = () => {
  const { id: routeId } = useParams(); // id from URL, named routeId to avoid confusion
  const location = useLocation();
  const productFromState = location.state?.product;

  const [product, setProduct] = useState(() => {
    // Use productID for all product object references
    if (productFromState && productFromState.productID?.toString() === routeId) {
      return productFromState;
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    return !(productFromState && productFromState.productID?.toString() === routeId);
  });

  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If routeId is invalid (e.g., "undefined" string from URL)
    if (!routeId || routeId === "undefined") {
      setError("Invalid product ID in URL.");
      setLoading(false);
      setProduct(null); // Clear any stale product
      return;
    }

    // If product is already loaded from state and matches the routeId, no need to fetch
    // Check against the correct ID property (e.g., product.productId)
    if (product && product.productID?.toString() === routeId) {
      setLoading(false);
      setError("");
      return;
    }
    if (productFromState && productFromState.productID?.toString() === routeId && (!product || product.productID?.toString() !== routeId)) {
      setProduct(productFromState);
      setLoading(false);
      setError("");
      return;
    }


    setLoading(true);
    setError(""); // Clear previous errors

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7216/api/Products/${routeId}`);
        if (!res.ok) {
          const errorText = await res.text(); // Get more details from error response
          throw new Error(`Failed to fetch product (Status: ${res.status}). ${errorText}`);
        }
        const data = await res.json();
        // CRITICAL: Ensure the fetched 'data' has the correct ID property (e.g., data.productId)
        if (!data || typeof data.productID === 'undefined') {
          console.error("Fetched product data is missing an ID or malformed:", data);
          throw new Error("Product data from server is incomplete.");
        }
        setProduct(data);
      } catch (errCatch) {
        console.error("Error in fetchProduct:", errCatch);
        setError(errCatch.message || "Could not load product details.");
        setProduct(null); // Clear product on error
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [routeId, productFromState, product]); // Depend on routeId, productFromState, and product for re-evaluation

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!product) return;
    addToCart(product); // This product object should have the correct ID property
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-4">{error}</div>;
  if (!product) return <div className="text-center mt-4">Product not found.</div>; // More informative

  return (
    <div className="container mt-5">
      <div className="row justify-content-center"> {/* Added justify-content-center for better alignment */}
        <div className="col-md-8 col-lg-6"> {/* Adjusted column classes for responsiveness */}
          <div className="card p-3 shadow-sm" style={{ borderRadius: 8 }}> {/* Removed fixed maxWidth/width */}
            <img 
              src={product.imageURL} 
              alt={product.name} 
              className="card-img-top mx-auto"
              style={{
                width: '100%', // Make image responsive within card
                maxHeight: '400px', // Max height
                objectFit: 'contain',
                aspectRatio: '1 / 1',
                background: '#f8f9fa',
                borderRadius: 8,
                marginBottom: '1rem', // Add some space below image
              }}
            />
            <div className="card-body text-center" style={{fontSize: '1.2rem'}}>
              <h2 className="card-title mb-3">{product.name}</h2>
              {/* ASSUMING product object has price and description */}
              <p className="font-weight-bold text-primary fs-5">${product.price}</p>
              <p className="text-muted">{product.description}</p>
              <button onClick={handleAddToCart} className="btn btn-success w-100 mt-2">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;