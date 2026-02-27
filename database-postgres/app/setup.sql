CREATE TABLE IF NOT EXISTS orders (
    order_id varchar(50) PRIMARY KEY,
    description varchar(255),
    created timestamptz DEFAULT NOW()
);

INSERT INTO orders (order_id, description) VALUES
    ('10000001', 'Sample Order 1'),
    ('10000002', 'Sample Order 2')
ON CONFLICT (order_id) DO NOTHING;
