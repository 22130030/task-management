import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/dashboard.css";


function Profile() {
  const navigate = useNavigate();

  // =========================
  // USER
  // =========================

  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [editing, setEditing] = useState(false);


  // =========================
  // PASSWORD
  // =========================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // =========================
  // MESSAGE
  // =========================

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // =========================
  // GET CURRENT USER
  // =========================

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");

      setUser(response.data);

      setUsername(
        response.data.username
      );

      setEmail(
        response.data.email
      );

    } catch (error) {
      console.error(
        "Lỗi lấy thông tin user:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Không thể tải thông tin tài khoản"
      );
    }
  };


  useEffect(() => {
    fetchUser();
  }, []);


  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.put(
        "/users/me",
        {
          username,
          email,
        }
      );

      setUser(response.data);

      setUsername(
        response.data.username
      );

      setEmail(
        response.data.email
      );

      setEditing(false);

      setMessage(
        "Cập nhật hồ sơ thành công"
      );

    } catch (error) {
      console.error(
        "Lỗi cập nhật profile:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Cập nhật thất bại"
      );
    }
  };


  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");


    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Vui lòng nhập đầy đủ thông tin mật khẩu"
      );

      return;
    }


    if (newPassword.length < 6) {
      setError(
        "Mật khẩu mới phải có ít nhất 6 ký tự"
      );

      return;
    }


    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Mật khẩu xác nhận không khớp"
      );

      return;
    }


    try {
      await api.put(
        "/users/me/password",
        {
          current_password:
            currentPassword,

          new_password:
            newPassword,
        }
      );


      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");


      setMessage(
        "Đổi mật khẩu thành công"
      );

    } catch (error) {
      console.error(
        "Lỗi đổi mật khẩu:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Đổi mật khẩu thất bại"
      );
    }
  };


  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    if (!user) {
      return;
    }

    setUsername(
      user.username
    );

    setEmail(
      user.email
    );

    setEditing(false);

    setError("");
  };


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    navigate("/login");
  };


  // =========================
  // UI
  // =========================

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div>

          <div className="logo">
            ✦ TaskFlow
          </div>


          <nav>

            <button
              className="menu-item"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              🏠 Tổng quan
            </button>


            <button
              className="menu-item"
              onClick={() =>
                navigate("/tasks")
              }
            >
              ✅ Công việc
            </button>


            <button
              className="menu-item active"
              onClick={() =>
                navigate("/profile")
              }
            >
              👤 Hồ sơ
            </button>

          </nav>

        </div>


        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>

      </aside>


      {/* MAIN */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header
          className="
            dashboard-header
            profile-header
          "
        >

          <div>

            <p className="hello-text">
              👤 Tài khoản
            </p>

            <h1>
              Hồ sơ của tôi
            </h1>

            <p className="header-subtitle">
              Quản lý thông tin tài khoản
              của bạn
            </p>

          </div>

        </header>


        {/* SUCCESS MESSAGE */}

        {message && (

          <div
            className="
              profile-message
              success
            "
          >
            ✅ {message}
          </div>

        )}


        {/* ERROR MESSAGE */}

        {error && (

          <div
            className="
              profile-message
              error
            "
          >
            ⚠️ {error}
          </div>

        )}


        {/* PROFILE CARD */}

        <section
          className="
            task-form-card
            profile-card
          "
        >

          <div className="profile-avatar-section">

            <div className="profile-avatar">
              👤
            </div>

            <h2>
              {user?.username ||
                "Người dùng"}
            </h2>

            <p>
              Thành viên TaskFlow
            </p>

          </div>


          <form
            className="task-form"
            onSubmit={
              handleUpdateProfile
            }
          >

            {/* USERNAME */}

            <div className="form-group">

              <label>
                Tên người dùng
              </label>

              <input
                type="text"
                value={username}
                disabled={!editing}
                required
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                disabled={!editing}
                required
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

            </div>


            {/* BUTTONS */}

            {!editing ? (

              <button
                type="button"
                className="save-button"
                onClick={() => {
                  setEditing(true);
                  setMessage("");
                  setError("");
                }}
              >
                ✏️ Chỉnh sửa hồ sơ
              </button>

            ) : (

              <div className="profile-actions">

                <button
                  type="submit"
                  className="save-button"
                >
                  💾 Lưu thay đổi
                </button>


                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    handleCancelEdit
                  }
                >
                  Hủy
                </button>

              </div>

            )}

          </form>

        </section>


        {/* PASSWORD CARD */}

        <section
          className="
            task-form-card
            profile-card
            password-card
          "
        >

          <h2>
            🔐 Đổi mật khẩu
          </h2>

          <p className="password-description">
            Đảm bảo tài khoản của bạn
            luôn an toàn
          </p>


          <form
            className="task-form"
            onSubmit={
              handleChangePassword
            }
          >

            {/* CURRENT PASSWORD */}

            <div className="form-group">

              <label>
                Mật khẩu hiện tại
              </label>

              <input
                type="password"
                value={currentPassword}
                placeholder="Nhập mật khẩu hiện tại"
                required
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
              />

            </div>


            {/* NEW PASSWORD */}

            <div className="form-group">

              <label>
                Mật khẩu mới
              </label>

              <input
                type="password"
                value={newPassword}
                placeholder="Nhập mật khẩu mới"
                required
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>
                Xác nhận mật khẩu mới
              </label>

              <input
                type="password"
                value={confirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                required
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

            </div>


            <button
              type="submit"
              className="
                change-password-button
              "
            >
              🔐 Đổi mật khẩu
            </button>

          </form>

        </section>

      </main>

    </div>
  );
}


export default Profile;