const express     = require('express');
const verifyToken = require('../middleware/verifyToken');
const router      = express.Router();

router.get('/', verifyToken, (req, res) => {
  req.app.locals.db.query(
    `SELECT p.*,
            s.libelle AS specialite_libelle,
            n.libelle AS niveau_libelle,
            c.libelle AS cycle_libelle
     FROM parcours p
     LEFT JOIN specialites s ON s.id = p.specialites_id
     LEFT JOIN niveaux     n ON n.id = p.niveaux_id
     LEFT JOIN cycles      c ON c.id = p.cycles_id
     ORDER BY p.libelle ASC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json(results);
    }
  );
});

router.post('/', verifyToken, (req, res) => {
  const { libelle, specialites_id, niveaux_id, cycles_id } = req.body;
  if (!libelle || !specialites_id || !niveaux_id)
    return res.status(400).json({ message: 'Libellé, spécialité et niveau sont obligatoires.' });

  req.app.locals.db.query(
    'INSERT INTO parcours (libelle, specialites_id, niveaux_id, cycles_id) VALUES (?, ?, ?, ?)',
    [libelle, parseInt(specialites_id), parseInt(niveaux_id), cycles_id ? parseInt(cycles_id) : null],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Ce libellé existe déjà.' });
        return res.status(500).json({ message: 'Erreur serveur.' });
      }
      res.status(201).json({ message: 'Parcours ajouté.', id: result.insertId });
    }
  );
});

router.put('/:id', verifyToken, (req, res) => {
  const { libelle, specialites_id, niveaux_id, cycles_id } = req.body;
  if (!libelle || !specialites_id || !niveaux_id)
    return res.status(400).json({ message: 'Libellé, spécialité et niveau sont obligatoires.' });

  req.app.locals.db.query(
    'UPDATE parcours SET libelle=?, specialites_id=?, niveaux_id=?, cycles_id=? WHERE id=?',
    [libelle, parseInt(specialites_id), parseInt(niveaux_id), cycles_id ? parseInt(cycles_id) : null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Parcours non trouvé.' });
      res.json({ message: 'Parcours modifié.' });
    }
  );
});

router.delete('/:id', verifyToken, (req, res) => {
  req.app.locals.db.query(
    'DELETE FROM parcours WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Parcours non trouvé.' });
      res.json({ message: 'Parcours supprimé.' });
    }
  );
});

module.exports = router;
