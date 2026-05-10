import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function NiveauxPage() {
  const { getToken } = useAuth();
  const [niveaux, setNiveaux]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({ libelle: '', ordre: '' });

  const fetchNiveaux = async () => {
    try {
      const res = await fetch('/api/niveaux', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur de chargement');
      setNiveaux(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNiveaux(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ libelle: '', ordre: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (niveau) => {
    setForm({ libelle: niveau.libelle, ordre: niveau.ordre });
    setEditId(niveau.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url    = editId ? `/api/niveaux/${editId}` : '/api/niveaux';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ libelle: form.libelle, ordre: parseInt(form.ordre) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setSuccess(editId ? 'Niveau modifié avec succès !' : 'Niveau ajouté avec succès !');
      setTimeout(() => setSuccess(''), 3000);
      resetForm();
      fetchNiveaux();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce niveau ?')) return;
    try {
      const res = await fetch(`/api/niveaux/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setNiveaux(niveaux.filter(n => n.id !== id));
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
              <i className="bi bi-layers me-2 text-primary" />
              Niveaux
            </h1>
            <p className="text-muted">Gestion des niveaux d'études ({niveaux.length})</p>
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
          <h5 className="fw-bold mb-3">{editId ? 'Modifier le niveau' : 'Nouveau niveau'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Libellé *</label>
                <input type="text" name="libelle" value={form.libelle} onChange={handleChange} className="form-control" placeholder="Ex: Licence 1" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Ordre *</label>
                <input type="number" name="ordre" value={form.ordre} onChange={handleChange} className="form-control" min="1" placeholder="1" required />
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
                <tr><th>Ordre</th><th>Libellé</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {niveaux.length > 0 ? niveaux.map(n => (
                  <tr key={n.id}>
                    <td><span className="badge bg-primary">{n.ordre}</span></td>
                    <td className="fw-semibold">{n.libelle}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(n)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(n.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="text-center text-muted py-4">Aucun niveau enregistré</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}