import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EcolesPage() {
  const { getToken } = useAuth();
  const [ecoles, setEcoles]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({ libelle: '', adresse: '', telephone: '', email: '' });

  const fetchEcoles = async () => {
    try {
      const res = await fetch('/api/ecoles', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur de chargement');
      setEcoles(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEcoles(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ libelle: '', adresse: '', telephone: '', email: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (ecole) => {
    setForm({
      libelle:   ecole.libelle    || '',
      adresse:   ecole.adresse    || '',
      telephone: ecole.telephone  || '',
      email:     ecole.email      || '',
    });
    setEditId(ecole.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url    = editId ? `/api/ecoles/${editId}` : '/api/ecoles';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setSuccess(editId ? 'École modifiée avec succès !' : 'École ajoutée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
      resetForm();
      fetchEcoles();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette école ?')) return;
    try {
      const res = await fetch(`/api/ecoles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setEcoles(ecoles.filter(e => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-lg">
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold mb-2">
              <i className="bi bi-building me-2 text-primary" />
              Écoles
            </h1>
            <p className="text-muted">Gestion des écoles ({ecoles.length})</p>
          </div>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <i className="bi bi-plus-circle me-2" />
            Ajouter
          </button>
        </div>
      </div>

      {success && <div className="alert alert-success mb-4"><i className="bi bi-check-circle me-2" />{success}</div>}
      {error   && <div className="alert alert-danger  mb-4"><i className="bi bi-exclamation-triangle me-2" />{error}</div>}

      {showForm && (
        <div className="card shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-3">{editId ? 'Modifier l\'école' : 'Nouvelle école'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Libellé *</label>
                <input type="text" name="libelle" value={form.libelle} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Téléphone</label>
                <input type="text" name="telephone" value={form.telephone} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Adresse</label>
                <input type="text" name="adresse" value={form.adresse} onChange={handleChange} className="form-control" />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving && <span className="spinner-border spinner-border-sm me-2" />}
                {editId ? 'Modifier' : 'Ajouter'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="card shadow-sm p-4">
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary" role="status" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Libellé</th><th>Email</th><th>Téléphone</th><th>Adresse</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ecoles.length > 0 ? ecoles.map(ecole => (
                  <tr key={ecole.id}>
                    <td className="fw-semibold">{ecole.libelle}</td>
                    <td>{ecole.email     || '—'}</td>
                    <td>{ecole.telephone || '—'}</td>
                    <td>{ecole.adresse   || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(ecole)} title="Modifier">
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ecole.id)} title="Supprimer">
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="text-center text-muted py-4">Aucune école enregistrée</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}