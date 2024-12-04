import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './styles.css'; // Certifique-se de que seu CSS esteja importado

function App() {

    const navigate = useNavigate(); 
    const handleSearchCurrentWeather = () => {
        navigate('/current-weather'); }

    const handleSearchPreciptation = () => {
        navigate('/precipitation'); }

    const handleSearchTemperature = () => {
        navigate('/temperature');}
         

    return (
        <>
            {/* Seção Principal */}
            <Container fluid className="main-section">
                {/* Condições Meteorológicas Atuais */}
                <div className="text-with-outline">
                    <h1>
                        Condições meteorológicas atuais em</h1>
                    <Form className="form-vertical">
                        <Form.Control
                            type="search"
                            placeholder="Nome da cidade"
                            aria-label="Search"
                            className="border border-dark shadow-sm"
                        />
                        <Button 
                        variant="light" 
                        className="mt-2"
                        onClick={handleSearchCurrentWeather}
                        >Buscar</Button>
                    </Form>
                </div>

                {/* Previsão de Temperatura */}
                <div className="text-with-outline">
                    <h1>Previsão de temperatura média (5 dias) em</h1>
                    <Form className="form-vertical">
                        <Form.Control
                            type="search"
                            placeholder="Nome da cidade"
                            aria-label="Search"
                            className="border border-dark shadow-sm"
                        />
                        <Button 
                        variant="light" 
                        className="mt-2"
                        onClick={handleSearchTemperature}

                        >Buscar</Button>
                    </Form>
                </div>

                {/* Previsão de Precipitação */}
                <div className="text-with-outline">
                    <h1>Previsão de precipitação média (5 dias) em</h1>
                    <Form className="form-vertical">
                        <Form.Control
                            type="search"
                            placeholder="Nome da cidade"
                            aria-label="Search"
                            className="border border-dark shadow-sm"
                        />
                        
                        <Button 
                        variant="light" 
                        className="mt-2"
                        onClick={handleSearchPreciptation}
                        >Buscar</Button>
                    </Form>
                </div>
            </Container>
        </>
    );
}

export default App;