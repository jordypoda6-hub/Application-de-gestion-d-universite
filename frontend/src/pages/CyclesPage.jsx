import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CyclesPage() {
  const { getToken } = useAuth();
  const [cycles, setCycles]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({ libelle: '', duree_annees: '3' });

  const fetchCycles = async () => {
    try {
      const res = await fetch('/api/cycles', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur de chargement');
      setCycles(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCycles(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ libelle: '', duree_annees: '3' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (cycle) => {
    setForm({ libelle: cycle.libelle, duree_annees: String(cycle.duree_annees) });
    setEditId(cycle.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url    = editId ? `/api/cycles/${editId}` : '/api/cycles';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ libelle: form.libelle, duree_annees: parseInt(form.duree_annees) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setSuccess(editId ? 'Cycle modifié avec succès !' : 'Cycle ajouté avec succès !');
      setTimeout(() => setSuccess(''), 3000);
      resetForm();
      fetchCycles();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce cycle ?')) return;
    try {
      const res = await fetch(`/api/cycles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setCycles(cycles.filter(c => c.id !== id));
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
              <i className="bi bi-diagram-3 me-2 text-primary" />
              Cycles
            </h1>
            <p className="text-muted">Gestion des cycles d'études ({cycles.length})</p>
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
          <h5 className="fw-bold mb-3">{editId ? 'Modifier le cycle' : 'Nouveau cycle'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Libellé *</label>
                <input type="text" name="libelle" value={form.libelle} onChange={handleChange} className="form-control" placeholder="Ex: Licence" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Durée (années) *</label>
                <input type="number" name="duree_annees" value={form.duree_annees} onChange={handleChange} className="form-control" min="1" max="10" required />
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
                <tr><th>Libellé</th><th>Durée</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {cycles.length > 0 ? cycles.map(c => (
                  <tr key={c.id}>
                    <td className="fw-semibold">{c.libelle}</td>
                    <td><span className="badge bg-info text-dark">{c.duree_annees} an{c.duree_annees > 1 ? 's' : ''}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(c)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="text-center text-muted py-4">Aucun cycle enregistré</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}