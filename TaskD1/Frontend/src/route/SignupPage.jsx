
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";

function SignupPage() {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // 1. Check required fields
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // 2. Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // 3. Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // 4. Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // 5. Send registration details to the backend
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword
        })
      });

      // 6. Read the backend response
      const data = await response.json();

      // 7. Display backend validation errors
      if (!response.ok) {
        setError(data.message || "Unable to create account.");
        return;
      }

      // 8. Registration successful
      setSuccess(
        data.message || "Account created successfully!"
      );

      // 9. Clear form fields
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // 10. Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error("Signup error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="signup-page">
        <div className="signup-container">

          <h1>Create Account</h1>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p role="status">
              {success}
            </p>
          )}

          <form
            className="signup-form"
            onSubmit={handleSignup}
          >

            <div className="form-row">
              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                autoComplete="name"
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p>
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default SignupPage;
