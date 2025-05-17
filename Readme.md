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
