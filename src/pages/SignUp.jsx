import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{1,24}$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$*&-])[a-zA-Z0-9!@#$*&-]{8,25}$/;

function SignUp() {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const userRef = useRef();

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUser(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validUser || !validPwd) {
      toast.error("Invalid Entry");
      return;
    }

    try {
      const res = await fetch(`${URL}signup.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pwd }),
      });

      const json = await res.json();

      if (json.success) {
        navigate("/signin", { replace: true });
        toast.success(json.message);
      } else {
        toast.error(json.message);
        console.log(json.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-left">
          <div className="auth-glow" />
          <div className="auth-glow2" />
          <div className="auth-logo-big">
            <span>
              SOY
              <br />
              NIK
            </span>
          </div>
          <div className="auth-brand">Soynikon Desk</div>
          <div className="auth-tagline">
            Business management for Soynikon Photo Store
          </div>
        </div>

        <div className="auth-right">
          <form className="auth-form-wrap" onSubmit={handleSubmit}>
            <div className="auth-title">Create account</div>
            <div className="auth-sub">Register to access Soynikon Desk</div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="username">
                Username
              </label>
              <input
                className="auth-input"
                type="text"
                id="username"
                placeholder="choose a username"
                value={user}
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                required
              />
              {!validUser && user && (
                <p className="auth-input-err">
                  <FontAwesomeIcon icon={faCircleInfo} /> Must be 2-25
                  characters long and begin with a letter — numbers,
                  underscores, hyphens allowed.
                </p>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                className="auth-input"
                type="password"
                id="password"
                placeholder="min. 8 characters"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
              />
              {!validPwd && pwd && (
                <p className="auth-input-err">
                  <FontAwesomeIcon icon={faCircleInfo} /> Must be 8-25
                  characters long — include uppercase and lowercase letters, a
                  number, and a special character (!@#$*&-)
                </p>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm_pwd">
                Confirm password
              </label>
              <input
                className="auth-input"
                type="password"
                id="confirm_pwd"
                placeholder="repeat your password"
                value={matchPwd}
                onChange={(e) => setMatchPwd(e.target.value)}
                required
              />
              {!validMatch && matchPwd && (
                <p className="auth-input-err">
                  <FontAwesomeIcon icon={faCircleInfo} /> Must match the first
                  password input field
                </p>
              )}
            </div>

            <button
              className="auth-btn"
              type="submit"
              disabled={!validUser || !validPwd || !validMatch}
            >
              Create account
            </button>

            <div className="auth-footer-text">
              Already have an account? <Link to="/signin">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
