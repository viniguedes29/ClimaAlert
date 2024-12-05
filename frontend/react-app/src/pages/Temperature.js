import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import '../styles.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Temperature() {
  const query = useQuery();
  const cityName = query.get('city');

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cityName) {
      setError('City name is required to fetch temperature forecast.');
      setLoading(false);
      return;
    }

    const fetchForecastImage = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/temperature-graph?name=${cityName}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch forecast image');
        }
        const imageBlob = await response.blob();
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageObjectUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastImage();
  }, [cityName]);

  if (loading) {
    return <p>Loading temperature forecast...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!imageUrl) {
    return <p>No forecast image available.</p>;
  }

  return (
    <Container className='temperature'>
      <h1>Previsão de Temperatura (5 dias) para {cityName}</h1>
      <div className='forecast-image-container'>
        <img src={imageUrl} alt={`Previsão de temperatura para ${cityName}`} />
      </div>
    </Container>
  );
}

export default Temperature;
