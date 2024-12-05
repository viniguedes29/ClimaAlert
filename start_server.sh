#!/bin/bash

# Verifica se o argumento <API_KEY> foi fornecido
if [ -z "$1" ]; then
  echo "Uso: ./start_server.sh <API_KEY>"
  exit 1
fi

# Configura a variável de ambiente OPEN_WEATHER_API_KEY
export OPEN_WEATHER_API_KEY=$1
echo "OPEN_WEATHER_API_KEY configurado."

# Define a porta fixa para o backend
export CLIMAALERT_APP_PORT=3333
echo "CLIMAALERT_APP_PORT definido como 3333."

# Inicia o Backend
echo "Iniciando o Backend..."
cd backend/ || { echo "Erro: Não foi possível acessar o diretório 'backend/'."; exit 1; }
npm install
npm run migrate
npm run dev &
BACKEND_PID=$!
echo "Backend iniciado (PID: $BACKEND_PID)."

# Configura e inicia o Frontend
echo "Configurando o Frontend..."
cd ../frontend/react-app/ || { echo "Erro: Não foi possível acessar o diretório 'frontend/react-app/'."; exit 1; }
export REACT_APP_BACKEND=http://localhost:$CLIMAALERT_APP_PORT
npm install
npm start &
FRONTEND_PID=$!
echo "Frontend iniciado (PID: $FRONTEND_PID)."

# Aguardar saída do usuário para encerrar
trap "echo 'Encerrando processos...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

echo "Ambiente iniciado. Pressione Ctrl+C para encerrar."
wait
