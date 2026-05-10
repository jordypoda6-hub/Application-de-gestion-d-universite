const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  const db = req.app.locals.db;

  db.query(
    `SELECT e.*, c.abreviation as civilite_abbr, p.libelle as pays_libelle 
     FROM etudiants e
     LEFT JOIN civilites c ON e.civilites_id = c.id
     LEFT JOIN pays p ON e.pays_id = p.id
     ORDER BY e.nom ASC`,
    (err, results) => {
      if (err) {
        console.error('Erreur SELECT etudiants :', err);
        return res.status(500).json({ message: 'Erreur serveur.' });
      }
      res.json(results);
    }
  );
});

router.get('/:id', verifyToken, (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  db.query(
    'SELECT * FROM etudiants WHERE id = ?',
    [id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: 'Étudiant non trouvé.' });
      }
      res.json(results[0]);
    }
  );
});

router.post('/', verifyToken, (req, res) => {
  const db = req.app.locals.db;
  const { nom, prenoms, email, telephone, dateNaissance, paysId, civilitesId } = req.body;

  if (!nom || !prenoms || !paysId || !civilitesId) {
    return res.status(400).json({ 
      message: 'Nom, prénoms, pays et civilité sont obligatoires.' 
    });
  }

  db.query(
    `INSERT INTO etudiants (nom, prenoms, email, telephone, dateNaissance, pays_id, civilites_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nom, prenoms, email || null, telephone || null, dateNaissance || null, paysId, civilitesId],
    (err, result) => {
      if (err) {
        console.error('Erreur INSERT etudiant :', err);
        
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Cet email existe déjà.' });
        }
        
        return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'étudiant.' });
      }

      res.status(201).json({
        message: 'Étudiant ajouté avec succès.',
        id: result.insertId,
        etudiant: {
          id: result.insertId,
          nom,
          prenoms,
          email,
          telephone,
          dateNaissance,
          paysId,
          civilitesId,
        }
      });
    }
  );
});

router.put('/:id', verifyToken, (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { nom, prenoms, email, telephone, dateNaissance, paysId, civilitesId } = req.body;

  if (!nom || !prenoms) {
    return res.status(400).json({ message: 'Nom et prénoms obligatoires.' });
  }

  db.query(
    `UPDATE etudiants 
     SET nom = ?, prenoms = ?, email = ?, telephone = ?, dateNaissance = ?, pays_id = ?, civilites_id = ?
     WHERE id = ?`,
    [nom, prenoms, email || null, telephone || null, dateNaissance || null, paysId, civilitesId, id],
    (err, result) => {
      if (err) {
        console.error('Erreur UPDATE etudiant :', err);
        return res.status(500).json({ message: 'Erreur lors de la modification.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Étudiant non trouvé.' });
      }

      res.json({ message: 'Étudiant modifié avec succès.' });
    }
  );
});

router.delete('/:id', verifyToken, (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  db.query(
    'DELETE FROM etudiants WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('Erreur DELETE etudiant :', err);
        return res.status(500).json({ message: 'Erreur lors de la suppression.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Étudiant non trouvé.' });
      }

      res.json({ message: 'Étudiant supprimé avec succès.' });
    }
  );
});

module.exports = router;
