const express     = require('express');
const verifyToken = require('../middleware/verifyToken');
const router      = express.Router();

router.get('/', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'SELECT * FROM filieres ORDER BY libelle ASC',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json(results);
    }
  );
});

router.post('/', verifyToken, (req, res) => {
  const { code, libelle, description } = req.body;
  if (!libelle) return res.status(400).json({ message: 'Le libellé est obligatoire.' });

  req.app.locals.db.query(
    'INSERT INTO filieres (code, libelle, description) VALUES (?, ?, ?)',
    [code || null, libelle, description || null],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Ce libellé existe déjà.' });
        return res.status(500).json({ message: 'Erreur serveur.' });
      }
      res.status(201).json({ message: 'Filière ajoutée.', id: result.insertId });
    }
  );
});

router.put('/:id', verifyToken, (req, res) => {
  const { code, libelle, description } = req.body;
  if (!libelle) return res.status(400).json({ message: 'Le libellé est obligatoire.' });

  req.app.locals.db.query(
    'UPDATE filieres SET code=?, libelle=?, description=? WHERE id=?',
    [code || null, libelle, description || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Filière non trouvée.' });
      res.json({ message: 'Filière modifiée.' });
    }
  );
});

router.delete('/:id', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'DELETE FROM filieres WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Filière non trouvée.' });
      res.json({ message: 'Filière supprimée.' });
    }
  );
});

module.exports = router;
