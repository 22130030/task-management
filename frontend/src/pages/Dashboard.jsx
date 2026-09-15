import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
  });

  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  const fetchUser = async () => {
    const response = await api.get(
      "/users/me",
      authConfig()
    );

    setUser(response.data);
  };

  const fetchTasks = async () => {
    const response = await api.get(
      "/tasks",
      authConfig()
    );

    setTasks(response.data);
  };

  const loadData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchUser(),
        fetchTasks(),
      ]);
    } catch (error) {
      console.error(error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statistics = useMemo(() => {
    return {
      total: tasks.length,

      todo: tasks.filter(
        (task) => task.status === "TODO"
      ).length,

      doing: tasks.filter(
        (task) => task.status === "IN_PROGRESS"
      ).length,

      done: tasks.filter(
        (task) => task.status === "DONE"
      ).length,
    };
  }, [tasks]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
    });

    setEditingTask(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await api.put(
          `/tasks/${editingTask.id}`,
          formData,
          authConfig()
        );
      } else {
        await api.post(
          "/tasks",
          formData,
          authConfig()
        );
      }

      resetForm();
      await fetchTasks();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Có lỗi xảy ra"
      );
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
    });

    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc muốn xóa công việc này?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await api.delete(
        `/tasks/${taskId}`,
        authConfig()
      );

      await fetchTasks();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Xóa task thất bại"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div>
          <div className="logo">
            ✦ TaskFlow
          </div>

          <nav>
            <button 
            className="menu-item active"
            onClick={() => navigate("/dashboard")}
            >
              🏠 Tổng quan
            </button>

            <button 
              className="menu-item"
              onClick={() => navigate("/tasks")}
            >
              ✅ Công việc
            </button>

            <button 
              className="menu-item"
              onClick={() => navigate("/profile")}
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
        <header className="dashboard-header">
          <div>
            <p className="hello-text">
              👋 Xin chào,
            </p>

            <h1>
              {user?.username || "User"}
            </h1>

            <p className="header-subtitle">
              Quản lý công việc của bạn hôm nay
            </p>
          </div>

          <button
            className="create-button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
           ✨ + Thêm công việc
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>📊 Tổng công việc</span>
            <strong>{statistics.total}</strong>
          </div>

          <div className="stat-card">
            <span>📝 Chưa làm</span>
            <strong>{statistics.todo}</strong>
          </div>

          <div className="stat-card">
            <span>🚀 Đang làm</span>
            <strong>{statistics.doing}</strong>
          </div>

          <div className="stat-card">
            <span>✅ Hoàn thành</span>
            <strong>{statistics.done}</strong>
          </div>
        </section>

        {showForm && (
          <section className="task-form-card">
            <div className="form-header">
              <h2>
                {editingTask
                  ? "Cập nhật công việc"
                  : "Thêm công việc"}
              </h2>

              <button
                className="close-button"
                onClick={resetForm}
              >
                ×
              </button>
            </div>

            <form
              className="task-form"
              onSubmit={handleCreateOrUpdate}
            >
              <div className="form-group">
                <label>Tiêu đề</label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Trạng thái</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="TODO">
                      Chưa làm
                    </option>

                    <option value="IN_PROGRESS">
                      Đang làm
                    </option>

                    <option value="DONE">
                      Hoàn thành
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Ưu tiên</label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="LOW">
                      Thấp
                    </option>

                    <option value="MEDIUM">
                      Trung bình
                    </option>

                    <option value="HIGH">
                      Cao
                    </option>
                  </select>
                </div>
              </div>

              <button
                className="save-button"
                type="submit"
              >
                {editingTask
                  ? "Lưu thay đổi"
                  : "Tạo công việc"}
              </button>
            </form>
          </section>
        )}

        <section className="tasks-section">
          <div className="section-title">
            <div>
              <h2>Công việc của bạn</h2>
              <p>
                {tasks.length} công việc
              </p>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <h3>Chưa có công việc</h3>
              <p>
                Hãy tạo công việc đầu tiên của bạn.
              </p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  className="task-card"
                  key={task.id}
                >
                  <div className="task-info">
                    <div className="task-top">
                      <h3>{task.title}</h3>

                      <span
                        className={`priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p>
                      {task.description ||
                        "Không có mô tả"}
                    </p>

                    <span
                      className={`status ${task.status.toLowerCase()}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(task)
                      }
                    >
                      Sửa
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(task.id)
                      }
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;