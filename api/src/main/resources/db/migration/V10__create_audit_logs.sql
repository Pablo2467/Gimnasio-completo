CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    method_name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT now()
);