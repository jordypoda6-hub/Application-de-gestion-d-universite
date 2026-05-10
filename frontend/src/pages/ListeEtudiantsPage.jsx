import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ListeEtudiantsPage() {
  const { getToken } = useAuth();
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const token = getToken();
        const response = await fetch('/api/etudiants', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des étudiants');
        }

        const data = await response.json();
        setEtudiants(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEtudiants();
  }, [getToken]);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return;

    try {
      const token = getToken();
      const response = await fetch(`/api/etudiants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setEtudiants(etudiants.filter(e => e.id !== id));
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const etudianted = etudiants.filter(e =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header mb-4">
        <h1 className="fw-bold mb-2">
          <i className="bi bi-people me-2 text-primary" />
          Liste des étudiants
        </h1>
        <p className="text-muted">Gestion complète des étudiants ({etudiants.length})</p>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="card shadow-sm p-4">
        {/* Recherche */}
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>
                    <i className="bi bi-person me-2"></i>
                    Nom
                  </th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Pays</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {etudianted.length > 0 ? (
                  etudianted.map(etudiant => (
                    <tr key={etudiant.id}>
                      <td className="fw-semibold">{etudiant.nom}</td>
                      <td>{etudiant.prenoms}</td>
                      <td>{etudiant.email || '—'}</td>
                      <td>{etudiant.telephone || '—'}</td>
                      <td>{etudiant.pays_libelle || '—'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          title="Voir les détails"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(etudiant.id)}
                          title="Supprimer"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Aucun étudiant trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}