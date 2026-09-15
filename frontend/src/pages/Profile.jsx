import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/dashboard.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [editing, setEditing] = useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        "access_token"
      )}`,
    },
  });


  const fetchUser = async () => {
    try {
      const response = await api.get(
        "/users/me",
        getConfig()
      );

      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);

    } catch (error) {
      console.error(error);

      navigate("/login");
    }
  };


  useEffect(() => {
    fetchUser();
  }, []);


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
        },
        getConfig()
      );

      setUser(response.data);

      setEditing(false);

      setMessage(
        "Cập nhật hồ sơ thành công"
      );

    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Cập nhật thất bại"
      );
    }
  };


  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError(
        "Mật khẩu xác nhận không khớp"
      );

      return;
    }

    try {
      await api.put(
        "/users/me/password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        getConfig()
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Đổi mật khẩu thành công"
      );

    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Đổi mật khẩu thất bại"
      );
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/login");
  };


  return (
    <div className="dashboard-page">

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


      <main className="dashboard-main">

        <header
          className="dashboard-header profile-header"
        >

          <div>

            <p className="hello-text">
              👤 Tài khoản
            </p>

            <h1>
              Hồ sơ của tôi
            </h1>

            <p className="header-subtitle">
              Quản lý thông tin tài khoản của bạn
            </p>

          </div>

        </header>


        {message && (
          <div className="profile-message success">
            ✅ {message}
          </div>
        )}


        {error && (
          <div className="profile-message error">
            ⚠️ {error}
          </div>
        )}


        <section className="task-form-card profile-card">

          <div className="profile-avatar-section">

            <div className="profile-avatar">
              👤
            </div>

            <h2>
              {user?.username}
            </h2>

            <p>
              Thành viên TaskFlow
            </p>

          </div>


          <form
            onSubmit={handleUpdateProfile}
            className="task-form"
          >

            <div className="form-group">

              <label>
                Tên người dùng
              </label>

              <input
                value={username}
                disabled={!editing}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                disabled={!editing}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>


            {!editing ? (

              <button
                type="button"
                className="save-button"
                onClick={() =>
                  setEditing(true)
                }
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
                  onClick={() => {

                    setUsername(
                      user.username
                    );

                    setEmail(
                      user.email
                    );

                    setEditing(false);
                  }}
                >
                  Hủy
                </button>

              </div>

            )}

          </form>

        </section>


        <section className="task-form-card profile-card password-card">

          <h2>
            🔐 Đổi mật khẩu
          </h2>

          <p className="password-description">
            Đảm bảo tài khoản của bạn luôn an toàn
          </p>


          <form
            onSubmit={handleChangePassword}
            className="task-form"
          >

            <div className="form-group">

              <label>
                Mật khẩu hiện tại
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Mật khẩu mới
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Xác nhận mật khẩu mới
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <button
              className="change-password-button"
              type="submit"
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