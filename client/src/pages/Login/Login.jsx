import React, { useState } from "react";
import { loginUser } from "../../services/authApi.js";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      await loginUser(formData);
      setStatus("success");
    } catch (loginError) {
      setError(loginError.message);
      setStatus("error");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="auth-panel__eyebrow">Welcome back</p>
        <h1>Log in to QuestLog</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="auth-form__error">{error}</p>}
          {status === "success" && (
            <p className="auth-form__success">You are logged in.</p>
          )}

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Logging in" : "Log in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;