-- Database is created automatically by POSTGRES_DB environment variable

-- Create Orders table
CREATE TABLE IF NOT EXISTS Orders (
    order_id VARCHAR(50) NOT NULL PRIMARY KEY,
    description VARCHAR(255),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO Orders (order_id, description)
VALUES ('10000001', 'Sample Order 1'),
       ('10000002', 'Sample Order 2');
