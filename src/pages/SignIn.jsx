import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";

function SignIn() {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const userRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${URL}signin.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pwd }),
      });

      setUser("");
      setPwd("");

      const json = await res.json();

      if (json.success) {
        localStorage.setItem("token", json.token);
        navigate("/", { replace: true });
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        {/* Brand panel */}
        <div className="auth-left">
          <div className="auth-glow" />
          <div className="auth-glow2" />
          <div className="auth-logo-big">
            <img src="logo.jpg" alt="Soynikon Desk Logo" />
          </div>
          <div className="auth-brand">Soynikon Desk</div>
          <div className="auth-tagline">
            Business management for Soynikon Photo Store
          </div>
        </div>

        {/* Sign-in form */}
        <div className="auth-right">
          <form className="auth-form-wrap" onSubmit={handleSubmit}>
            <div className="auth-title">Welcome back</div>
            <div className="auth-sub">Sign in to your account to continue</div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="username">
                Username
              </label>
              <input
                className="auth-input"
                type="text"
                id="username"
                placeholder="your username"
                value={user}
                ref={userRef}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                className="auth-input"
                type="password"
                id="password"
                placeholder="••••••••"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
              />
            </div>

            <button className="dbtn dbtn-warning dbtn-full" type="submit">
              Sign in
            </button>

            <div className="auth-footer-text">
              Demo accounts on{" "}
              <a
                href="https://github.com/gianacevedof/desk.soynikon.do"
                target="_blank"
              >
                <u>GitHub</u>
              </a>
              . Otherwise provisioned by admin.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
