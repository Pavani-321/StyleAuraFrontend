import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer"; // Ensure this path is correct
import "../App.css"; // Ensure this path is correct

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [brands, setBrands] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [selectedRating, setSelectedRating] = useState(0);
  const location = useLocation();
  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "https://localhost:7216/api/Products/";
        if (searchQuery.trim()) {
          url = `https://localhost:7216/api/Products/search?query=${encodeURIComponent(searchQuery.trim())}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        const uniqueBrands = Array.from(new Set(data.map(p => p.brand).filter(Boolean)));
        setBrands(uniqueBrands);
        fetchAllRatings(data);
      } catch (err) {
        setError("Could not load products: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    // Helper to fetch all ratings
    const fetchAllRatings = async (productsList) => {
      const ratingsObj = {};
      await Promise.all(productsList.map(async (product) => {
        if (!product || typeof product.productID === 'undefined') return;
        try {
          const res = await fetch(`https://localhost:7216/api/ProductRatings/product/${product.productID}/average`);

          if (res.ok) {
            const rating = await res.json();
            ratingsObj[product.productID] = rating;
          }
        } catch {
          // Ignore rating fetch errors for now
        }
      }));
      setProductRatings(ratingsObj);
    };
    fetchProducts();
    // Re-fetch when searchQuery changes
  }, [searchQuery]);

  const filteredProducts = products.filter(product => {
    const inBrand = selectedBrand ? product.brand === selectedBrand : true;
    const price = parseFloat(product.price);
    const inPrice = !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
    const rating = productRatings[product.productID];
    // Only filter if selectedRating > 0
    const inRating = selectedRating > 0 ? (typeof rating === 'number' && rating >= selectedRating) : true;
    return inBrand && inPrice && inRating;
  });

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-4">{error}</div>;

  return (
    // CRITICAL CHANGE: width: '100%' instead of '100vw'
    <>
    <div className="d-flex" style={{ minHeight: '60vh', width: '100vw', background: '#f8f9fa' }}>
      {/* Sidebar - fixed on the left */}
      <div className="sidebar-fixed">
        <div className="card p-3 border-0"> {/* This card is inside sidebar */}
          <h5 className="mb-3">Filters</h5>
          <div className="mb-3">
            <label htmlFor="brand-select" className="form-label">Brand</label> {/* Added htmlFor */}
            <select id="brand-select" className="form-select" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="rating-filter-select" className="form-label">Rating</label>
            <select id="rating-filter-select" className="form-select" value={selectedRating} onChange={e => setSelectedRating(Number(e.target.value))}>
              <option value={0}>All Ratings</option>
              <option value={5}>5 stars</option>
              <option value={4}>4 stars & up</option>
              <option value={3}>3 stars & up</option>
              <option value={2}>2 stars & up</option>
              <option value={1}>1 star & up</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="price-range-input" className="form-label">Price Range</label> {/* Added htmlFor */}
            <div>
              <span className="d-block mb-1">${priceRange[0]} - ${priceRange[1]}</span> {/* Show both ends of range */}
              <input
                type="range"
                id="price-range-input"
                className="form-range"
                min={0}
                max={10000} // Consider deriving max from actual product prices
                step={10}
                value={priceRange[1]}
                onChange={e => {
                  const val = +e.target.value;
                  setPriceRange([priceRange[0], val]); // Assuming min is always 0 for this slider
                }}
              />
            </div>
          </div>
          <button className="btn btn-secondary w-100 mt-2" onClick={() => { setSelectedBrand(""); setPriceRange([0, 10000]); setSelectedRating(0); }}>Clear Filters</button>
        </div>
      </div>
      {/* Products List - right side, with left margin for sidebar */}
      <div className="products-flex-area">
        <div className="product-grid" style={{marginTop:'40px'}}>
          {filteredProducts.length === 0 ? (
            <div className="text-center text-muted py-5 w-100">
              No products available in this range.
            </div>
          ) : (
            filteredProducts.map((product) => {
              if (!product || typeof product.productID === 'undefined') {
                console.warn("Skipping rendering of invalid product:", product);
                return null;
              }
              // Get rating for this product
              const rating = productRatings[product.productID];
              return (
                <div key={product.productID} className="product-card card shadow-sm border-0">
                  <Link to={`/products/${product.productID}`} state={{ product: product }} style={{ textDecoration: 'none', display: 'contents' }}>
                    <img
                      src={product.imageURL || 'https://via.placeholder.com/180?text=No+Image'}
                      alt={product.name || 'Product Image'}
                      className="product-img"
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title" style={{fontSize:'1rem',color:"black"}}>{product.name || 'Unnamed Product'}</h5>
                      <p className="card-text">₹{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</p>
                      {/* Show rating as stars if available */}
                      {typeof rating === 'number' && !isNaN(rating) && (
                        <div className="product-rating" style={{color:'#f5c518', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center'}}>
                          {Array.from({ length: 5 }, (_, i) => {
                            if (rating >= i + 1) {
                              // Full star
                              return <span key={i} style={{ fontSize: '1.1em', marginRight: 1 }}>★</span>;
                            } else if (rating > i && rating < i + 1) {
                              // Half star (using SVG for better look)
                              return (
                                <span key={i} style={{ fontSize: '1.1em', marginRight: 1, position:'relative', display:'inline-block', width:'1.1em', height:'1em' }}>
                                  <svg width="1em" height="1em" viewBox="0 0 24 24" style={{position:'absolute',top:0,left:0}}>
                                    <defs>
                                      <linearGradient id={`half-star-${product.productID}-${i}`} x1="0" x2="1" y1="0" y2="0">
                                        <stop offset="50%" stopColor="#f5c518"/>
                                        <stop offset="50%" stopColor="#e4e5e9"/>
                                      </linearGradient>
                                    </defs>
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={`url(#half-star-${product.productID}-${i})`} stroke="#f5c518" strokeWidth="0.5"/>
                                  </svg>
                                </span>
                              );
                            } else {
                              // Empty star
                              return <span key={i} style={{ fontSize: '1.1em', marginRight: 1, color:'#e4e5e9' }}>★</span>;
                            }
                          })}
                          <span style={{ color: '#888', fontSize: '0.8em', marginLeft: 4 }}>({rating.toFixed(1)})</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    <div>
      <Footer/>
    </div>
    </>
    
  );
};

export default HomePage;