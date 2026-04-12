import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AuthenticatedLayout from "./components/Layouts/AuthenticatedLayout";
import { AuthProvider } from "./contexts/AuthContext";
import GaragePage from "./pages/GaragePage";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import LeadsPage from "./pages/LeadsPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentDetailsPage from "./pages/PaymentDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import TransactionsPage from "./pages/TransactionsPage";
import ForgotPassword from "./pages/ForgotPassword";
import PointsPage from "./pages/PointsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/garagem" element={<GaragePage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/notificacoes" element={<NotificationsPage />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
              <Route path="/detalhes-pagamento" element={<PaymentDetailsPage />} />
              <Route path="/transacoes" element={<TransactionsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AuthenticatedLayout from "./components/Layouts/AuthenticatedLayout";
import { AuthProvider } from "./contexts/AuthContext";
import GaragePage from "./pages/GaragePage";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import LeadsPage from "./pages/LeadsPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentDetailsPage from "./pages/PaymentDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import TransactionsPage from "./pages/TransactionsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/garagem" element={<GaragePage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/notificacoes" element={<NotificationsPage />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
              <Route path="/detalhes-pagamento" element={<PaymentDetailsPage />} />
              <Route path="/transacoes" element={<TransactionsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

