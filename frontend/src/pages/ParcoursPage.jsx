import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ParcoursPage() {
  const { getToken } = useAuth();
  const [parcours, setParcours]     = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [niveaux, setNiveaux]       = useState([]);
  const [cycles, setCycles]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [saving, setSaving]         = useState(false);
  const [form, setForm] = useState({ libelle: '', specialites_id: '', niveaux_id: '', cycles_id: '' });

  const fetchAll = async () => {
    try {
      const token = getToken();
      const [resP, resS, resN, resC] = await Promise.all([
        fetch('/api/parcours',    { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/specialites', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/niveaux',     { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/cycles',      { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!resP.ok) throw new Error('Erreur de chargement');
      setParcours(await resP.json());
      setSpecialites(await resS.json());
      setNiveaux(await resN.json());
      setCycles(await resC.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ libelle: '', specialites_id: '', niveaux_id: '', cycles_id: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setForm({
      libelle:        p.libelle,
      specialites_id: String(p.specialites_id),
      niveaux_id:     String(p.niveaux_id),
      cycles_id:      p.cycles_id ? String(p.cycles_id) : '',
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url    = editId ? `/api/parcours/${editId}` : '/api/parcours';
      const method = editId ? 'PUT' : 'POST';
      const payload = {
        libelle:        form.libelle,
        specialites_id: parseInt(form.specialites_id),
        niveaux_id:     parseInt(form.niveaux_id),
        cycles_id:      form.cycles_id ? parseInt(form.cycles_id) : null,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setSuccess(editId ? 'Parcours modifié avec succès !' : 'Parcours ajouté avec succès !');
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
    if (!confirm('Supprimer ce parcours ?')) return;
    try {
      const res = await fetch(`/api/parcours/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setParcours(parcours.filter(p => p.id !== id));
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
              <i className="bi bi-signpost me-2 text-primary" />
              Parcours
            </h1>
            <p className="text-muted">Gestion des parcours d'études ({parcours.length})</p>
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
          <h5 className="fw-bold mb-3">{editId ? 'Modifier le parcours' : 'Nouveau parcours'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label">Libellé *</label>
                <input type="text" name="libelle" value={form.libelle} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Spécialité *</label>
                <select name="specialites_id" value={form.specialites_id} onChange={handleChange} className="form-select" required>
                  <option value="">Choisir...</option>
                  {specialites.map(s => <option key={s.id} value={s.id}>{s.libelle}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Niveau *</label>
                <select name="niveaux_id" value={form.niveaux_id} onChange={handleChange} className="form-select" required>
                  <option value="">Choisir...</option>
                  {niveaux.map(n => <option key={n.id} value={n.id}>{n.libelle}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Cycle</label>
                <select name="cycles_id" value={form.cycles_id} onChange={handleChange} className="form-select">
                  <option value="">Aucun</option>
                  {cycles.map(c => <option key={c.id} value={c.id}>{c.libelle}</option>)}
                </select>
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
                <tr><th>Libellé</th><th>Spécialité</th><th>Niveau</th><th>Cycle</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {parcours.length > 0 ? parcours.map(p => (
                  <tr key={p.id}>
                    <td className="fw-semibold">{p.libelle}</td>
                    <td>{p.specialite_libelle || '—'}</td>
                    <td><span className="badge bg-primary">{p.niveau_libelle || '—'}</span></td>
                    <td>{p.cycle_libelle || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="text-center text-muted py-4">Aucun parcours enregistré</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}