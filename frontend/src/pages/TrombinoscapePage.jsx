import { useAuth } from '../context/AuthContext';

export default function TrombinoscapePage() {
  const { user } = useAuth();

  const etudiants = [];

  return (
    <div>
      <div className="page-header mb-5">
        <h1 className="fw-bold mb-2">
          <i className="bi bi-images me-2 text-primary" />
          Trombinoscope
        </h1>
        <p className="text-muted">Galerie des étudiants de l'école</p>
      </div>

      {/* Profil de l'utilisateur connecté */}
      <div className="card shadow-sm p-4 mb-5">
        <h5 className="fw-bold mb-4">
          <i className="bi bi-person-circle me-2"></i>
          Mon Profil
        </h5>
        <div className="d-flex align-items-center gap-4">
          <div className="profile-avatar large">
            {user?.nom?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h6 className="fw-bold mb-1">{user?.nom}</h6>
            <p className="text-muted mb-1">{user?.email}</p>
            <p className="mb-0">
              <span className="badge bg-primary">{user?.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Galerie des étudiants */}
      <div className="mb-4">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-people me-2"></i>
          Étudiants
        </h5>
      </div>

      <div className="row g-4">
        {etudiants.map(etudiant => (
          <div key={etudiant.id} className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100 overflow-hidden">
              <div className="profile-card-header">
                <div className="profile-avatar">
                  {etudiant.avatar}
                </div>
              </div>
              <div className="card-body text-center">
                <h6 className="fw-bold mb-1">
                  {etudiant.prenoms} {etudiant.nom}
                </h6>
                <p className="text-muted small mb-2">{etudiant.email}</p>
                <p className="text-primary small fw-semibold">
                  {etudiant.parcours}
                </p>
                <button className="btn btn-sm btn-outline-primary w-100">
                  <i className="bi bi-eye me-1"></i>
                  Voir profil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Style inline - ajouter à votre CSS global ou index.css */
const style = `
.profile-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
}

.profile-avatar.large {
  width: 100px;
  height: 100px;
  font-size: 48px;
}

.profile-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
`;
