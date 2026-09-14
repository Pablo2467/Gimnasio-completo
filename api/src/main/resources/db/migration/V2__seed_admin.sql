INSERT INTO users (email, password_hash, role, created_at)
VALUES (
    'admin@gymflow.com',
    '$2b$10$0uJclTb4HOln.kUdED2GV.lUms3gRYNY2cVNWlwBSCJROLnTB0IeW',
    'ADMIN',
    now()
);