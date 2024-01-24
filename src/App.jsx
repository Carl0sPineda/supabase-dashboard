import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import "./index.css";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
