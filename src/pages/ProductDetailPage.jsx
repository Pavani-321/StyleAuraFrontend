import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContextContext";
import "../styling/ProductDetailPage.css"; // Ensure this path is correct

const ProductDetailPage = () => {
  const { id } = useParams(); // ID from URL
  const location = useLocation();
  const productFromState = location.state?.product; // Product passed via navigation state

  const [product, setProduct] = useState(null); // Current product details
  const [loading, setLoading] = useState(true); // For overall page/product loading
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]); // Holds an ARRAY of review objects
  const [averageRating, setAverageRating] = useState(null); // For the overall product average rating

  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showAllReviews, setShowAllReviews] = useState(false);

  // Memoized function to fetch reviews for a given product ID
  const fetchProductReviews = useCallback(async (productIdToFetch) => {
    if (!productIdToFetch) return;
    try {
      // Use the correct API endpoint for reviews and usernames
      const res = await fetch(`https://localhost:7216/api/ProductRatings/product/${productIdToFetch}`);
      if (res.ok) {
        const data = await res.json(); // Expecting array of reviews with userName
        setReviews(Array.isArray(data) ? data : []);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    }
  }, []); // useCallback with empty deps as it doesn't rely on component scope variables that change

  // Effect 1: Determine product ID and fetch/set product details
  useEffect(() => {
    let currentProductId;
    if (id) { // Prioritize ID from URL params
      currentProductId = id;
    } else if (productFromState?.productID) { // Fallback to ID from navigation state
      currentProductId = productFromState.productID.toString();
    }

    if (!currentProductId) {
      setError("Product ID not found.");
      setLoading(false);
      setProduct(null);
      setReviews([]); // Ensure reviews are cleared
      return;
    }

    // If product is already loaded and its ID matches the current ID, no need to refetch product.
    if (product && product.productID?.toString() === currentProductId) {
      setLoading(false); // Product is already set
      return;
    }

    // If product from navigation state is available, matches current ID, and product isn't set yet
    if (productFromState && productFromState.productID?.toString() === currentProductId && !product) {
      setProduct(productFromState);
      setLoading(false);
      return;
    }

    // Fallback: Fetch product from API
    const fetchProductData = async () => {
      setLoading(true);
      setError("");
      setProduct(null); // Clear previous product if ID is different
      setReviews([]);   // Clear previous reviews
      try {
        const productRes = await fetch(`https://localhost:7216/api/Products/${currentProductId}`); // FIX: use currentProductId
        if (!productRes.ok) throw new Error(`Failed to fetch product (status ${productRes.status})`);
        const productData = await productRes.json();
        setProduct(productData);
      } catch (e) {
        setError(e.message || "Could not load product details.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();

  }, [id, productFromState, product]); // Rerun if ID or productFromState changes, or if product was reset

  // Effect 2: Fetch reviews when `product` details are available or change
  useEffect(() => {
    if (product && product.productID) {
      fetchProductReviews(product.productID);
    } else {
      // If no product, or product has no ID, ensure reviews are empty
      setReviews([]);
    }
  }, [product, fetchProductReviews]); // Rerun if product object changes or fetchProductReviews instance changes

  // Effect 3: Calculate average rating when `reviews` data changes
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const totalScore = reviews.reduce((acc, currReview) => acc + currReview.ratingValue, 0);
      const avg = totalScore / reviews.length;
      setAverageRating(avg);
    } else {
      setAverageRating(null); // No reviews, so no average rating
    }
  }, [reviews]);

  // Effect 4: Check if product is already in cart
  useEffect(() => {
    if (product && cart.some(item => item.productID === product.productID)) {
      setAddedToCart(true);
    } else {
      setAddedToCart(false);
    }
  }, [cart, product]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!product) return;
    addToCart(product);
    setAddedToCart(true);
  };

  if (loading && !product) return <div className="text-center mt-4">Loading product details...</div>;
  if (error) return <div className="text-center text-danger mt-4">{error}</div>;
  if (!product) return <div className="text-center mt-4">Product not found.</div>;

  return (
    <div className="product-detail-grid" style={{marginTop:"5rem"}}>
      <div className="product-detail-image-area">
        <img 
          src={product.imageURL} 
          alt={product.name} 
          className="product-detail-img"
        />
        <h2 className="card-title mb-2" style={{textAlign:'center'}}>{product.name}</h2>
        <p className="font-weight-bold text-primary fs-5 mb-2">₹{product.price.toFixed(2)}</p>

      </div>
      {/* Right: Details and Reviews */}
      <div className="product-detail-info-area">
        <h2 className="card-title mb-2 d-md-none" style={{textAlign:'center'}}>{product.name}</h2>
        
        {/* Display Average Rating */}
        {typeof averageRating === 'number' && !isNaN(averageRating) ? (
          <div className="product-rating mb-2" style={{color:'#f5c518', fontWeight:'bold', display:'flex', alignItems:'center'}}>
            {Array.from({ length: 5 }, (_, i) => {
              if (averageRating >= i + 1) {
                return <span key={i} style={{ fontSize: '1.2em', marginRight: 1 }}>★</span>;
              } else if (averageRating > i && averageRating < i + 1) {
                return (
                  <span key={i} style={{ fontSize: '1.2em', marginRight: 1, position:'relative', display:'inline-block', width:'1.1em', height:'1em' }}>
                    <svg width="1em" height="1em" viewBox="0 0 24 24" style={{position:'absolute',top:0,left:0}}>
                      <defs>
                        <linearGradient id={`half-star-detail-${product.productID}-${i}`} x1="0" x2="1" y1="0" y2="0">
                          <stop offset="50%" stopColor="#f5c518"/>
                          <stop offset="50%" stopColor="#e4e5e9"/>
                        </linearGradient>
                      </defs>
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={`url(#half-star-detail-${product.productID}-${i})`} stroke="#f5c518" strokeWidth="0.5"/>
                    </svg>
                  </span>
                );
              } else {
                return <span key={i} style={{ fontSize: '1.2em', marginRight: 1, color:'#e4e5e9' }}>★</span>;
              }
            })}
            <span style={{ color: '#888', fontSize: '0.9em', marginLeft: 4 }}>
              ({averageRating.toFixed(1)}) based on {reviews.length} review{reviews.length === 1 ? '' : 's'}
            </span>
          </div>
        ) : (
          !loading && <div className="text-muted mb-2">No ratings yet.</div>
        )}

        <p className="text-muted mb-3">{product.description}</p>
        <button
          onClick={() => {
            if (addedToCart) {
              navigate("/cart");
            } else {
              handleAddToCart();
            }
          }}
          className={`add-to-cart-btn w-100 mt-2${addedToCart ? " added-to-cart" : ""}`}
        >
          {addedToCart ? "View Cart" : "Add to Cart"}
        </button>

        {/* Display Individual Reviews */}
        <div className="mt-4">
          <h5 style={{fontWeight:'bold'}}>Reviews ({reviews.length})</h5>
          {reviews.length === 0 && !loading ? (
            <div className="text-muted">No reviews found for this product.</div>
          ) : (
            <>
              {(showAllReviews ? reviews : reviews.slice(0, 3)).map((singleReview) => (
                <div key={singleReview.ratingId} style={{marginBottom:'1.2em', borderBottom:'1px solid #eee', paddingBottom:'0.7em'}}>
                  <div style={{fontWeight:'bold', color:'#333'}}>{singleReview.userName || singleReview.username || `User ${singleReview.userId || 'Anonymous'}`}</div>
                  <div style={{color:'#f5c518', fontSize:'1em', marginBottom:2}}>
                    {Array.from({ length: 5 }, (_, i) => singleReview.ratingValue >= i + 1 ? '★' : '☆')}
                    <span style={{ color: '#888', fontSize: '0.85em', marginLeft: 4 }}>({singleReview.ratingValue})</span>
                  </div>
                  <div style={{color:'#555'}}>{singleReview.reviewText}</div>
                </div>
              ))}
              {reviews.length > 3 && !showAllReviews && (
                <button className="btn btn-link p-0" style={{color:'#007bff', fontWeight:'bold', fontSize:'1.05em'}} onClick={() => setShowAllReviews(true)}>
                  See all reviews
                </button>
              )}
              {showAllReviews && reviews.length > 3 && (
                <button className="btn btn-link p-0" style={{color:'#007bff', fontWeight:'bold', fontSize:'1.05em'}} onClick={() => setShowAllReviews(false)}>
                  Show less
                </button>
              )}
            </>
          )}
          {loading && reviews.length === 0 && <div className="text-muted">Loading reviews...</div> }
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;