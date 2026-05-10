import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AjouterEtudiantPage() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    nom: '',
    prenoms: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    paysId: '',
    civilitesId: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const civilites = [
    { id: 1, label: 'M.' },
    { id: 2, label: 'Mme' },
    { id: 3, label: 'Mlle' },
    { id: 4, label: 'Dr' },
    { id: 5, label: 'Pr' },
  ];
   
  const pays = [
    { id: 1, label: 'France' },
    { id: 2, label: 'Belgique' },
    { id: 3, label: 'Suisse' },
    { id: 4, label: 'Canada' },
    { id: 5, label: 'Sénégal' },
    { id: 6, label: 'Côte d\'Ivoire' },
    { id: 7, label: 'Maroc' },
    { id: 8, label: 'Tunisie' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = getToken();
      const payload = {
        nom: form.nom,
        prenoms: form.prenoms,
        email: form.email || null,
        telephone: form.telephone || null,
        dateNaissance: form.dateNaissance || null,
        paysId: parseInt(form.paysId),
        civilitesId: parseInt(form.civilitesId),
      };

      const response = await fetch('/api/etudiants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'ajout');
      }

      setSubmitted(true);
      setForm({
        nom: '',
        prenoms: '',
        email: '',
        telephone: '',
        dateNaissance: '',
        paysId: '',
        civilitesId: '',
      });

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header mb-4">
        <h1 className="fw-bold mb-2">
          <i className="bi bi-person-plus me-2 text-primary" />
          Ajouter un étudiant
        </h1>
        <p className="text-muted">Remplissez le formulaire pour ajouter un nouvel étudiant</p>
      </div>

      {submitted && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          <strong>Succès !</strong> L'étudiant a été ajouté avec succès.
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>Erreur !</strong> {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      )}

      <div className="card shadow-sm p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-person me-2"></i>
              Identité
            </h5>
            <div className="row g-3">
              <div className="col-md-2">
                <label className="form-label">Civilité</label>
                <select
                  name="civilitesId"
                  value={form.civilitesId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choisir...</option>
                  {civilites.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Dupont"
                  required
                />
              </div>
              <div className="col-md-5">
                <label className="form-label">Prénoms *</label>
                <input
                  type="text"
                  name="prenoms"
                  value={form.prenoms}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Jean Marie"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-envelope me-2"></i>
              Informations de contact
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="etudiant@example.com"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Informations supplémentaires
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Date de naissance</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={form.dateNaissance}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pays d'origine *</label>
                <select
                  name="paysId"
                  value={form.paysId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choisir...</option>
                  {pays.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 pt-3">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Ajouter l'étudiant
                </>
              )}
            </button>
            <button type="reset" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 