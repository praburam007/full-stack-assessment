# Multi-stage build for Node.js application

## Build frontend
FROM node:20 AS ui-builder
WORKDIR /app/packages/ui
COPY packages/ui/package.json packages/ui/package.json
COPY packages/ui/tsconfig.json packages/ui/tsconfig.json
RUN npm install --legacy-peer-deps
COPY packages/ui/ .
RUN npm run build


## Build backend
FROM node:20 AS api-builder
WORKDIR /app/packages/api
COPY packages/api/package.json packages/api/package.json
COPY packages/api/tsconfig.json packages/api/tsconfig.json
RUN npm install --legacy-peer-deps
COPY packages/api/ .
RUN npm run build

## Final stage
FROM node:20 AS production
WORKDIR /app
COPY --from=ui-builder /app/packages/ui/dist ./packages/ui/dist
COPY --from=api-builder /app/packages/api/dist ./packages/api/dist
COPY --from=ui-builder /app/packages/ui/package.json ./packages/ui/package.json
COPY --from=api-builder /app/packages/api/package.json ./packages/api/package.json

## Install production dependencies
WORKDIR /app/packages/api
RUN npm install --production --legacy-peer-deps

## Serve application
WORKDIR /app/packages/api
CMD ["node", "dist/index.js"]