import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setToken } from "../api";

export default function Register({ onRegister }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");

  async function register(e) {
    e.preventDefault();
    await API.post("/auth/register", {
      username,
      password,
      email: email || undefined,
      phone: phone || undefined,
      age: age ? Number(age) : undefined,
    });
    // auto-login
    const res = await API.post("/auth/login", { username, password });
    const { token } = res.data;
    setToken(token);
    onRegister(token);
    navigate("/stations");
  }

  return (
    <div className="card">
      <h3>Register</h3>
      <form onSubmit={register}>
        <div>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="age (optional)"
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
