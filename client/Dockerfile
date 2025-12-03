# ============================
# 1) BUILD STAGE
# ============================
FROM node:20-alpine AS builder

# Nhận ENV từ Jenkins
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copy file config trước để tận dụng cache
COPY package*.json ./

RUN npm install

COPY . .

# Build Vite
RUN npm run build

# ============================
# 2) RUN STAGE
# ============================
FROM nginx:stable-alpine

# Copy file build ra Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file config Nginx (nếu có SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
