import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import User from "./User";
import Profile from "./Profile";
import HeroPage from "../pages/HeroPage";

const Dashboard = () => {
  let year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="p-4 xl:ml-80">
        <Routes>
          <Route path="/user" element={<User />} />
          <Route path="/ejemplo" element={<Profile />} />
          <Route path="/" element={<HeroPage />} />
        </Routes>
        <div className="mt-12 text-blue-gray-600">
          <footer className="py-2">
            <p className="block antialiased text-center font-sans text-sm leading-normal font-normal text-inherit">
              © {year}, Sistema Contable v1.0.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
