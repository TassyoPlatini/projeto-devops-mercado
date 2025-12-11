const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o Banco (usando variáveis de ambiente do Docker)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// [GET] Listar todos os produtos
app.get('/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, produto_data FROM estoque ORDER BY id DESC');
    // Mapeia para retornar o ID junto com os dados do JSON
    const produtos = result.rows.map(row => ({
      id: row.id,
      ...row.produto_data
    }));
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [POST] Adicionar produto
app.post('/produtos', async (req, res) => {
  const dadosProduto = req.body; // Recebe o JSON inteiro
  try {
    const result = await pool.query(
      'INSERT INTO estoque (produto_data) VALUES ($1) RETURNING id',
      [dadosProduto]
    );
    res.status(201).json({ id: result.rows[0].id, ...dadosProduto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [PUT] Atualizar produto (Substitui o JSON inteiro)
app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const dadosProduto = req.body;
  try {
    await pool.query(
      'UPDATE estoque SET produto_data = $1 WHERE id = $2',
      [dadosProduto, id]
    );
    res.json({ message: 'Produto atualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [DELETE] Deletar produto
app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM estoque WHERE id = $1', [id]);
    res.json({ message: 'Produto removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});