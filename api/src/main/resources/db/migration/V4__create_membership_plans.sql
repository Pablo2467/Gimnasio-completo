CREATE TABLE membership_plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price NUMERIC(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO membership_plans (name, description, price, duration_days, active) VALUES
('Básico', 'Acceso a sala de pesas y cardio', 70000, 30, true),
('Premium', 'Acceso completo + clases grupales', 100000, 30, true),
('Black', 'Acceso total + invitados + casillero', 130000, 30, true);