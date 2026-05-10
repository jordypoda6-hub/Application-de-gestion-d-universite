import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider }       from './context/AuthContext';
import ProtectedRoute         from './components/ProtectedRoute';
import MainLayout             from './components/MainLayout';
import LoginPage              from './pages/LoginPage';
import Dashboard              from './pages/Dashboard';
import AccueilPage            from './pages/AccueilPage';
import AjouterEtudiantPage    from './pages/AjouterEtudiantPage';
import TrombinoscapePage      from './pages/TrombinoscapePage';
import ListeEtudiantsPage     from './pages/ListeEtudiantsPage';
import ResultatsPage          from './pages/ResultatsPage';
import CertificatsPage        from './pages/CertificatsPage';
import GestionInscriptionPage from './pages/GestionInscriptionPage';
import EcolesPage             from './pages/EcolesPage';
import FilieresPage           from './pages/FilieresPage';
import AjouterEcolePage       from './pages/AjouterEcolePage';
import CyclesPage             from './pages/CyclesPage';
import SpecialitesPage        from './pages/SpecialitesPage';
import NiveauxPage            from './pages/NiveauxPage';
import CivilitesPage          from './pages/CivilitesPage';
import PaysPage               from './pages/PaysPage';
import DecisionsPage          from './pages/DecisionsPage';
import AnneeAcademiquePage    from './pages/AnneeAcademiquePage';
import ParcoursPage           from './pages/ParcoursPage';

function SidebarLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route element={<SidebarLayout />}>
              <Route path="/"                    element={<AccueilPage />} />
              <Route path="/ajouter-etudiant"    element={<AjouterEtudiantPage />} />
              <Route path="/trombinoscope"       element={<TrombinoscapePage />} />
              <Route path="/liste-etudiants"     element={<ListeEtudiantsPage />} />
              <Route path="/resultats"           element={<ResultatsPage />} />
              <Route path="/certificats"         element={<CertificatsPage />} />
              <Route path="/gestion-inscription" element={<GestionInscriptionPage />} />
              <Route path="/ecoles"              element={<EcolesPage />} />
              <Route path="/filieres"            element={<FilieresPage />} />
              <Route path="/ajouter-ecole"       element={<AjouterEcolePage />} />
              <Route path="/cycles"              element={<CyclesPage />} />
              <Route path="/specialites"         element={<SpecialitesPage />} />
              <Route path="/niveaux"             element={<NiveauxPage />} />
              <Route path="/civilites"           element={<CivilitesPage />} />
              <Route path="/pays"                element={<PaysPage />} />
              <Route path="/decisions"           element={<DecisionsPage />} />
              <Route path="/annee-academique"    element={<AnneeAcademiquePage />} />
              <Route path="/parcours"            element={<ParcoursPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
