const express     = require('express');
const verifyToken = require('../middleware/verifyToken');
const router      = express.Router();

router.get('/', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'SELECT * FROM cycles ORDER BY libelle ASC',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json(results);
    }
  );
});

router.post('/', verifyToken, (req, res) => {
  const { libelle, duree_annees } = req.body;
  if (!libelle) return res.status(400).json({ message: 'Le libellé est obligatoire.' });

  req.app.locals.db.query(
    'INSERT INTO cycles (libelle, duree_annees) VALUES (?, ?)',
    [libelle, parseInt(duree_annees) || 3],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Ce libellé existe déjà.' });
        return res.status(500).json({ message: 'Erreur serveur.' });
      }
      res.status(201).json({ message: 'Cycle ajouté.', id: result.insertId });
    }
  );
});

router.put('/:id', verifyToken, (req, res) => {
  const { libelle, duree_annees } = req.body;
  if (!libelle) return res.status(400).json({ message: 'Le libellé est obligatoire.' });

  req.app.locals.db.query(
    'UPDATE cycles SET libelle=?, duree_annees=? WHERE id=?',
    [libelle, parseInt(duree_annees) || 3, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Cycle non trouvé.' });
      res.json({ message: 'Cycle modifié.' });
    }
  );
});

router.delete('/:id', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'DELETE FROM cycles WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Cycle non trouvé.' });
      res.json({ message: 'Cycle supprimé.' });
    }
  );
});

module.exports = router;
