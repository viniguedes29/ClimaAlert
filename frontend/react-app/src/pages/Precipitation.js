import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles.css';

function Precipitation() {
    return (
        <Container className="precipitation">
            <h1>Previsão de Precipitação (5 dias) para &lt;city_name&gt;</h1>
        </Container>
    );
}

export default Precipitation;
