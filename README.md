# Postly

A full-stack post scheduling system inspired by Buffer.

## Features
- Schedule posts
- Background workers
- Reliable retries
- Cancel scheduled posts
- Live status updates
- Simulated social posting

## Tech Stack
- Node.js + Express
- PostgreSQL
- Redis + BullMQ
- Next.js (TypeScript)

## Architecture
API Server → Queue → Worker → Database  
Frontend polls API for live updates.

## How to Run
1. Start Redis
2. Run backend
3. Run worker
4. Run frontend
