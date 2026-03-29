#!/bin/bash

docker compose down -v
docker compose up -d
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev

# 'chmod +x' to give shell script execute permissions 