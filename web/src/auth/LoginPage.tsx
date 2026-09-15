import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getErrorMessage } from "../api/errors";
import loginImage from "../assets/login-gym.webp";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const role = await login(email, password);
      navigate(role === "ADMIN" ? "/" : "/members", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Correo o contraseña incorrectos."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr]">
      {/* Panel del formulario — disco de 15kg */}
      <div className="flex items-center justify-center px-6 py-16 bg-plate-yellow">
        <div className="w-full max-w-sm">
          <span className="font-stamp text-3xl font-semibold tracking-wide text-iron-950">
            GYMFLOW
          </span>
          <p className="mt-1 mb-10 text-sm text-iron-950">
            Gestión de socios, membresías e inventario
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-iron-950">
                Correo
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-white border-2 border-iron-950/10 px-3 text-sm rounded-sm
                           text-iron-950 placeholder:text-iron-400
                           focus:border-iron-950 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-iron-950">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-white border-2 border-iron-950/10 px-3 text-sm rounded-sm
                           text-iron-950 placeholder:text-iron-400
                           focus:border-iron-950 focus:outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="border-l-2 border-plate-red bg-white px-3 py-2 text-sm text-iron-950">
                {error}
              </p>
            )}

            {/* Botón negro — el "aro" del disco de 15kg */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-iron-950 text-white text-sm font-medium rounded-sm
                         hover:bg-iron-700 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>

      {/* Panel de la foto, sin cambios */}
      <div className="hidden lg:block relative bg-iron-950">
        <img
          src={loginImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      </div>
    </div>
  );
}