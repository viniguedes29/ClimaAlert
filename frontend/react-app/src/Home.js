import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './styles.css'; // Certifique-se de que seu CSS esteja importado

function App() {
    return (
        <>
            {/* Seção Principal */}
            <Container fluid className="main-section">
                {/* Condições Meteorológicas Atuais */}
                <div className="form-container">
                    <h1>Condições meteorológicas atuais em</h1>
                    <Form className="form-vertical">
                        <Form.Control
                            type="search"
                            placeholder="Nome da cidade"
                            aria-label="Search"
                        />
                        <Button variant="outline-success" className="mt-2">Buscar</Button>
                    </Form>
                </div>

                {/* Previsão de Temperatura */}
                <div className="form-container">
                    <h1>Previsão de temperatura média (5 dias) em</h1>
                    <Form className="form-vertical">
                        <Form.Control
                            type="search"
                            placeholder="Nome da cidade"
                            aria-label="Search"
                        />
                        <Button variant="outline-success" className="mt-2">Buscar</Button>
                    </Form>
                </div>

                {/* Previsão de Precipitação */}
                <div className="form-container">
                    <h1>Previsão de precipitação média (5 dias) em</h1>
                    <Form className="form-vertical">
                        <Form.Control
                            type="search"
                            placeholder="Nome da cidade"
                            aria-label="Search"
                        />
                        <Button variant="outline-success" className="mt-2">Buscar</Button>
                    </Form>
                </div>
            </Container>
        </>
    );
}

export default App;
