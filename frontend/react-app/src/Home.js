import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './styles.css'; // Certifique-se de que seu CSS esteja importado

function App() {
    const [selectedOption, setSelectedOption] = useState('current-weather'); // Estado inicial selecionado
    const [city, setCity] = useState(''); // Estado para o nome da cidade
    const navigate = useNavigate(); // Hook para navegação

    const handleSelection = (option) => {
        setSelectedOption(option);
    };

    const handleSearch = () => {
        if (!city) {
            alert('Por favor, insira o nome da cidade antes de buscar.');
            return;
        }

        // Navega para a rota com base na opção selecionada e adiciona a query string
        navigate(`/${selectedOption}?city=${encodeURIComponent(city)}`);
    };

    return (
        <>
            {/* Seção Principal */}
            <Container fluid className="main-section background-image">
                {/* Condições Meteorológicas Atuais */}
                <div className="text-with-outline flex">
                    <h1>Busca a sua cidade</h1>
                    
                    {/* Formulário de Busca */}
                    <Form className="form-vertical mt-4">
                        <Form.Control
                            type="search"
                            placeholder="Nome da cidade"
                            aria-label="Search"
                            className="border border-dark shadow-sm"
                            value={city} // Ligado ao estado city
                            onChange={(e) => setCity(e.target.value)} // Atualiza o estado city
                        />

                        {/* Menu de Seleção */}
                        <div className="selection-menu mt-3 d-flex justify-content-center">
                            <Button
                                variant={selectedOption === 'current-weather' ? 'primary' : 'outline-light'}
                                className="menu-box mx-2"
                                onClick={() => handleSelection('current-weather')} // Apenas atualiza o estado
                            >
                                Tempo Atual
                            </Button>

                            <Button
                                variant={selectedOption === 'temperature' ? 'primary' : 'outline-light'}
                                className="menu-box mx-2"
                                onClick={() => handleSelection('temperature')} // Apenas atualiza o estado
                            >
                                Temperatura
                            </Button>
                            <Button
                                variant={selectedOption === 'precipitation' ? 'primary' : 'outline-light'}
                                className="menu-box mx-2"
                                onClick={() => handleSelection('precipitation')} // Apenas atualiza o estado
                            >
                                Precipitação
                            </Button>
                            <Button
                                variant={selectedOption === 'air-quality' ? 'primary' : 'outline-light'}
                                className="menu-box mx-2"
                                onClick={() => handleSelection('air-quality')} // Apenas atualiza o estado
                            >
                                Qualidade do Ar
                            </Button>
                        </div>

                        <Button 
                            variant="light" 
                            className="mt-2" // Reduzido para manter o botão próximo às opções
                            onClick={handleSearch} // Chama o handleSearch
                        >
                            Buscar
                        </Button>
                    </Form>
                </div>
            </Container>
        </>
    );
}

export default App;
