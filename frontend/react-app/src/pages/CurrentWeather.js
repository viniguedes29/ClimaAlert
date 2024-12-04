import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function CurrentWeather() {
    const query = useQuery();
    const cityName = query.get('city');

    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cityName) {
            setError('City name is required to fetch weather data.');
            setLoading(false);
            return;
        }

        const fetchWeatherData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/weather?name=${cityName}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [cityName]);

    if (loading) {
        return <p>Loading weather data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!weatherData) {
        return <p>No weather data available.</p>;
    }

    return (
        <Container className="current-weather">
            <h1>Condições meteorológicas atuais em {weatherData.city_name}</h1>
            <Card className="weather-card">
                <Card.Body>
                    <Row className="align-items-center">
                        {/* Coluna da Imagem */}
                        <Col md={4} className="text-center">
                            <img
                                src="/img/weather-icon.png" // Caminho para o ícone
                                alt="Ícone do Clima"
                                style={{
                                    width: '200px', // Tamanho maior para a imagem
                                    height: '200px',
                                    objectFit: 'contain', // Mantém proporções
                                }}
                            />
                        </Col>

                        {/* Coluna com os Dados Meteorológicos */}
                        <Col md={8}>
                            <p><strong>Descrição:</strong> {weatherData.weather_description}</p>
                            <p><strong>Temperatura:</strong> {weatherData.temperature.toFixed(2)}°C</p>
                            <p><strong>Sensação Térmica:</strong> {weatherData.feels_like.toFixed(2)}°C</p>
                            <p><strong>Umidade:</strong> {weatherData.humidity}%</p>
                            <p><strong>Nuvens:</strong> {weatherData.cloudiness}%</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CurrentWeather;

