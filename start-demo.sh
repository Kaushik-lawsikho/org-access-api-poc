#!/bin/bash

echo "Starting Organization Access API Demo..."
echo

echo "Starting Backend Server..."
cd "$(dirname "$0")"
npm run dev &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!

echo
echo "Demo is starting up..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo "Note: Frontend runs on port 3001 to avoid conflict with backend"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user to stop
wait
