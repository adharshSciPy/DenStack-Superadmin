import { useState } from "react";
import { Heart, User, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/slice/authSlice";
import { useAppDispatch } from "../../redux/hooks";

export default function SuperadminLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Use your superadmin login endpoint
      const res = await axios.post("http://localhost:8001/api/v1/auth/super-admin/login", {
        email,
        password,
      });

      if (res.status === 200) {
        console.log("✅ Superadmin login success:", res.data);

        localStorage.clear();
        sessionStorage.clear();

        // Save user info to Redux
        dispatch(
          loginSuccess({
            user: res.data.superadmin,
            token: res.data.accessToken,
          })
        );

        // Navigate to superadmin dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ Superadmin login failed:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Invalid credentials");
      } else {
        alert("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-9 bg-primary rounded-lg mb-4">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Superadmin Portal
          </h1>
          <p className="text-sm text-muted-foreground mb-3">
            DenStack — Dental Network Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-4 mb-4 mt-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground mb-2 flex"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-muted-foreground">
                    <User className="w-full h-full mt-2" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-20 p-2 bg-input-background border border-border rounded-lg pl-10 py-4 px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring transition-colors"
                    placeholder="superadmin@denstack.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground mb-2 flex"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-muted-foreground">
                    <Lock className="w-full h-full mt-2" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-20 p-2 bg-input-background border border-border rounded-lg pl-10 py-3 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-20 p-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
