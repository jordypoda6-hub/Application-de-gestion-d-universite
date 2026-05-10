const express     = require('express');
const verifyToken = require('../middleware/verifyToken');
const router      = express.Router();

router.get('/', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'SELECT * FROM ecoles ORDER BY libelle ASC',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json(results);
    }
  );
});

router.post('/', verifyToken, (req, res) => {
  const { libelle, adresse, telephone, email } = req.body;
  if (!libelle) return res.status(400).json({ message: 'Le libellé est obligatoire.' });

  req.app.locals.db.query(
    'INSERT INTO ecoles (libelle, adresse, telephone, email) VALUES (?, ?, ?, ?)',
    [libelle, adresse || null, telephone || null, email || null],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Ce libellé existe déjà.' });
        return res.status(500).json({ message: 'Erreur serveur.' });
      }
      res.status(201).json({ message: 'École ajoutée.', id: result.insertId });
    }
  );
});

router.put('/:id', verifyToken, (req, res) => {
  const { libelle, adresse, telephone, email } = req.body;
  if (!libelle) return res.status(400).json({ message: 'Le libellé est obligatoire.' });

  req.app.locals.db.query(
    'UPDATE ecoles SET libelle=?, adresse=?, telephone=?, email=? WHERE id=?',
    [libelle, adresse || null, telephone || null, email || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'École non trouvée.' });
      res.json({ message: 'École modifiée.' });
    }
  );
});

router.delete('/:id', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'DELETE FROM ecoles WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'École non trouvée.' });
      res.json({ message: 'École supprimée.' });
    }
  );
});

module.exports = router;
