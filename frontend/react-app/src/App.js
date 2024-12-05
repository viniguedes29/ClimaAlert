import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import CurrentWeather from './pages/CurrentWeather';
import Precipitation from './pages/Precipitation';
import Temperature from './pages/Temperature';
import Home from './Home';
import AirQuality from './pages/AirQuality';

function App() {
    return (
        <Router>
            {/* Navbar para todas as páginas */}
            <Navbar style={{ backgroundColor: '#2ba097', height: '60px',}}>
                <Container>
                    <Navbar.Brand href="/">
                        <img
                            alt="ClimaAlert Logo"
                            src="/img/climaalert_logo.png"
                            width="150"
                            height="50"
                            className="d-inline-block align-top"
                            style={{ marginRight: '10px' }}
                        />
                    </Navbar.Brand>
                </Container>
            </Navbar>

            {/* Rotas da Aplicação */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/current-weather" element={<CurrentWeather />} />
                <Route path="/precipitation" element={<Precipitation />} />
                <Route path="/temperature" element={<Temperature />} />
                <Route path="/air-quality" element={<AirQuality />} />
            </Routes>
        </Router>
    );
}

export default App;
