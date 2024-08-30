# ClimaAlert

## Visão Geral

**ClimaAlert** é uma plataforma dedicada a fornecer informações em tempo real sobre o índice UV e alertas relacionados a riscos climáticos, como queimadas, deslizamentos e inundações. Utilizando mapas interativos e APIs climáticas, o objetivo é auxiliar os usuários na prevenção de riscos e na tomada de decisões seguras.

## Funcionalidades Principais

- **Monitoramento do Índice UV:** Exibição do índice UV atual, com alertas sobre a necessidade de proteção.
- **Alertas de Desastres Naturais:** Notificações sobre riscos de queimadas, deslizamentos e inundações, utilizando dados de APIs climáticas.
- **Mapas Interativos:** Visualização geográfica dos índices UV e áreas de risco através de mapas interativos.
- **Integração com APIs:** Conexão com APIs como OpenUV, OpenWeatherMap, e NASA FIRMS para obter dados em tempo real.

## Tecnologias Utilizadas (a definir)

- **Frontend:** 
- **Backend:** 
- **Banco de Dados:** 
- **APIs Externas:** OpenUV, OpenWeatherMap, NASA FIRMS
- **Metodologia de Desenvolvimento:** Kanban
- **Integração Contínua:** GitHub Actions
- **Deploy:** 

## Estrutura do Projeto (a definir)

```bash
ClimaAlert/
│
├── public/                 # Arquivos públicos do projeto (HTML, imagens, etc.)
├── src/                    # Código fonte do frontend
│   ├── components/         # Componentes 
│   ├── pages/              # Páginas principais da aplicação
│   ├── services/           # Integrações com APIs externas
│   └── styles/             # Arquivos de estilo 
│
├── backend/                # Código fonte do backend
│   ├── controllers/        # Lógica de controle das rotas
│   ├── models/             # Modelos de dados 
│   ├── routes/             # Definição das rotas da API
│   └── utils/              # Funções utilitárias
│
├── tests/                  # Testes automatizados (unitários e integração)
├── .github/                # Configurações de CI/CD
├── docs/                   # Documentação do projeto
└── README.md               # Documentação principal
