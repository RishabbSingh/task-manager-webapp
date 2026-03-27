# 🚀 TaskFlow — Production-Grade Task Management App

A production-ready full-stack Task Manager application demonstrating a complete DevOps pipeline from code to deployment. Built with React and Node.js, containerized with Docker, automatically deployed via GitHub Actions, provisioned on AWS using modular Terraform, and monitored with Prometheus and Grafana.

---

## Live URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Application | http://3.85.229.230 | create a new one. |
| Grafana | http://3.85.229.230:3000 | admin / admin123 | 1. Go to bookmark 2. Under bookmark select dashboard 3. Click Nodejs Exporter
| Prometheus | http://3.85.229.230:9090 | — |
| API Health | http://3.85.229.230:5000/api/health | — |

For Grafana Live - 1. Go to bookmark 2. Under bookmark select dashboard 3. Click Nodejs Exporter
---

## Pipeline Overview

```
git push → Test → Build Docker → Push to Hub → Deploy to EC2 → Monitor
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Nginx (Docker) |
| Backend | Node.js + Express (Docker) |
| Database | MongoDB Atlas |
| CI/CD | GitHub Actions |
| IaC | Terraform (modular) |
| Monitoring | Prometheus + Grafana |
| Cloud | AWS EC2 |

---

## 1. CI/CD — GitHub Actions

Three jobs run on every push to `main`:

```
Test  →  Build & Push to Docker Hub  →  SSH Deploy to EC2
```

File: `.github/workflows/deploy.yml`

GitHub Secrets required:
```
DOCKER_USERNAME / DOCKER_PASSWORD → Docker Hub
SERVER_IP / SERVER_SSH_KEY        → EC2 access
```

---

## 2. Docker

```bash
docker-compose up -d --build
```

- Backend: `node:18-alpine` — production deps only
- Frontend: Multi-stage build → served via Nginx
- Nginx proxies `/api` requests to backend

---

## 3. Terraform — Modular IaC

```
modules/
├── vpc/             → VPC, Subnet, IGW, Route Table
├── security_group/  → Reusable firewall rules
├── compute/         → EC2 t2.micro
└── storage/         → Encrypted S3 bucket
```

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform plan && terraform apply
```

---

## 4. Monitoring

Three targets monitored: Backend app, Node Exporter, Prometheus itself.

Metrics collected: HTTP requests, CPU, RAM, Disk, event loop lag.

---

## Quick Start

```bash
git clone https://github.com/RishabbSingh/task-manager-webapp.git
cd task-manager-webapp
cp backend/.env.example backend/.env  # add MongoDB URI
docker-compose up -d --build
```

---

**Author:** Rishabh Singh — https://github.com/RishabbSingh

- Error handling middleware
