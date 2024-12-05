import React from 'react';
import Container from 'react-bootstrap/Container';
import { useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles.css';

function AirQuality({city_name}) {
    const location = useLocation(); // Hook para acessar a localização atual

    // Função para obter o valor de 'city' da query string
    const getCityFromQuery = () => {
        const params = new URLSearchParams(location.search);
        return params.get('city');
    };

    const city = getCityFromQuery();
    
    return (
        <Container className="precipitation">
            <h1>Qualidade do ar em {city}</h1>
        </Container>
    );
}

export default AirQuality;
