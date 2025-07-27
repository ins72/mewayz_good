#!/bin/bash

# 🛑 MEWAYZ V2 - Production Stop Script
# This script will cleanly stop all production services

echo "🛑 Stopping MEWAYZ V2 Production Environment..."

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

# Stop Docker containers
stop_docker_services() {
    print_status "Stopping Docker services..."
    
    if command -v docker-compose &> /dev/null; then
        docker-compose down
        print_success "Docker services stopped"
    else
        print_warning "Docker Compose not found, skipping Docker services"
    fi
}

# Stop backend process
stop_backend() {
    print_status "Stopping backend process..."
    
    if [ -f backend/.backend.pid ]; then
        BACKEND_PID=$(cat backend/.backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_success "Backend process stopped (PID: $BACKEND_PID)"
        else
            print_warning "Backend process not running"
        fi
        rm -f backend/.backend.pid
    else
        print_warning "No backend PID file found"
    fi
}

# Stop frontend process
stop_frontend() {
    print_status "Stopping frontend process..."
    
    if [ -f frontend/.frontend.pid ]; then
        FRONTEND_PID=$(cat frontend/.frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_success "Frontend process stopped (PID: $FRONTEND_PID)"
        else
            print_warning "Frontend process not running"
        fi
        rm -f frontend/.frontend.pid
    else
        print_warning "No frontend PID file found"
    fi
}

# Kill any remaining Node.js processes
kill_node_processes() {
    print_status "Checking for remaining Node.js processes..."
    
    NODE_PIDS=$(pgrep -f "next\|node" 2>/dev/null || true)
    if [ ! -z "$NODE_PIDS" ]; then
        echo "$NODE_PIDS" | xargs kill -9 2>/dev/null || true
        print_success "Killed remaining Node.js processes"
    else
        print_status "No Node.js processes found"
    fi
}

# Kill any remaining Python processes
kill_python_processes() {
    print_status "Checking for remaining Python processes..."
    
    PYTHON_PIDS=$(pgrep -f "uvicorn\|python.*main" 2>/dev/null || true)
    if [ ! -z "$PYTHON_PIDS" ]; then
        echo "$PYTHON_PIDS" | xargs kill -9 2>/dev/null || true
        print_success "Killed remaining Python processes"
    else
        print_status "No Python processes found"
    fi
}

# Clean up temporary files
cleanup_temp_files() {
    print_status "Cleaning up temporary files..."
    
    # Remove PID files
    rm -f backend/.backend.pid
    rm -f frontend/.frontend.pid
    
    # Remove log files (optional)
    if [ "$1" = "--clean-logs" ]; then
        rm -f backend/*.log
        rm -f frontend/.next/logs/*
        print_success "Log files cleaned"
    fi
    
    print_success "Temporary files cleaned"
}

# Show final status
show_final_status() {
    echo ""
    echo "✅ MEWAYZ V2 Production Environment Stopped"
    echo ""
    echo "📊 Services Status:"
    echo "  • MongoDB: Stopped"
    echo "  • Backend API: Stopped"
    echo "  • Frontend: Stopped"
    echo ""
    echo "💡 To restart services, run:"
    echo "  • ./start-production.sh"
    echo ""
    echo "🔧 To start individual services:"
    echo "  • MongoDB: docker-compose up -d mongodb"
    echo "  • Backend: cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8002"
    echo "  • Frontend: cd frontend && npm run dev"
}

# Main execution
main() {
    print_status "Stopping all MEWAYZ V2 services..."
    
    stop_backend
    stop_frontend
    stop_docker_services
    kill_node_processes
    kill_python_processes
    cleanup_temp_files "$1"
    
    show_final_status
}

# Check for clean logs flag
if [ "$1" = "--clean-logs" ]; then
    print_status "Clean logs mode enabled"
fi

# Run main function
main "$@" 