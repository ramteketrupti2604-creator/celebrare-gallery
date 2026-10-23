import { useState, useEffect } from 'react';
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const page = 2;
        const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=30`);
        if (!res.ok) throw new Error('Failed');
        let data = await res.json();
        data = data.sort(() => 0.5 - Math.random());
        setPhotos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return { photos, loading, error };
}