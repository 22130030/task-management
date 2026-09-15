import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/auth.css";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    /*
      Xóa token cũ trước khi login.

      Ví dụ:
      - access token cũ đã hết hạn
      - refresh token cũ không còn hợp lệ

      Nếu không xóa, axios interceptor có thể
      cố refresh token trong lúc đang login.
    */
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: email.trim(),
          password,
        }
      );


      const {
        access_token,
        refresh_token,
      } = response.data;


      // Kiểm tra backend có trả token không
      if (!access_token || !refresh_token) {
        setError(
          "Server không trả về token đăng nhập"
        );

        return;
      }


      // Lưu access token
      localStorage.setItem(
        "access_token",
        access_token
      );


      // Lưu refresh token
      localStorage.setItem(
        "refresh_token",
        refresh_token
      );


      // Login thành công
      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (err) {

      console.error(
        "Login error:",
        err
      );


      const detail =
        err.response?.data?.detail;


      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Email hoặc mật khẩu không chính xác"
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
          Đăng nhập
        </h1>


        <p className="auth-subtitle">
          Chào mừng bạn quay trở lại
        </p>


        {/* ERROR */}

        {error && (
          <div
            className="
              auth-message
              auth-error
            "
          >
            ⚠️ {error}
          </div>
        )}


        {/* LOGIN FORM */}

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

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
                setEmail(e.target.value)
              }
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Mật khẩu
            </label>

            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              autoComplete="current-password"
              required
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"
            }

          </button>

        </form>


        {/* REGISTER */}

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