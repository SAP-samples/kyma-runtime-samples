#!/bin/bash
# Wait for PostgreSQL to be ready
until pg_isready -U postgres; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready!"

# Run the setup script
psql -U postgres -d DemoDB -f /usr/src/app/setup.sql