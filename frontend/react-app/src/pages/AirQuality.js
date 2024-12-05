import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function AirQuality() {
  const query = useQuery();
  const cityName = query.get('city');

  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cityName) {
      setError('City name is required to fetch air quality data.');
      setLoading(false);
      return;
    }

    const fetchAirQualityData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/air-pollution?name=${cityName}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch air quality data');
        }
        const data = await response.json();
        setAirQualityData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQualityData();
  }, [cityName]);

  if (loading) {
    return <p>Loading air quality data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!airQualityData) {
    return <p>No air quality data available.</p>;
  }

  return (
    <Container className="air-quality">
      <h1>Qualidade do ar em {airQualityData.city_name}</h1>
      <Card className="air-quality-card">
        <Card.Body>
          <Row className="align-items-center">
            {/* Coluna com os Dados da Qualidade do Ar */}
            <Col md={12}>
              <p>
                <strong>Índice de Qualidade do Ar (AQI):</strong> {airQualityData.air_quality_index}
              </p>
              <h4>Componentes:</h4>
              <p>
                <strong>CO (Monóxido de Carbono):</strong> {airQualityData.components.co} µg/m³
              </p>
              <p>
                <strong>NO (Óxido Nítrico):</strong> {airQualityData.components.no} µg/m³
              </p>
              <p>
                <strong>NO2 (Dióxido de Nitrogênio):</strong> {airQualityData.components.no2} µg/m³
              </p>
              <p>
                <strong>O3 (Ozônio):</strong> {airQualityData.components.o3} µg/m³
              </p>
              <p>
                <strong>SO2 (Dióxido de Enxofre):</strong> {airQualityData.components.so2} µg/m³
              </p>
              <p>
                <strong>PM2.5 (Material Particulado fino):</strong> {airQualityData.components.pm2_5} µg/m³
              </p>
              <p>
                <strong>PM10 (Material Particulado):</strong> {airQualityData.components.pm10} µg/m³
              </p>
              <p>
                <strong>NH3 (Amônia):</strong> {airQualityData.components.nh3} µg/m³
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AirQuality;
