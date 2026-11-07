# syntax=docker/dockerfile:1
# Builds the React app, then serves it with nginx, which also passes /api to the engine's API.
FROM node:20-slim AS build
WORKDIR /app
COPY web/frontend/package.json web/frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY web/frontend ./
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
