CREATE DATABASE DemoDB;
GO
USE DemoDB;
GO
CREATE TABLE Orders
(
    order_id nvarchar(50) NOT NULL PRIMARY KEY,
    description nvarchar(255),
    created DATETIME DEFAULT(getdate()),
);
GO
INSERT INTO Orders
    (order_id, description)
VALUES("10000001", "Sample Order 1")
INSERT INTO Orders
    (order_id, description)
VALUES("10000002", "Sample Order 2")
GO
