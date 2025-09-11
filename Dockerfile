# 1. 의존성 설치를 위한 기본 스테이지
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. 개발 환경을 위한 스테이지 (<<-- 이 부분을 추가/수정합니다)
FROM dependencies AS development
WORKDIR /app
COPY . .
# 개발 환경에서는 dev 명령어를 docker-compose에서 실행하므로 CMD는 둘 필요가 없습니다.

# 3. 프로덕션 빌드를 위한 스테이지
FROM dependencies AS build
WORKDIR /app
COPY . .
RUN npm run build

# 4. 최종 프로덕션 실행을 위한 스테이지
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]