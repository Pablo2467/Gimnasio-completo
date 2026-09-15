CREATE TABLE sales (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id),
    employee_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);