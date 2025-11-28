# ============================
# 1) BUILD STAGE
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy file cấu hình trước để cache tốt hơn
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Build Vite (ra thư mục dist)
RUN npm run build

# ============================
# 2) RUN STAGE (Nginx phục vụ file tĩnh)
# ============================
FROM nginx:stable-alpine

# Copy file build từ stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy config Nginx tối ưu cho SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
