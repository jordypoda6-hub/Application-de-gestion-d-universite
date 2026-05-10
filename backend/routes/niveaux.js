const express     = require('express');
const verifyToken = require('../middleware/verifyToken');
const router      = express.Router();

router.get('/', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'SELECT * FROM niveaux ORDER BY ordre ASC',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json(results);
    }
  );
});

router.post('/', verifyToken, (req, res) => {
  const { libelle, ordre } = req.body;
  if (!libelle || !ordre) return res.status(400).json({ message: 'Libellé et ordre sont obligatoires.' });

  req.app.locals.db.query(
    'INSERT INTO niveaux (libelle, ordre) VALUES (?, ?)',
    [libelle, parseInt(ordre)],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Ce libellé existe déjà.' });
        return res.status(500).json({ message: 'Erreur serveur.' });
      }
      res.status(201).json({ message: 'Niveau ajouté.', id: result.insertId });
    }
  );
});

router.put('/:id', verifyToken, (req, res) => {
  const { libelle, ordre } = req.body;
  if (!libelle || !ordre) return res.status(400).json({ message: 'Libellé et ordre sont obligatoires.' });

  req.app.locals.db.query(
    'UPDATE niveaux SET libelle=?, ordre=? WHERE id=?',
    [libelle, parseInt(ordre), req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Niveau non trouvé.' });
      res.json({ message: 'Niveau modifié.' });
    }
  );
});

router.delete('/:id', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'DELETE FROM niveaux WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Niveau non trouvé.' });
      res.json({ message: 'Niveau supprimé.' });
    }
  );
});

module.exports = router;
