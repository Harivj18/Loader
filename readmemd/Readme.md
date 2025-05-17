# CSV Sales Data Refresh Project

## Overview

This project loads large CSV files containing historical sales data into a PostgreSQL database. It supports:

- Normalized database schema for sales data
- Efficient CSV loading with data validation
- Daily or on-demand refresh via API
- Scheduled refresh using cron jobs

---

## Prerequisites

- **Node.js** (Recommended v18.x or higher)  
  Download: https://nodejs.org/en/download/

- **PostgreSQL** (Recommended v13 or higher)  
  Download: https://www.postgresql.org/download/

- **npm** (comes with Node.js)

- **Git** (optional, if cloning repo)

---

## Setup Instructions

### 1. Set up PostgreSQL Database

- Create a new database:

  ```bash
  createdb salesdb


### 2. Run the schema file to create tables:

psql -d salesdb -f path/to/schema.sql

3. Initialize Node.js Project and Install Dependencies

npm init -y
npm install express pg node-cron axios csv-parser dotenv

4. Configure Environment Variables
Create .env file in the root directory:

PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/salesdb
CSV_FILE_PATH=./data/sales.csv

5. Start the Server

node server.js

6. Test Load / Refresh API Manually

curl -X POST http://localhost:3000/api/loader
curl -X POST http://localhost:3000/api/refresh
