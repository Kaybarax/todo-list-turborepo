#!/bin/bash

# Kubernetes Deployment Script for Todo App
# This script deploys the Todo application to a Kubernetes cluster

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="todo-app"
ENVIRONMENT="${ENVIRONMENT:-production}"
KUBECTL_CONTEXT="${KUBECTL_CONTEXT:-}"
DRY_RUN="${DRY_RUN:-false}"
SKIP_BUILD="${SKIP_BUILD:-false}"

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    # Check if kubectl can connect to cluster
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    # Set kubectl context if provided
    if [ -n "$KUBECTL_CONTEXT" ]; then
        kubectl config use-context "$KUBECTL_CONTEXT"
        print_status "Using kubectl context: $KUBECTL_CONTEXT"
    fi
    
    print_success "Prerequisites check passed"
}

# Function to create namespaces
create_namespaces() {
    print_status "Creating namespaces..."
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f namespaces/
    else
        kubectl apply -f namespaces/
    fi
    
    print_success "Namespaces created"
}

# Function to apply RBAC
apply_rbac() {
    print_status "Applying RBAC configuration..."
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f rbac/
    else
        kubectl apply -f rbac/
    fi
    
    print_success "RBAC configuration applied"
}

# Function to create storage resources
create_storage() {
    print_status "Creating storage resources..."
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f storage/
    else
        kubectl apply -f storage/
    fi
    
    print_success "Storage resources created"
}

# Function to apply secrets and configmaps
apply_configs() {
    print_status "Applying secrets and configmaps..."
    
    # Check if secrets file exists and warn about default values
    if [ -f "secrets/app-secrets.yaml" ]; then
        print_warning "Using default secrets - please update with actual values in production!"
    fi
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f secrets/
        kubectl apply --dry-run=client -f configmaps/
    else
        kubectl apply -f secrets/
        kubectl apply -f configmaps/
    fi
    
    print_success "Secrets and configmaps applied"
}

# Function to deploy databases
deploy_databases() {
    print_status "Deploying databases..."
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f deployments/mongodb.yaml
        kubectl apply --dry-run=client -f deployments/redis.yaml
        kubectl apply --dry-run=client -f services/database-services.yaml
    else
        kubectl apply -f deployments/mongodb.yaml
        kubectl apply -f deployments/redis.yaml
        kubectl apply -f services/database-services.yaml
        
        # Wait for databases to be ready
        print_status "Waiting for MongoDB to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n $NAMESPACE
        
        print_status "Waiting for Redis to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/redis -n $NAMESPACE
    fi
    
    print_success "Databases deployed"
}

# Function to deploy applications
deploy_applications() {
    print_status "Deploying applications..."
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f deployments/api.yaml
        kubectl apply --dry-run=client -f deployments/web.yaml
        kubectl apply --dry-run=client -f deployments/ingestion.yaml
    else
        kubectl apply -f deployments/api.yaml
        kubectl apply -f deployments/web.yaml
        kubectl apply -f deployments/ingestion.yaml
        
        # Wait for applications to be ready
        print_status "Waiting for API to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/todo-api -n $NAMESPACE
        
        print_status "Waiting for Web app to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/todo-web -n $NAMESPACE
        
        print_status "Waiting for Ingestion service to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/todo-ingestion -n $NAMESPACE
    fi
    
    print_success "Applications deployed"
}

# Function to deploy nginx
deploy_nginx() {
    print_status "Deploying NGINX..."
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f deployments/nginx.yaml
    else
        kubectl apply -f deployments/nginx.yaml
        
        # Wait for nginx to be ready
        print_status "Waiting for NGINX to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/nginx -n $NAMESPACE
    fi
    
    print_success "NGINX deployed"
}

# Function to apply ingress
apply_ingress() {
    print_status "Applying ingress configuration..."
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f ingress/
    else
        kubectl apply -f ingress/
    fi
    
    print_success "Ingress configuration applied"
}

# Function to deploy monitoring
deploy_monitoring() {
    print_status "Deploying monitoring stack..."
    
    if [ "$DRY_RUN" = "true" ]; then
        kubectl apply --dry-run=client -f monitoring/
    else
        kubectl apply -f monitoring/
        
        # Wait for monitoring components to be ready
        print_status "Waiting for Prometheus to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n $NAMESPACE
        
        print_status "Waiting for Grafana to be ready..."
        kubectl wait --for=condition=available --timeout=300s deployment/grafana -n $NAMESPACE
    fi
    
    print_success "Monitoring stack deployed"
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check pod status
    echo "Pod Status:"
    kubectl get pods -n $NAMESPACE
    
    # Check service status
    echo -e "\nService Status:"
    kubectl get services -n $NAMESPACE
    
    # Check ingress status
    echo -e "\nIngress Status:"
    kubectl get ingress -n $NAMESPACE
    
    # Check HPA status
    echo -e "\nHPA Status:"
    kubectl get hpa -n $NAMESPACE
    
    # Check for any failed pods
    FAILED_PODS=$(kubectl get pods -n $NAMESPACE --field-selector=status.phase=Failed --no-headers 2>/dev/null | wc -l)
    if [ "$FAILED_PODS" -gt 0 ]; then
        print_warning "Found $FAILED_PODS failed pods"
        kubectl get pods -n $NAMESPACE --field-selector=status.phase=Failed
    fi
    
    print_success "Deployment verification completed"
}

# Function to show access information
show_access_info() {
    print_status "Access Information:"
    
    # Get LoadBalancer IP/hostname
    NGINX_SERVICE=$(kubectl get service nginx-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -z "$NGINX_SERVICE" ]; then
        NGINX_SERVICE=$(kubectl get service nginx-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "pending")
    fi
    
    echo "Web Application: http://$NGINX_SERVICE"
    echo "API: http://$NGINX_SERVICE/api"
    
    # Get Grafana access info
    echo "Grafana: http://$NGINX_SERVICE:3000 (admin/admin123)"
    
    # Port forwarding commands
    echo -e "\nFor local development, you can use port forwarding:"
    echo "kubectl port-forward -n $NAMESPACE service/todo-web-service 3000:3000"
    echo "kubectl port-forward -n $NAMESPACE service/todo-api-service 3001:3001"
    echo "kubectl port-forward -n $NAMESPACE service/grafana-service 3000:3000"
}

# Function to cleanup deployment
cleanup() {
    print_status "Cleaning up deployment..."
    
    read -p "Are you sure you want to delete all resources? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kubectl delete namespace $NAMESPACE --ignore-not-found=true
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  deploy     Deploy the entire application (default)"
    echo "  cleanup    Remove all deployed resources"
    echo "  verify     Verify the current deployment"
    echo "  help       Show this help message"
    echo ""
    echo "Options:"
    echo "  --dry-run          Show what would be deployed without actually deploying"
    echo "  --skip-build       Skip building Docker images"
    echo "  --environment      Set environment (default: production)"
    echo "  --context          Set kubectl context"
    echo ""
    echo "Environment Variables:"
    echo "  ENVIRONMENT        Deployment environment (production, staging, development)"
    echo "  KUBECTL_CONTEXT    Kubernetes context to use"
    echo "  DRY_RUN           Set to 'true' for dry run"
    echo "  SKIP_BUILD        Set to 'true' to skip building images"
}

# Main deployment function
main_deploy() {
    print_status "Starting Todo App deployment to Kubernetes..."
    print_status "Environment: $ENVIRONMENT"
    print_status "Namespace: $NAMESPACE"
    
    if [ "$DRY_RUN" = "true" ]; then
        print_warning "DRY RUN MODE - No actual changes will be made"
    fi
    
    check_prerequisites
    create_namespaces
    apply_rbac
    create_storage
    apply_configs
    deploy_databases
    deploy_applications
    deploy_nginx
    apply_ingress
    deploy_monitoring
    verify_deployment
    show_access_info
    
    print_success "Todo App deployment completed successfully!"
}

# Parse command line arguments
COMMAND="deploy"
while [[ $# -gt 0 ]]; do
    case $1 in
        deploy|cleanup|verify|help)
            COMMAND="$1"
            shift
            ;;
        --dry-run)
            DRY_RUN="true"
            shift
            ;;
        --skip-build)
            SKIP_BUILD="true"
            shift
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --context)
            KUBECTL_CONTEXT="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Execute command
case $COMMAND in
    deploy)
        main_deploy
        ;;
    cleanup)
        cleanup
        ;;
    verify)
        check_prerequisites
        verify_deployment
        show_access_info
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac