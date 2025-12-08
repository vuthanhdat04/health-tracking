📦 1. Yêu cầu môi trường

Cài đặt các công cụ bắt buộc:

Docker Desktop (bắt buộc chạy Linux containers)

kubectl

Minikube

Kiểm tra:

docker version
kubectl version --client
minikube version

🚀 2. Khởi tạo Minikube Cluster
minikube start --driver=docker --memory=4096 --cpus=2


Kiểm tra node:

kubectl get nodes

📁 3. Tạo namespace cho hệ thống
kubectl create namespace health-tracking

🏗 4. Áp dụng toàn bộ YAML trong infrastructure/k8s

Repo này chứa các YAML của:

api-gateway

client

user-service

activity-service

health-metrics-service

progress-service

secrets/config (nếu có)

ingress

Chạy:

kubectl apply -f infrastructure/k8s/ -n health-tracking


Kiểm tra:

kubectl get pods -n health-tracking
kubectl get svc -n health-tracking


Tất cả pod phải ở trạng thái:

Running

🌐 5. Bật Ingress Controller

Minikube có sẵn addon ingress:

minikube addons enable ingress


Kiểm tra ingress controller:

kubectl get pods -n ingress-nginx


Phải thấy pod:

ingress-nginx-controller   1/1   Running

🟦 6. Chuyển Ingress Controller sang LoadBalancer

Mặc định Ingress của Minikube là NodePort.
Để truy cập bằng port 80 như môi trường production (AKS), ta phải đổi sang LoadBalancer:

Patch service của ingress-nginx:

(Lưu ý: dùng đúng cú pháp PowerShell)

kubectl patch svc ingress-nginx-controller -n ingress-nginx -p "{\"spec\": {\"type\": \"LoadBalancer\"}}"


Xác nhận:

kubectl get svc -n ingress-nginx


Kết quả mẫu:

ingress-nginx-controller   LoadBalancer   10.x.x.x   127.0.0.2   80:xxxxx/TCP

🔌 7. Chạy minikube tunnel

Đây là bước bắt buộc để LoadBalancer hoạt động.

Mở PowerShell Run as Administrator:

minikube tunnel


Cửa sổ tunnel phải được giữ mở.

Kiểm tra lại:

kubectl get svc -n ingress-nginx


EXTERNAL-IP sẽ là:

127.0.0.2

🌍 8. Map domain health.local vào hosts file

Mở Notepad Run as Administrator → mở file:

C:\Windows\System32\drivers\etc\hosts


Thêm dòng:

127.0.0.2   health.local


Lưu lại.

🧭 9. Apply file ingress

File infrastructure/k8s/ingress.yaml:

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: health-ingress
  namespace: health-tracking
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: health.local
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: 8080

          - path: /
            pathType: Prefix
            backend:
              service:
                name: client
                port:
                  number: 80


Apply lại:

kubectl apply -f infrastructure/k8s/ingress.yaml -n health-tracking

🔥 10. Truy cập hệ thống
Client (React UI)
http://health.local/

API Gateway
http://health.local/api/users/login

🧪 11. Lệnh Debug nhanh
Xem ingress:
kubectl describe ingress health-ingress -n health-tracking

Xem service:
kubectl get svc -n health-tracking

Xem logs:
kubectl logs deployment/api-gateway -n health-tracking

🎯 12. Luồng hoạt động tổng quan

Minikube khởi tạo cluster K8s local

Ingress Controller được bật

Service ingress-nginx được chuyển sang LoadBalancer

minikube tunnel cấp EXTERNAL-IP → 127.0.0.2

Domain health.local map tới EXTERNAL-IP

Ingress route:

/api → api-gateway

/ → client

Các service khác giao tiếp qua ClusterIP

FE truy cập backend qua domain ổn định
