# Kubernetes Deployment for Todo App

This directory contains Kubernetes manifests for deploying the modernized Todo application to a Kubernetes cluster.

## Directory Structure

```
infra/k8s/
├── namespaces/           # Namespace definitions
├── rbac/                 # RBAC configuration
├── secrets/              # Secret definitions (update with real values)
├── configmaps/           # Configuration maps
├── storage/              # Persistent volumes and claims
├── deployments/          # Application deployments
├── services/             # Service definitions
├── ingress/              # Ingress configuration
├── monitoring/           # Prometheus, Grafana, and exporters
├── deploy.sh             # Deployment script
├── resource-management.yaml  # Resource quotas and limits
└── README.md             # This file
```

## Prerequisites

1. **Kubernetes Cluster**: A running Kubernetes cluster (v1.20+)
2. **kubectl**: Kubernetes CLI tool configured to access your cluster
3. **NGINX Ingress Controller**: For ingress functionality
4. **cert-manager** (optional): For automatic TLS certificate management
5. **Prometheus Operator** (optional): For enhanced monitoring

## Quick Start

### 1. Update Configuration

Before deploying, update the following files with your actual values:

**Secrets (`secrets/app-secrets.yaml`)**:
```bash
# Generate base64 encoded values
echo -n "your-actual-jwt-secret" | base64
echo -n "your-mongodb-password" | base64
```

**ConfigMaps (`configmaps/app-config.yaml`)**:
- Update domain names
- Configure RPC URLs
- Set environment-specific values

### 2. Deploy the Application

```bash
# Make the deployment script executable
chmod +x deploy.sh

# Deploy to production
./deploy.sh deploy

# Deploy with dry-run to see what would be created
./deploy.sh deploy --dry-run

# Deploy to staging environment
./deploy.sh deploy --environment staging
```

### 3. Verify Deployment

```bash
# Check deployment status
./deploy.sh verify

# Or manually check
kubectl get pods -n todo-app
kubectl get services -n todo-app
kubectl get ingress -n todo-app
```

## Configuration

### Environment Variables

Set these environment variables before deployment:

```bash
export ENVIRONMENT=production        # production, staging, development
export KUBECTL_CONTEXT=my-cluster   # Kubernetes context to use
export DRY_RUN=false                # Set to true for dry run
```

### Customization

#### Resource Limits

Edit `resource-management.yaml` to adjust:
- CPU and memory limits
- Storage quotas
- Pod disruption budgets

#### Scaling

Horizontal Pod Autoscaler (HPA) is configured for:
- API: 3-10 replicas
- Web: 2-8 replicas
- Ingestion: 2-6 replicas
- NGINX: 2-6 replicas

#### Storage

- **Local Development**: Uses `hostPath` volumes
- **Cloud Deployment**: Uses dynamic provisioning with SSD storage class

## Components

### Core Applications

1. **MongoDB**: Database with persistent storage
2. **Redis**: Caching and session storage
3. **Todo API**: REST API service with auto-scaling
4. **Todo Web**: Next.js web application
5. **Ingestion Service**: Blockchain data ingestion
6. **NGINX**: Reverse proxy and load balancer

### Monitoring Stack

1. **Prometheus**: Metrics collection
2. **Grafana**: Metrics visualization
3. **Exporters**: MongoDB, Redis, and NGINX metrics

### Security

1. **RBAC**: Role-based access control
2. **Network Policies**: Pod-to-pod communication rules
3. **Pod Security Standards**: Security constraints
4. **Secrets Management**: Encrypted secret storage

## Networking

### Ingress Configuration

- **Production**: `todo-app.example.com` and `api.todo-app.example.com`
- **Development**: `dev.todo-app.example.com`

### Internal Services

- MongoDB: `mongodb-service:27017`
- Redis: `redis-service:6379`
- API: `todo-api-service:3001`
- Web: `todo-web-service:3000`

## Monitoring and Observability

### Metrics

Access Grafana dashboard:
```bash
kubectl port-forward -n todo-app service/grafana-service 3000:3000
# Open http://localhost:3000 (admin/admin123)
```

### Logs

View application logs:
```bash
# API logs
kubectl logs -f deployment/todo-api -n todo-app

# Web application logs
kubectl logs -f deployment/todo-web -n todo-app

# Database logs
kubectl logs -f deployment/mongodb -n todo-app
```

### Health Checks

All services include health check endpoints:
- API: `/health`
- Web: `/api/health`
- Databases: Built-in health checks

## Troubleshooting

### Common Issues

1. **Pods stuck in Pending**:
   ```bash
   kubectl describe pod <pod-name> -n todo-app
   # Check resource constraints and node capacity
   ```

2. **Database connection issues**:
   ```bash
   # Check database pod logs
   kubectl logs deployment/mongodb -n todo-app
   
   # Test connectivity from API pod
   kubectl exec -it deployment/todo-api -n todo-app -- nc -zv mongodb-service 27017
   ```

3. **Ingress not working**:
   ```bash
   # Check ingress controller
   kubectl get pods -n ingress-nginx
   
   # Check ingress configuration
   kubectl describe ingress todo-app-ingress -n todo-app
   ```

### Debug Commands

```bash
# Get all resources
kubectl get all -n todo-app

# Check events
kubectl get events -n todo-app --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods -n todo-app
kubectl top nodes

# Check HPA status
kubectl get hpa -n todo-app
```

## Scaling

### Manual Scaling

```bash
# Scale API replicas
kubectl scale deployment todo-api --replicas=5 -n todo-app

# Scale web replicas
kubectl scale deployment todo-web --replicas=3 -n todo-app
```

### Auto Scaling

HPA automatically scales based on:
- CPU utilization (70% threshold)
- Memory utilization (80% threshold)

VPA (if enabled) automatically adjusts resource requests.

## Backup and Recovery

### Database Backup

```bash
# Create MongoDB backup
kubectl exec deployment/mongodb -n todo-app -- mongodump --out /tmp/backup

# Copy backup from pod
kubectl cp todo-app/mongodb-pod:/tmp/backup ./mongodb-backup
```

### Configuration Backup

```bash
# Backup all configurations
kubectl get all,configmap,secret,pvc -n todo-app -o yaml > todo-app-backup.yaml
```

## Cleanup

```bash
# Remove all resources
./deploy.sh cleanup

# Or manually delete namespace
kubectl delete namespace todo-app
```

## Production Considerations

1. **Secrets Management**: Use external secret management (e.g., HashiCorp Vault)
2. **TLS Certificates**: Configure cert-manager for automatic certificate renewal
3. **Backup Strategy**: Implement automated database backups
4. **Monitoring**: Set up alerting rules in Prometheus
5. **Security**: Regular security scans and updates
6. **Resource Planning**: Monitor resource usage and plan capacity
7. **Disaster Recovery**: Multi-region deployment for high availability

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Kubernetes events and logs
3. Consult the application documentation
4. Contact the development team