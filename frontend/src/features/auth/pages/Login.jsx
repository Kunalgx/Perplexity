import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const authError = useSelector((state) => state.auth.error);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const registered = searchParams.get("registered");
  const verificationMessage = searchParams.get("message");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setSubmitted(false);
    setStatusMessage("");
    setIsError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    const result = await handleLogin(formData);

    if (result.success) {
      navigate("/", { replace: true });
      return;
    }

    setStatusMessage(result.message || authError || "Invalid email or password.");
    setIsError(true);
  };

  const verified = searchParams.get("verified");

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4 py-10 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.24),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.28),transparent_42%)]" />
      <section className="relative w-full max-w-md rounded-3xl border border-red-950/70 bg-zinc-950/80 p-8 shadow-2xl shadow-red-950/30 backdrop-blur-xl sm:p-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-400">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sign in to your account</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Continue where you left off with your workspace.</p>
        </div>

        {(registered === "1" || verified === "1" || verified === "0") && (
          <p className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
            verified === "1"
              ? "border-emerald-700/40 bg-emerald-950/30 text-emerald-300"
              : "border-red-700/40 bg-red-950/30 text-red-300"
          }`}>
            {registered === "1"
              ? verificationMessage || "Registration successful. Please verify your email before logging in."
              : verified === "1"
                ? "Email verified successfully. Please sign in."
                : verificationMessage || "Email verification failed or the link has expired."}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-zinc-300" htmlFor="login-email">
            Email
            <input
              id="login-email"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="block text-sm font-medium text-zinc-300" htmlFor="login-password">
            Password
            <input
              id="login-password"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <button className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition hover:from-red-500 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-zinc-950" type="submit">
            Sign in
          </button>
        </form>

        {submitted && statusMessage && (
          <p className={`mt-5 text-center text-sm ${isError ? "text-red-300" : "text-emerald-300"}`}>
            {statusMessage}
          </p>
        )}

        <p className="mt-8 text-center text-sm text-zinc-500">
          New here? <Link className="font-semibold text-red-400 hover:text-red-300" to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
