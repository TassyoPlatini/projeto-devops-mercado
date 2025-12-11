CREATE TABLE IF NOT EXISTS estoque (
    id SERIAL PRIMARY KEY,
    produto_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exemplo de inserção para teste inicial (opcional)
-- INSERT INTO estoque (produto_data) VALUES ('{"nome": "Arroz", "preco": 25.50, "quantidade": 100}');