import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedGroup, setExpandedGroup] = useState(null);

  const menuGroups = [
    {
      id: 'accueil',
      type: 'link',
      path: '/',
      label: 'Accueil',
      icon: 'grid',
    },
    {
      id: 'etudiants',
      type: 'group',
      label: 'Gestion des étudiants',
      icon: 'people',
      items: [
        { path: '/ajouter-etudiant',    label: 'Ajouter étudiant',       icon: 'person-plus' },
        { path: '/trombinoscope',       label: 'Trombinoscope',           icon: 'images' },
        { path: '/liste-etudiants',     label: 'Liste des étudiants',     icon: 'people' },
        { path: '/resultats',           label: 'Résultats fin d\'année',  icon: 'file-earmark-text' },
        { path: '/certificats',         label: 'Certificats d\'inscription', icon: 'file-earmark-pdf' },
        { path: '/gestion-inscription', label: 'Gestion inscription',     icon: 'clipboard-check' },
      ],
    },
    {
      id: 'ressources',
      type: 'group',
      label: 'Ressources',
      icon: 'gear',
      items: [
        { path: '/ecoles',           label: 'Écoles',              icon: 'building' },
        { path: '/filieres',         label: 'Filières',            icon: 'book' },
        { path: '/specialites',      label: 'Spécialités',         icon: 'mortarboard' },
        { path: '/niveaux',          label: 'Niveaux',             icon: 'layers' },
        { path: '/cycles',           label: 'Cycles',              icon: 'diagram-3' },
        { path: '/parcours',         label: 'Parcours',            icon: 'signpost' },
        { path: '/pays',             label: 'Pays',                icon: 'globe' },
        { path: '/annee-academique', label: 'Années académiques',  icon: 'calendar' },
        { path: '/civilites',        label: 'Civilités',           icon: 'tag' },
        { path: '/decisions',        label: 'Décisions',           icon: 'check-circle' },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;
  const isGroupExpanded = (groupId) => expandedGroup === groupId;

  const toggleGroup = (groupId) => {
    setExpandedGroup(isGroupExpanded(groupId) ? null : groupId);
  };

  const handleLogout = () => logout();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className="bi bi-building"></i>
        <span>Gestion 2iE</span>
      </div>

      <nav className="sidebar-nav">
        {menuGroups.map((group) => {
          if (group.type === 'link') {
            return (
              <Link
                key={group.id}
                to={group.path}
                className={`nav-item ${isActive(group.path) ? 'active' : ''}`}
              >
                <i className={`bi bi-${group.icon}`}></i>
                <span>{group.label}</span>
              </Link>
            );
          } else if (group.type === 'group') {
            const isExpanded = isGroupExpanded(group.id);
            return (
              <div key={group.id} className="nav-group">
                <button
                  className={`nav-group-toggle ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleGroup(group.id)}
                >
                  <i className={`bi bi-${group.icon}`}></i>
                  <span>{group.label}</span>
                  <i className="bi bi-chevron-right toggle-icon"></i>
                </button>
                {isExpanded && (
                  <div className="nav-group-items">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-subitem ${isActive(item.path) ? 'active' : ''}`}
                      >
                        <i className={`bi bi-${item.icon}`}></i>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.nom?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.nom}</div>
            <div className="user-role">{user?.role || 'Utilisateur'}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout} title="Déconnexion">
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
