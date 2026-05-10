export default function PaysPage() {
  return (
    <div>
      <div className="page-header mb-4">
        <h1 className="fw-bold mb-2">
          <i className="bi bi-globe me-2 text-primary" />
          Pays
        </h1>
        <p className="text-muted">Gestion des pays</p>
      </div>

      <div className="card shadow-sm p-5 text-center">
        <div className="mb-4">
          <i className="bi bi-inbox" style={{ fontSize: '64px', color: '#999' }}></i>
        </div>
        <h5 className="text-muted mb-2">Aucune donnée disponible</h5>
        <p className="text-muted mb-0">
          Cette section sera développée prochainement.
        </p>
      </div>
    </div>
  );
}
