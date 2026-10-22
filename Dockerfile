# ==========================================
# Multi-stage Dockerfile pro Kalkulačku dovolené
# Stage 1: Build aplikace (Node.js Alpine)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Instalace závislostí s využitím Docker cache vrstev
COPY package*.json ./
RUN npm ci

# Kopírování konfigurací a zdrojových kódů
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Sestavení produkčního balíčku
RUN npm run build

# ==========================================
# Stage 2: Produkční Nginx Alpine runtime
# ==========================================
FROM nginx:alpine AS runner

# Instalace curl pro spolehlivý healthcheck
RUN apk add --no-cache curl

# Odstranění výchozí Nginx stránky
RUN rm -rf /usr/share/nginx/html/*

# Kopírování sestavených statických souborů z builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopírování optimalizované konfigurace Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Otevření standardního HTTP portu uvnitř kontejneru
EXPOSE 80

# Definice healthchecku v kontejneru
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Spuštění Nginx v popředí
CMD ["nginx", "-g", "daemon off;"]
