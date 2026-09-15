import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const {
        access_token,
        refresh_token,
      } = response.data;

      localStorage.setItem(
        "access_token",
        access_token
      );

      localStorage.setItem(
        "refresh_token",
        refresh_token
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Đăng nhập thất bại"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Đăng nhập</h1>

        <p className="auth-subtitle">
          Chào mừng bạn quay trở lại
        </p>

        {error && (
          <div className="auth-message auth-error">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit">
            Đăng nhập
          </button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản?{" "}
          <Link to="/register">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;