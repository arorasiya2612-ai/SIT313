import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import bcrypt from "bcryptjs";

import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase";

import Header from "../Header";
import Footer from "../Footer";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    // 1. Check fields
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // 2. Check email format
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // 3. Get users collection
      const usersRef = collection(db, "users");

      // 4. Find user using email
      const emailQuery = query(
        usersRef,
        where("email", "==", email.trim().toLowerCase())
      );

      const querySnapshot = await getDocs(emailQuery);

      // 5. Email doesn't exist
      if (querySnapshot.empty) {
        setError(
          "No account found with this email. Please sign up."
        );
        return;
      }

      // 6. Get the user's data
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // 7. Compare entered password with stored bcrypt hash
      const passwordMatch = await bcrypt.compare(
        password,
        userData.passwordHash
      );

      // 8. Wrong password
      if (!passwordMatch) {
        setError(
          "Incorrect password. Please try again."
        );
        return;
      }

      // 9. Successful login
      navigate("/");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the database. Please try again."
      );
    }
  };

  return (
    <>
      <Header />

      <main className="login-page">
        <div className="login-container">

          <h1>Login Page</h1>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

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

            <button type="submit">
              Login
            </button>

          </form>

          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              Sign Up
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default LoginPage;