// src/pages/AccueilPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AccueilPage() {
  const { user, getToken } = useAuth();
  const [stats, setStats] = useState({
    etudiants:    0,
    filieres:     0,
    parcours:     0,
    inscriptions: 0,
  });

  useEffect(() => {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/etudiants',  { headers }).then(r => r.json()),
      fetch('/api/filieres',   { headers }).then(r => r.json()),
      fetch('/api/parcours',   { headers }).then(r => r.json()),
    ]).then(([etudiants, filieres, parcours]) => {
      setStats({
        etudiants:    Array.isArray(etudiants)    ? etudiants.length    : 0,
        filieres:     Array.isArray(filieres)     ? filieres.length     : 0,
        parcours:     Array.isArray(parcours)     ? parcours.length     : 0,
        inscriptions: 0,
      });
    }).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Étudiants',    value: stats.etudiants,    icon: 'people' },
    { label: 'Filières',     value: stats.filieres,     icon: 'book' },
    { label: 'Parcours',     value: stats.parcours,     icon: 'diagram-3' },
    { label: 'Inscriptions', value: stats.inscriptions, icon: 'clipboard-check' },
  ];

  return (
    <div className="container-lg">
      {/* Header */}
      <div className="page-header mb-5">
        <h1 className="fw-bold mb-2">
          <i className="bi bi-grid me-2 text-primary" />
          Bienvenue {user?.nom} !
        </h1>
        <p className="text-muted">Tableau de bord de gestion 2iE</p>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-5">
        {statCards.map((stat, idx) => (
          <div key={idx} className="col-6 col-lg-3">
            <div className="stat-card card shadow-sm p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small mb-1">{stat.label}</div>
                  <div className="stat-value fw-bold text-primary fs-3">{stat.value}</div>
                </div>
                <div className="stat-icon">
                  <i className={`bi bi-${stat.icon}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card shadow-sm p-4 mb-5">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-lightning me-2 text-warning" />
          Actions rapides
        </h5>
        <div className="row g-3">
          <div className="col-md-6">
            <Link to="/ajouter-etudiant" className="btn btn-primary w-100">
              <i className="bi bi-person-plus me-2" />
              Ajouter un étudiant
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="/liste-etudiants" className="btn btn-outline-primary w-100">
              <i className="bi bi-people me-2" />
              Voir tous les étudiants
            </Link>
          </div>
        </div>
      </div>

      {/* Infos utilisateur */}
      <div className="card shadow-sm p-4">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-info-circle me-2 text-info" />
          Informations utilisateur
        </h5>
        <div className="row">
          <div className="col-md-6">
            <p className="mb-2"><strong>Nom :</strong> {user?.nom}</p>
            <p className="mb-2"><strong>Email :</strong> {user?.email}</p>
          </div>
          <div className="col-md-6">
            <p className="mb-2"><strong>Rôle :</strong> <span className="badge bg-primary">{user?.role || 'Utilisateur'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}