import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FilieresPage() {
  const { getToken } = useAuth();
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({ code: '', libelle: '', description: '' });

  const fetchFilieres = async () => {
    try {
      const res = await fetch('/api/filieres', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur de chargement');
      setFilieres(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFilieres(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ code: '', libelle: '', description: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (filiere) => {
    setForm({
      code:        filiere.code        || '',
      libelle:     filiere.libelle     || '',
      description: filiere.description || '',
    });
    setEditId(filiere.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url    = editId ? `/api/filieres/${editId}` : '/api/filieres';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setSuccess(editId ? 'Filière modifiée avec succès !' : 'Filière ajoutée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
      resetForm();
      fetchFilieres();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette filière ?')) return;
    try {
      const res = await fetch(`/api/filieres/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setFilieres(filieres.filter(f => f.id !== id));
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
              <i className="bi bi-book me-2 text-primary" />
              Filières
            </h1>
            <p className="text-muted">Gestion des filières ({filieres.length})</p>
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
          <h5 className="fw-bold mb-3">{editId ? 'Modifier la filière' : 'Nouvelle filière'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Code</label>
                <input type="text" name="code" value={form.code} onChange={handleChange} className="form-control" placeholder="Ex: INFO" />
              </div>
              <div className="col-md-8">
                <label className="form-label">Libellé *</label>
                <input type="text" name="libelle" value={form.libelle} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows="2" />
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
                <tr><th>Code</th><th>Libellé</th><th>Description</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filieres.length > 0 ? filieres.map(f => (
                  <tr key={f.id}>
                    <td><span className="badge bg-secondary">{f.code || '—'}</span></td>
                    <td className="fw-semibold">{f.libelle}</td>
                    <td>{f.description || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(f)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center text-muted py-4">Aucune filière enregistrée</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}