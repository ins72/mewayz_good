#!/bin/bash

# 🚀 MEWAYZ V2 - Production Quick Start Script
# This script will set up and start the complete production environment

set -e  # Exit on any error

echo "🚀 Starting MEWAYZ V2 Production Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Frontend will be run via Docker."
    else
        print_success "Node.js is installed"
    fi
}

# Check if Python is installed
check_python() {
    if ! command -v python &> /dev/null; then
        print_warning "Python is not installed. Backend will be run via Docker."
    else
        print_success "Python is installed"
    fi
}

# Start MongoDB with Docker
start_mongodb() {
    print_status "Starting MongoDB..."
    
    # Stop existing containers if running
    docker-compose down mongodb mongo-express 2>/dev/null || true
    
    # Start MongoDB
    docker-compose up -d mongodb mongo-express
    
    # Wait for MongoDB to be ready
    print_status "Waiting for MongoDB to be ready..."
    sleep 10
    
    # Test MongoDB connection
    if docker-compose exec mongodb mongosh --eval "db.runCommand('ping')" >/dev/null 2>&1; then
        print_success "MongoDB is running and accessible"
        print_status "MongoDB Express UI available at: http://localhost:8081"
        print_status "  Username: admin"
        print_status "  Password: password123"
    else
        print_error "MongoDB failed to start properly"
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install Python dependencies
    if command -v pip &> /dev/null; then
        print_status "Installing Python dependencies..."
        pip install -r requirements.txt
    fi
    
    # Run production setup
    print_status "Running production setup..."
    python scripts/setup_production.py
    
    cd ..
}

# Start backend
start_backend() {
    print_status "Starting backend API..."
    
    cd backend
    
    # Start backend server
    if command -v python &> /dev/null; then
        print_status "Starting backend with Python..."
        python -m uvicorn main:app --host 0.0.0.0 --port 8002 --reload &
        BACKEND_PID=$!
        echo $BACKEND_PID > .backend.pid
    else
        print_status "Starting backend with Docker..."
        docker-compose up -d backend
    fi
    
    cd ..
    
    # Wait for backend to be ready
    print_status "Waiting for backend to be ready..."
    sleep 5
    
    # Test backend health
    if curl -s http://localhost:8002/api/health >/dev/null; then
        print_success "Backend API is running at: http://localhost:8002"
        print_status "API Documentation available at: http://localhost:8002/api/docs"
    else
        print_warning "Backend health check failed, but continuing..."
    fi
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Create environment file if it doesn't exist
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local file..."
        cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8002/api/v1
NEXT_PUBLIC_ENVIRONMENT=production
EOF
    fi
    
    # Install Node.js dependencies
    if command -v npm &> /dev/null; then
        print_status "Installing Node.js dependencies..."
        npm install
    fi
    
    cd ..
}

# Start frontend
start_frontend() {
    print_status "Starting frontend..."
    
    cd frontend
    
    # Start frontend server
    if command -v npm &> /dev/null; then
        print_status "Starting frontend with npm..."
        npm run dev &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > .frontend.pid
    else
        print_status "Starting frontend with Docker..."
        docker-compose up -d frontend
    fi
    
    cd ..
    
    # Wait for frontend to be ready
    print_status "Waiting for frontend to be ready..."
    sleep 10
    
    print_success "Frontend is running at: http://localhost:3000"
}

# Show status
show_status() {
    echo ""
    echo "🎉 MEWAYZ V2 Production Environment is Ready!"
    echo ""
    echo "📊 Services Status:"
    echo "  • MongoDB: http://localhost:27017"
    echo "  • MongoDB Express UI: http://localhost:8081"
    echo "  • Backend API: http://localhost:8002"
    echo "  • Frontend: http://localhost:3000"
    echo "  • API Docs: http://localhost:8002/api/docs"
    echo ""
    echo "🔑 Default Admin Credentials:"
    echo "  • Email: admin@mewayz.com"
    echo "  • Password: admin123"
    echo ""
    echo "📝 Useful Commands:"
    echo "  • View logs: docker-compose logs -f"
    echo "  • Stop services: ./stop-production.sh"
    echo "  • Restart services: ./restart-production.sh"
    echo ""
    echo "🚀 Happy coding!"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    
    # Kill background processes
    if [ -f backend/.backend.pid ]; then
        kill $(cat backend/.backend.pid) 2>/dev/null || true
        rm backend/.backend.pid
    fi
    
    if [ -f frontend/.frontend.pid ]; then
        kill $(cat frontend/.frontend.pid) 2>/dev/null || true
        rm frontend/.frontend.pid
    fi
}

# Trap cleanup on script exit
trap cleanup EXIT

# Main execution
main() {
    print_status "Checking prerequisites..."
    check_docker
    check_node
    check_python
    
    print_status "Starting MongoDB..."
    start_mongodb
    
    print_status "Setting up backend..."
    setup_backend
    
    print_status "Starting backend..."
    start_backend
    
    print_status "Setting up frontend..."
    setup_frontend
    
    print_status "Starting frontend..."
    start_frontend
    
    show_status
}

# Run main function
main "$@" 