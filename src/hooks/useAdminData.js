import { useState, useEffect } from 'react';

const useAdminData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }
        
        const res = await fetch(`https://localhost:7216/api/Admin/${endpoint}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          // Try to get a meaningful error message from the backend
          const errorData = await res.json().catch(() => ({ message: `Request failed with status ${res.status}` }));
          throw new Error(errorData.message || "Failed to fetch data.");
        }

        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]); // Re-run the effect if the endpoint changes

  return { data, loading, error, setData };
};

export default useAdminData;
