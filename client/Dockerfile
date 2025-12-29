# ============================
# 1) BUILD STAGE
# ============================
FROM node:20-alpine AS builder


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
