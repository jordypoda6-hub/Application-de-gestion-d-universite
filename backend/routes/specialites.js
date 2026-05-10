const express     = require('express');
const verifyToken = require('../middleware/verifyToken');
const router      = express.Router();

router.get('/', verifyToken, (req, res) => {
  req.app.locals.db.query(
    `SELECT s.*, f.libelle AS filiere_libelle
     FROM specialites s
     LEFT JOIN filieres f ON f.id = s.filieres_id
     ORDER BY s.libelle ASC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json(results);
    }
  );
});

router.post('/', verifyToken, (req, res) => {
  const { libelle, filieres_id, description } = req.body;
  if (!libelle || !filieres_id) return res.status(400).json({ message: 'Libellé et filière sont obligatoires.' });

  req.app.locals.db.query(
    'INSERT INTO specialites (libelle, filieres_id, description) VALUES (?, ?, ?)',
    [libelle, parseInt(filieres_id), description || null],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Ce libellé existe déjà.' });
        return res.status(500).json({ message: 'Erreur serveur.' });
      }
      res.status(201).json({ message: 'Spécialité ajoutée.', id: result.insertId });
    }
  );
});

router.put('/:id', verifyToken, (req, res) => {
  const { libelle, filieres_id, description } = req.body;
  if (!libelle || !filieres_id) return res.status(400).json({ message: 'Libellé et filière sont obligatoires.' });

  req.app.locals.db.query(
    'UPDATE specialites SET libelle=?, filieres_id=?, description=? WHERE id=?',
    [libelle, parseInt(filieres_id), description || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Spécialité non trouvée.' });
      res.json({ message: 'Spécialité modifiée.' });
    }
  );
});

router.delete('/:id', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'DELETE FROM specialites WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Spécialité non trouvée.' });
      res.json({ message: 'Spécialité supprimée.' });
    }
  );
});

module.exports = router;
