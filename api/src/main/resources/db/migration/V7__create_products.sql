CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    description VARCHAR(500)
);

INSERT INTO products (name, category, price, stock, description) VALUES
('Whey Protein 2lb', 'Proteína', 145000, 20, 'Proteína de suero sabor chocolate'),
('Creatina Monohidratada 300g', 'Creatina', 85000, 15, 'Creatina pura micronizada'),
('Pre-Workout 300g', 'Pre-entreno', 95000, 10, 'Pre-entreno con cafeína y beta-alanina');