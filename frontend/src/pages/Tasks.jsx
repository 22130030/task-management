import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/dashboard.css";


function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // GET TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setError("");

      const response =
        await api.get("/tasks");

      setTasks(response.data);

    } catch (error) {
      console.error(
        "Lỗi lấy danh sách task:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Không thể tải danh sách công việc"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTasks();
  }, []);


  // =========================
  // FILTER
  // =========================

  const filteredTasks =
    filter === "ALL"
      ? tasks
      : tasks.filter(
          (task) =>
            task.status === filter
        );


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Bạn có muốn xóa công việc này?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await api.delete(
        `/tasks/${id}`
      );


      await fetchTasks();

    } catch (error) {

      console.error(
        "Lỗi xóa task:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Xóa công việc thất bại"
      );
    }
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

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="dashboard-loading">
        Đang tải công việc...
      </div>
    );
  }


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
              className="menu-item active"
              onClick={() =>
                navigate("/tasks")
              }
            >
              ✅ Công việc
            </button>


            <button
              className="menu-item"
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

        <header className="dashboard-header">

          <div>

            <p className="hello-text">
              ✅ Quản lý công việc
            </p>

            <h1>
              Công việc của tôi
            </h1>

            <p className="header-subtitle">
              Theo dõi và quản lý toàn bộ công việc
            </p>

          </div>


          <button
            className="create-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ✨ + Thêm công việc
          </button>

        </header>


        {/* ERROR */}

        {error && (
          <div className="profile-message error">
            ⚠️ {error}
          </div>
        )}


        {/* FILTER */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >

          <button
            className="edit-button"
            onClick={() =>
              setFilter("ALL")
            }
          >
            📊 Tất cả
          </button>


          <button
            className="edit-button"
            onClick={() =>
              setFilter("TODO")
            }
          >
            📝 Chưa làm
          </button>


          <button
            className="edit-button"
            onClick={() =>
              setFilter("IN_PROGRESS")
            }
          >
            🚀 Đang làm
          </button>


          <button
            className="edit-button"
            onClick={() =>
              setFilter("DONE")
            }
          >
            ✅ Hoàn thành
          </button>

        </div>


        {/* TASK LIST */}

        <section className="tasks-section">

          <div className="section-title">

            <h2>
              Danh sách công việc
            </h2>

            <p>
              {filteredTasks.length} công việc
            </p>

          </div>


          {filteredTasks.length === 0 ? (

            <div className="empty-state">

              <h3>
                Không có công việc
              </h3>

              <p>
                Không có công việc phù hợp
                với bộ lọc hiện tại.
              </p>

            </div>

          ) : (

            <div className="task-list">

              {filteredTasks.map(
                (task) => (

                  <div
                    key={task.id}
                    className="task-card"
                  >

                    <div className="task-info">

                      <div className="task-top">

                        <h3>
                          {task.title}
                        </h3>


                        <span
                          className={
                            `priority ${
                              task.priority.toLowerCase()
                            }`
                          }
                        >
                          {task.priority}
                        </span>

                      </div>


                      <p>
                        {task.description ||
                          "Không có mô tả"
                        }
                      </p>


                      <span
                        className={
                          `status ${
                            task.status.toLowerCase()
                          }`
                        }
                      >
                        {task.status}
                      </span>

                    </div>


                    <div className="task-actions">

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            task.id
                          )
                        }
                      >
                        Xóa
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


export default Tasks;