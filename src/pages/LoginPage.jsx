import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client"; // Use your configured axios client
import Navbar from "../shared/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call your backend /auth/login route via your API client
      // Note: adjust the path if your login endpoint is mounted differently (e.g., /api/auth/login)
      const response = await api.post("/auth/login", { email, password });

      if (response.data && response.data.user) {
        // Save auth state in localStorage
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("userRole", response.data.user.role);

        // Navigate to the admin panel
        navigate("/admin");
      }
    } catch (err) {
      // Catch backend errors (e.g., 400, 401, etc.)
      const errorMessage =
        err.response?.data?.error ||
        "Failed to log in. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-gray-600 mb-6">
            Enter your credentials to access the archive creation tools.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 font-bold uppercase tracking-wide rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
