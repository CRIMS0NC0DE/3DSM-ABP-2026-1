import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthenticatedLayout from "./components/Layouts/AuthenticatedLayout";
import { AuthProvider } from "./contexts/AuthContext";
import GaragePage from "./pages/GaragePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import LeadsPage from "./pages/LeadsPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentDetailsPage from "./pages/PaymentDetailsPage";
import PointsPage from "./pages/PointsPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import TransactionsPage from "./pages/TransactionsPage";
import ForgotPassword from "./pages/ForgotPassword";
import SidebarPreviewPage from "./pages/SidebarPreviewPage";
import CollaboratorsPage from "./pages/CollaboratorsPage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pontos" element={<PointsPage />} />
          <Route path="/preview" element={<AuthenticatedLayout />}>
            <Route index element={<SidebarPreviewPage />} />
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/colaboradores" element={<CollaboratorsPage />} />
            <Route path="/garagem" element={<GaragePage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/notificacoes" element={<NotificationsPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="/detalhes-pagamento" element={<PaymentDetailsPage />} />
            <Route path="/transacoes" element={<TransactionsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
