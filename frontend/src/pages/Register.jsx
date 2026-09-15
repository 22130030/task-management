import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      setMessage("Đăng ký thành công");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Đăng ký thất bại"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Đăng ký</h1>

        <p className="auth-subtitle">
          Tạo tài khoản để quản lý công việc của bạn
        </p>

        {message && (
          <div className="auth-message auth-success">
            {message}
          </div>
        )}

        {error && (
          <div className="auth-message auth-error">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              placeholder="Nhập username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            Đăng ký
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản?{" "}
          <Link to="/login">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;