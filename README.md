# ☁️ Health Tracking - Cloud Native Infrastructure & CI/CD

Repo này chứa mã nguồn và cấu hình DevOps vận hành hệ thống Microservices Health Tracking. Hệ thống sử dụng kiến trúc **Multi-Cloud Hybrid** với sự kết hợp giữa Azure, AWS (cho CI/CD) và các Managed Services chuyên dụng.

---

## 🏗 Kiến trúc Hệ thống (Infrastructure Architecture)

Hệ thống được triển khai theo mô hình Container Orchestration, tách biệt giữa môi trường Build (AWS) và môi trường Run (Azure).


| Thành phần | Công nghệ / Dịch vụ | Mô tả |
|:----------:|:------------------:|------|
| **Orchestrator** | **Azure AKS (Kubernetes)** | Nơi chạy toàn bộ Backend API và Frontend. |
| **CI/CD Server** | **Jenkins on AWS EC2** | Server tự host để build Docker Image và thực hiện lệnh deploy. |
| **Registry** | **Azure ACR** | Lưu trữ Docker Images (`acrhealth.azurecr.io`). |
| **Database** | **MongoDB Atlas** | Database dạng Cloud Service (Managed). |
| **Message Broker** | **CloudAMQP (RabbitMQ)** | Xử lý hàng đợi bất đồng bộ giữa các microservices. |
| **Monitoring** | **Grafana Cloud** | Giám sát Metrics, Logs và Tracing tập trung. |

---

## 🔄 Quy trình CI/CD (Jenkins Pipeline)

Mọi thay đổi code trên nhánh `cicd` sẽ tự động kích hoạt Pipeline trên Jenkins Server (EC2).

### 1. Luồng xử lý (Workflow Logic)
Pipeline (`Jenkinsfile`) được thiết kế để xử lý linh động nhiều services:

1.  **Checkout Code:** Lấy source code mới nhất.
2.  **ACR Login:** Đăng nhập vào Azure Container Registry.
3.  **Build & Push Client:** Build React App (Frontend) với biến `VITE_API_URL` được inject từ Jenkins Credential.
4.  **Build & Push Backend:**
    * Tự động phát hiện và build Root Services (VD: `api-gateway`).
    * Tự động duyệt thư mục `services/` để build các Sub-services (`user`, `activity`, `health-metrics`, `progress`).
    * **Versioning:** Image được gắn tag theo build number: `v${BUILD_NUMBER}`.
5.  **Deploy to AKS:**
    * Sử dụng `envsubst` để thay thế biến `${TAG}` trong các file Kubernetes Manifest (`infrastructure/k8s/*.yaml`).
    * Apply cấu hình mới vào namespace `health-tracking`.
6.  **Zero Downtime:** Thực hiện `kubectl rollout restart` để cập nhật ứng dụng mà không gây gián đoạn dịch vụ.

### 2. Yêu cầu cấu hình Jenkins Agent (EC2)
Để Pipeline chạy thành công, Server EC2 cần được cài đặt:
* **Docker:** Để build image.
* **Kubectl:** Đã cấu hình để kết nối tới Azure AKS.
* **Gettext-base:** Cung cấp lệnh `envsubst` (Quan trọng).
    ```bash
    sudo apt-get update && sudo apt-get install -y gettext-base
    ```

### 3. Jenkins Credentials Setup
Các biến bảo mật cần được cấu hình trong Jenkins Store:

* `ACR-HT`: Username/Password của Azure Container Registry.
* `K8S`: File `kubeconfig` (Secret File) để xác thực với Azure AKS.
* `CLIENT_API_URL`: URL public của API Gateway (dùng cho Frontend).

---

## ⚙️ Quản lý Cấu hình & Secrets (Configuration)

Vì sử dụng các dịch vụ Cloud bên thứ 3 (MongoDB, RabbitMQ, Grafana), thông tin kết nối **KHÔNG** được lưu trong mã nguồn này. Chúng được quản lý qua **Kubernetes Secrets**.

### Cách Inject biến môi trường vào AKS:
Trong các file Deployment (`infrastructure/k8s/*.yaml`), các service đọc cấu hình như sau:

```yaml
env:
  - name: MONGO_URI
    valueFrom:
      secretKeyRef:
        name: backend-secrets
        key: mongo-uri
  - name: RABBITMQ_URI
    valueFrom:
      secretKeyRef:
        name: backend-secrets
        key: rabbitmq-uri
```
### Tạo Secret trên Cluster (Thực hiện thủ công 1 lần):
```
kubectl create secret generic backend-secrets \
  --namespace health-tracking \
  --from-literal=mongo-uri='mongodb+srv://<user>:<pass>@cluster.mongodb.net/...' \
  --from-literal=rabbitmq-uri='amqps://<user>:<pass>@[moose.rmq.cloudamqp.com/](https://moose.rmq.cloudamqp.com/)...'
```
## 📊 Giám sát (Observability)

### Không SSH vào container để xem log. Hệ thống sử dụng Grafana Cloud để giám sát.

### Logs: Promtail/Grafana Agent đẩy log từ stdout của Pod lên Grafana Loki.

### Metrics: Prometheus thu thập CPU/RAM usage của Pods và Nodes AKS.

### Dashboard URL: [[Link-to-Grafana-Cloud-Dashboard](https://dathanh04.grafana.net/a/grafana-k8s-app/home?from=now-1h&to=now&refresh=1m&var-cluster=%24__all&var-namespace=%24__all)]

## 📂 Cấu trúc Repository
```
.
├── Jenkinsfile                  # Logic CI/CD chính
├── client/                      # Source code Frontend
├── api-gateway/                 # Root Service
├── services/                    # Các Microservices con
│   ├── user-service/
│   ├── activity-service/
│   └── ...
└── infrastructure/
    └── k8s/                     # Kubernetes Manifests
        ├── deployment.yaml      # Chứa placeholder ${TAG}
        ├── service.yaml
        └── ingress.yaml
```

## 📝 Hướng dẫn Developer (Dev Workflow)
### Phát triển tính năng: Tạo nhánh feature từ dev.

### Deploy Staging/Prod: Merge code vào nhánh cicd.

### Kiểm tra Deploy:

Xem trạng thái Build trên Jenkins Dashboard.

Nếu thành công, Pods trên AKS sẽ tự động Restart.

Kiểm tra phiên bản mới bằng cách xem Log hoặc Header API.