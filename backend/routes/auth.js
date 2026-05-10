const express     = require('express');
const bcrypt      = require('bcryptjs');
const jwt         = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/login', (req, res) => {
  const db = req.app.locals.db;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  db.query(
    'SELECT * FROM utilisateurs WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });

      if (results.length === 0) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const user  = results[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        utilisateur: {
          id:    user.id,
          nom:   user.nom,
          email: user.email,
          role:  user.role,
        },
      });
    }
  );
});

router.get('/me', verifyToken, (req, res) => {
  const db = req.app.locals.db;

  db.query(
    'SELECT id, nom, email, role FROM utilisateurs WHERE id = ?',
    [req.utilisateur.id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }
      res.json(results[0]);
    }
  );
});

module.exports = router;
