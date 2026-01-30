const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configurar multer para upload
const upload = multer({ dest: 'uploads/' });

// Criar banco de dados SQLite
const db = new sqlite3.Database('./pedidos.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    initDatabase();
  }
});

// Inicializar tabelas
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido TEXT,
      data TEXT,
      cod_cliente TEXT,
      razao_social TEXT,
      cep TEXT,
      endereco TEXT,
      bairro TEXT,
      cidade TEXT,
      estado TEXT,
      peso_pedido REAL,
      valor REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela pedidos criada/verificada com sucesso.');
    }
  });
}

// Rota: Upload e processar arquivo Excel
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const filePath = req.file.path;
    
    // Ler arquivo Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Limpar tabela antes de importar novos dados
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM pedidos', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Inserir dados no banco
    const stmt = db.prepare(`
      INSERT INTO pedidos (
        pedido, data, cod_cliente, razao_social, cep, endereco, 
        bairro, cidade, estado, peso_pedido, valor
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let importedCount = 0;

    for (const row of data) {
      // Pular linhas vazias ou de cabeçalho duplicado
      if (!row.PEDIDOS || row.PEDIDOS === 'PEDIDOS' || !row.Cidades || row.Cidades === 'Cidades') {
        continue;
      }

      try {
        await new Promise((resolve, reject) => {
          stmt.run(
            row.PEDIDOS || '',
            row['DATA DO PEDIDO'] || '',
            row['COD CLIENTE'] || '',
            row['RAZÃO SOCIAL'] || '',
            row.CEP || '',
            row.ENDERECO || '',
            row.BAIRRO || '',
            row.Cidades || '',
            row.ESTADO || '',
            parseFloat(row['PESO PEDIDO']) || 0,
            parseFloat(row.VALOR) || 0,
            (err) => {
              if (err) reject(err);
              else {
                importedCount++;
                resolve();
              }
            }
          );
        });
      } catch (err) {
        console.error('Erro ao inserir linha:', err);
      }
    }

    stmt.finalize();

    // Remover arquivo temporário
    fs.unlinkSync(filePath);

    res.json({ 
      success: true, 
      message: `${importedCount} pedidos importados com sucesso!`,
      count: importedCount
    });

  } catch (error) {
    console.error('Erro ao processar arquivo:', error);
    res.status(500).json({ error: 'Erro ao processar arquivo', details: error.message });
  }
});

// Rota: Obter todos os pedidos
app.get('/api/pedidos', (req, res) => {
  db.all('SELECT * FROM pedidos ORDER BY id', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Rota: Obter estatísticas
app.get('/api/stats', (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as total FROM pedidos',
    peso_total: 'SELECT SUM(peso_pedido) as peso_total FROM pedidos',
    valor_total: 'SELECT SUM(valor) as valor_total FROM pedidos',
    por_cidade: `
      SELECT 
        cidade,
        COUNT(*) as total_pedidos,
        SUM(peso_pedido) as peso_total,
        SUM(valor) as valor_total
      FROM pedidos
      GROUP BY cidade
      ORDER BY valor_total DESC
    `
  };

  const results = {};

  db.get(queries.total, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    results.total_pedidos = row.total;

    db.get(queries.peso_total, [], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      results.peso_total = row.peso_total || 0;

      db.get(queries.valor_total, [], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        results.valor_total = row.valor_total || 0;

        db.all(queries.por_cidade, [], (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          results.por_cidade = rows;
          res.json(results);
        });
      });
    });
  });
});

// Rota: Verificar se tem dados
app.get('/api/check-data', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM pedidos', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ hasData: row.count > 0, count: row.count });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Fechar banco de dados ao encerrar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexão com banco de dados fechada.');
    process.exit(0);
  });
});
