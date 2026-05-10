import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SpecialitesPage() {
  const { getToken } = useAuth();
  const [specialites, setSpecialites] = useState([]);
  const [filieres, setFilieres]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [showForm, setShowForm]       = useState(false);
  const [editId, setEditId]           = useState(null);
  const [saving, setSaving]           = useState(false);
  const [form, setForm] = useState({ libelle: '', filieres_id: '', description: '' });

  const fetchAll = async () => {
    try {
      const token = getToken();
      const [resS, resF] = await Promise.all([
        fetch('/api/specialites', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/filieres',    { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!resS.ok || !resF.ok) throw new Error('Erreur de chargement');
      setSpecialites(await resS.json());
      setFilieres(await resF.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ libelle: '', filieres_id: '', description: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (s) => {
    setForm({ libelle: s.libelle, filieres_id: String(s.filieres_id), description: s.description || '' });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url    = editId ? `/api/specialites/${editId}` : '/api/specialites';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ...form, filieres_id: parseInt(form.filieres_id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setSuccess(editId ? 'Spécialité modifiée avec succès !' : 'Spécialité ajoutée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
      resetForm();
      fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette spécialité ?')) return;
    try {
      const res = await fetch(`/api/specialites/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setSpecialites(specialites.filter(s => s.id !== id));
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
              <i className="bi bi-mortarboard me-2 text-primary" />
              Spécialités
            </h1>
            <p className="text-muted">Gestion des spécialités ({specialites.length})</p>
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
          <h5 className="fw-bold mb-3">{editId ? 'Modifier la spécialité' : 'Nouvelle spécialité'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Libellé *</label>
                <input type="text" name="libelle" value={form.libelle} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Filière *</label>
                <select name="filieres_id" value={form.filieres_id} onChange={handleChange} className="form-select" required>
                  <option value="">Choisir une filière...</option>
                  {filieres.map(f => (
                    <option key={f.id} value={f.id}>{f.libelle}</option>
                  ))}
                </select>
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
                <tr><th>Libellé</th><th>Filière</th><th>Description</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {specialites.length > 0 ? specialites.map(s => (
                  <tr key={s.id}>
                    <td className="fw-semibold">{s.libelle}</td>
                    <td><span className="badge bg-primary">{s.filiere_libelle || '—'}</span></td>
                    <td>{s.description || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(s)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center text-muted py-4">Aucune spécialité enregistrée</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}