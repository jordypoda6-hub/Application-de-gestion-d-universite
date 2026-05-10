require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const db = mysql.createConnection({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'gestion_2ie',
});

db.connect((err) => {
  if (err) { console.error('❌ Erreur MySQL :', err.message); process.exit(1); }
  console.log('✅ Connecté à MySQL');
});

app.locals.db = db;

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/etudiants',  require('./routes/etudiants'));
app.use('/api/ecoles',     require('./routes/ecoles'));
app.use('/api/filieres',   require('./routes/filieres'));
app.use('/api/specialites',require('./routes/specialites'));
app.use('/api/niveaux',    require('./routes/niveaux'));
app.use('/api/cycles',     require('./routes/cycles'));
app.use('/api/parcours',   require('./routes/parcours'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
