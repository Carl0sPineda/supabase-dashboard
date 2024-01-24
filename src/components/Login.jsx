import { useState } from "react";
import toast from "react-hot-toast";
import supabase from "../lib/Supabase";
import login_img from "../assets/login-img.avif";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error("Credenciales incorrectas!!");
      } else {
        navigate("/dashboard");
        toast.success("Inicio de sesión con éxito!");
      }
    } catch (error) {
      toast.error("Credenciales incorrectas!!");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        {/* Left: Image */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src={login_img}
            alt="Placeholder Image"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right: Login Form */}
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h2 className="text-center text-2xl sm:text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Inicio de sesión
          </h2>
          <form className="space-y-6 mt-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Correo
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="andres@gmail.com"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="on"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  name="password"
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Contraseña
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="on"
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleLogin}
                className="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
