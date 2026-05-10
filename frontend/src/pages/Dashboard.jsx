import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">
          <i className="bi bi-grid me-2 text-primary" />
          Dashboard
        </h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2" />
          Déconnexion
        </button>
      </div>

      <div className="card shadow-sm p-4">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-person-circle me-2 text-primary" />
          Bienvenue, {user?.nom} !
        </h5>
        <p className="text-muted mb-1"><strong>Email :</strong> {user?.email}</p>
        <p className="text-muted"><strong>Rôle :</strong> {user?.role || '—'}</p>
      </div>
    </div>
  );
}
