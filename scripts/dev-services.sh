#!/bin/bash

# Service-specific development script
# Allows running individual services or custom combinations

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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

# Configuration
SERVICE="${SERVICE:-api}"
WITH_DEPS="${WITH_DEPS:-true}"
WATCH="${WATCH:-true}"

# Function to show help
show_help() {
    echo "Usage: $0 [SERVICE] [OPTIONS]"
    echo ""
    echo "Start specific Todo App services for development"
    echo ""
    echo "Services:"
    echo "  api                 NestJS API server"
    echo "  web                 Next.js web application"
    echo "  mobile              React Native/Expo mobile app"
    echo "  ingestion           Background ingestion service"
    echo "  contracts           Blockchain contract development"
    echo "  storybook-web       Web component Storybook"
    echo "  storybook-mobile    Mobile component Storybook"
    echo ""
    echo "Options:"
    echo "  --no-deps           Skip starting dependencies"
    echo "  --no-watch          Disable watch mode"
    echo "  --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 api                      # Start API with dependencies"
    echo "  $0 web --no-deps            # Start web app without dependencies"
    echo "  $0 mobile --no-watch        # Start mobile app without watch mode"
}

# Function to start dependencies
start_dependencies() {
    if [ "$WITH_DEPS" = "false" ]; then
        print_warning "Skipping dependencies"
        return
    fi
    
    print_status "Starting service dependencies..."
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    
    case $SERVICE in
        api|ingestion)
            # API and ingestion need databases
            print_status "Starting database services..."
            docker-compose -f docker-compose.dev.yml up -d mongodb redis
            
            # Wait for databases
            print_status "Waiting for databases to be ready..."
            local max_attempts=30
            local attempt=1
            
            while [ $attempt -le $max_attempts ]; do
                if docker-compose -f docker-compose.dev.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" &>/dev/null; then
                    break
                fi
                
                if [ $attempt -eq $max_attempts ]; then
                    print_error "MongoDB failed to start"
                    exit 1
                fi
                
                sleep 2
                ((attempt++))
            done
            
            # Setup database
            print_status "Setting up database..."
            pnpm db:setup || print_warning "Database setup failed"
            ;;
            
        web|mobile)
            # Frontend apps need API
            if ! nc -z localhost 3001 2>/dev/null; then
                print_status "Starting API server as dependency..."
                start_dependencies_for_service "api"
                pnpm dev:api &
                API_DEP_PID=$!
                
                # Wait for API
                local max_attempts=30
                local attempt=1
                
                while [ $attempt -le $max_attempts ]; do
                    if nc -z localhost 3001 2>/dev/null; then
                        print_success "API dependency is ready"
                        break
                    fi
                    
                    if [ $attempt -eq $max_attempts ]; then
                        print_warning "API dependency may not be ready"
                        break
                    fi
                    
                    sleep 2
                    ((attempt++))
                done
            fi
            ;;
            
        contracts)
            # Contracts might need specific blockchain tools
            print_status "Blockchain development dependencies are managed by dev-blockchain.sh"
            ;;
    esac
    
    print_success "Dependencies started"
}

# Function to start specific service
start_service() {
    print_status "Starting $SERVICE service..."
    
    case $SERVICE in
        api)
            print_status "Starting NestJS API server..."
            if [ "$WATCH" = "true" ]; then
                pnpm dev:api
            else
                cd apps/api
                pnpm start:dev
                cd ../..
            fi
            ;;
            
        web)
            print_status "Starting Next.js web application..."
            if [ "$WATCH" = "true" ]; then
                pnpm dev:web
            else
                cd apps/web
                pnpm dev
                cd ../..
            fi
            ;;
            
        mobile)
            print_status "Starting React Native/Expo mobile app..."
            if [ "$WATCH" = "true" ]; then
                pnpm dev:mobile
            else
                cd apps/mobile
                pnpm start
                cd ../..
            fi
            ;;
            
        ingestion)
            print_status "Starting ingestion service..."
            if [ "$WATCH" = "true" ]; then
                pnpm dev:ingestion
            else
                cd apps/ingestion
                pnpm start:dev
                cd ../..
            fi
            ;;
            
        contracts)
            print_status "Starting blockchain contract development..."
            ./scripts/dev-blockchain.sh
            ;;
            
        storybook-web)
            print_status "Starting web component Storybook..."
            cd packages/ui-web
            pnpm storybook
            cd ../..
            ;;
            
        storybook-mobile)
            print_status "Starting mobile component Storybook..."
            cd packages/ui-mobile
            pnpm storybook
            cd ../..
            ;;
            
        *)
            print_error "Unknown service: $SERVICE"
            show_help
            exit 1
            ;;
    esac
}

# Function to show service information
show_service_info() {
    print_success "$SERVICE service is ready!"
    echo ""
    
    case $SERVICE in
        api)
            echo "🔧 API Service:"
            echo "  Server:           http://localhost:3001"
            echo "  Documentation:    http://localhost:3001/api"
            echo "  Health Check:     curl http://localhost:3001/health"
            echo "  Metrics:          curl http://localhost:3001/metrics"
            ;;
            
        web)
            echo "🌐 Web Application:"
            echo "  Application:      http://localhost:3000"
            echo "  Health Check:     curl http://localhost:3000/api/health"
            ;;
            
        mobile)
            echo "📱 Mobile Application:"
            echo "  Expo DevTools:    http://localhost:19000"
            echo "  Metro Bundler:    http://localhost:8081"
            echo "  QR Code:          Scan with Expo Go app"
            ;;
            
        ingestion)
            echo "⚙️  Ingestion Service:"
            echo "  Service:          Background process"
            echo "  Logs:             Check console output"
            ;;
            
        contracts)
            echo "⛓️  Blockchain Development:"
            echo "  See blockchain development output above"
            ;;
            
        storybook-web)
            echo "📚 Web Storybook:"
            echo "  Storybook:        http://localhost:6006"
            ;;
            
        storybook-mobile)
            echo "📚 Mobile Storybook:"
            echo "  Storybook:        http://localhost:6007"
            ;;
    esac
    
    echo ""
    echo "Press Ctrl+C to stop the service"
}

# Function to handle shutdown
shutdown_handler() {
    print_status "Shutting down $SERVICE service..."
    
    # Stop dependency processes if we started them
    if [ -n "$API_DEP_PID" ]; then
        kill $API_DEP_PID 2>/dev/null || true
    fi
    
    # Stop Docker services if we started them
    if [ "$WITH_DEPS" = "true" ]; then
        case $SERVICE in
            api|ingestion)
                print_status "Stopping database services..."
                docker-compose -f docker-compose.dev.yml stop mongodb redis
                ;;
        esac
    fi
    
    print_success "$SERVICE service stopped"
    exit 0
}

# Main function
main() {
    # Parse arguments
    if [ $# -gt 0 ] && [[ ! "$1" =~ ^-- ]]; then
        SERVICE="$1"
        shift
    fi
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --no-deps)
                WITH_DEPS="false"
                shift
                ;;
            --no-watch)
                WATCH="false"
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_status "Starting $SERVICE service development..."
    
    # Setup shutdown handler
    trap shutdown_handler SIGINT SIGTERM
    
    # Start dependencies
    start_dependencies
    
    # Show service info
    show_service_info
    
    # Start the service
    start_service
}

# Run main function
main "$@"