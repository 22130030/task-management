import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/auth.css";


function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post(
        "/auth/register",
        {
          username: username.trim(),
          email: email.trim(),
          password,
        }
      );

      setMessage(
        "Đăng ký thành công"
      );

      setTimeout(() => {
        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }, 800);

    } catch (err) {
      console.error(
        "Register error:",
        err
      );

      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Đăng ký thất bại"
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Đăng ký
        </h1>

        <p className="auth-subtitle">
          Tạo tài khoản để quản lý công việc của bạn
        </p>


        {message && (
          <div className="auth-message auth-success">
            ✅ {message}
          </div>
        )}


        {error && (
          <div className="auth-message auth-error">
            ⚠️ {error}
          </div>
        )}


        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          <div className="form-group">

            <label>
              Tên người dùng
            </label>

            <input
              type="text"
              placeholder="Nhập username"
              value={username}
              autoComplete="username"
              required
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              autoComplete="email"
              required
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Mật khẩu
            </label>

            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              autoComplete="new-password"
              required
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </div>


          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Đang đăng ký..."
              : "Đăng ký"
            }
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