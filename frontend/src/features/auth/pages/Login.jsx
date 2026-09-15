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
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [errorAnimationKey, setErrorAnimationKey] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.loading);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const registered = searchParams.get("registered");

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));

    // Clear error for this field as user types after submission
    if (hasSubmitted) {
      const newErrors = { ...fieldErrors };
      if (name === "email") {
        newErrors.email = validateEmail(value);
      } else if (name === "password") {
        newErrors.password = validatePassword(value);
      }
      setFieldErrors(newErrors);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHasSubmitted(true);

    // Validate fields
    const errors = {};
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);

    setFieldErrors(errors);

    // If validation fails, don't submit
    if (errors.email || errors.password) {
      return;
    }

    // Clear auth error before attempting login
    setAuthError("");

    const result = await handleLogin(formData);

    if (result.success) {
      navigate("/", { replace: true });
      return;
    }

    // Show authentication error (safe generic message from backend)
    setAuthError(result.message || "Invalid email or password.");
    setErrorAnimationKey((prev) => prev + 1);
  };

  // Reset form errors when component unmounts or navigates away
  const resetForm = () => {
    setFieldErrors({});
    setAuthError("");
    setHasSubmitted(false);
  };

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

        {registered === "1" && (
          <p className="mb-4 rounded-xl border border-emerald-700/40 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-300">
            Registration successful. Please sign in.
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-zinc-300" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className={`mt-2 w-full rounded-xl border bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-zinc-800 focus:border-red-500 focus:ring-red-500/20"
              }`}
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className={`mt-2 w-full rounded-xl border bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                fieldErrors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-zinc-800 focus:border-red-500 focus:ring-red-500/20"
              }`}
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
            )}
          </div>

          <button
            className={`w-full rounded-xl px-4 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
              isLoading
                ? "cursor-not-allowed bg-red-700/70 from-red-700 to-rose-600 hover:from-red-700 hover:to-rose-600"
                : "bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {authError && (
          <div
            key={errorAnimationKey}
            className="mt-5 animate-in fade-in-50 slide-in-from-top-1 text-center"
          >
            <p className="rounded-lg bg-red-950/40 border border-red-700/50 px-3 py-2 text-sm text-red-300">
              {authError}
            </p>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-zinc-500">
          New here? <Link className="font-semibold text-red-400 hover:text-red-300" to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
