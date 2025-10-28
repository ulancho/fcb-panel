FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install --save-dev @types/node
RUN npm install -g typescript
RUN npm run build

FROM nginx:1.27-alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
