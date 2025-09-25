-- Chess Academy Database Initialization
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions we might need
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance (these will be added after Prisma migration)
-- We'll add these later via migration files