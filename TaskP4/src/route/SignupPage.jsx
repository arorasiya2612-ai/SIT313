import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import bcrypt from "bcryptjs";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";

import { db } from "../firebase";

import Header from "../Header";
import Footer from "../Footer";

function SignupPage() {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error message
  const [error, setError] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");

    // 1. Check that all fields are filled
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // 2. Validate email
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // 3. Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // 4. Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Get users collection
      const usersRef = collection(db, "users");

      // Check whether email already exists
      const emailQuery = query(
        usersRef,
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        setError("An account with this email already exists.");
        return;
      }

      // Hash the password using bcrypt
      const passwordHash = await bcrypt.hash(password, 10);

      // Store user details in Firestore
      await addDoc(usersRef, {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: passwordHash
      });

      // Redirect to login page
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      setError("Unable to create account. Please try again.");
    }
  };

  return (
    <>
      <Header />

      <main className="signup-page">
        <div className="signup-container">

          <h1>Create Account</h1>

          {error && (
            <p className="form-error">
              {error}
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
              />
            </div>

            <button type="submit">
              Create Account
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