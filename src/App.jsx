import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
