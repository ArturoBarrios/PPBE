# PeacePad Backend - Local Kubernetes Deployment (Minikube)

## Prerequisites

- Docker installed and running
- Minikube installed and started with Docker driver
- You are in the backend project directory

## Steps

1. Start Minikube with Docker driver

minikube start --driver=docker
kubectl get nodes

2. Point Docker to use Minikube’s Docker daemon

eval $(minikube docker-env)

3. Build the Docker image

docker build -t peacepad-backend:latest .

4. Apply backend deployment and service

kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

5. Restart the deployment (if rebuilding image)

kubectl rollout restart deployment peacepad-backend

6. Access the service locally

minikube service peacepad-backend-service

> if it's working you should be able to navigate and see dashboard at /graphql endpoint(i.e. http://127.0.0.1:64XXX/graphql)

7. To view logs for debugging

kubectl get pods
kubectl logs <your-backend-pod-name>
