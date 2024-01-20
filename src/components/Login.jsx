import { useState } from "react";
import toast from "react-hot-toast";
import supabase from "../lib/Supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(
          "Credenciales incorrectas. Verifica tu email o contraseña."
        );
      } else {
        toast.success("Inicio de sesión con éxito!");
      }
    } catch (error) {
      toast.error("Credenciales incorrectas. Verifica tu email o contraseña.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Correo:{" "}
        <input
          className="border border-gray-300 rounded-md"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Contraseña:{" "}
        <input
          className="border border-gray-300 rounded-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit" className="bg-black text-white px-5 py-2">
        Inicia sesión
      </button>
    </form>
  );
};

export default Login;
