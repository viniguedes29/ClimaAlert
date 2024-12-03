import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles.css';

function CurrentWeather() {
    return (
        <Container className="current-weather">
            <h1>Condições meteorológicas atuais em &lt;city_name&gt;</h1>
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
                            <p><strong>Descrição:</strong> Nuvens dispersas. Aproveite o clima agradável!</p>
                            <p><strong>Temperatura:</strong> 25,74°C</p>
                            <p><strong>Sensação Térmica:</strong> 26,38°C</p>
                            <p><strong>Umidade:</strong> 77%</p>
                            <p><strong>Nuvens:</strong> 41%</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CurrentWeather;
