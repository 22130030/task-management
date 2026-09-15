import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/dashboard.css";

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        "access_token"
      )}`,
    },
  });

  const fetchTasks = async () => {
    try {
      const response = await api.get(
        "/tasks",
        getConfig()
      );

      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks =
    filter === "ALL"
      ? tasks
      : tasks.filter(
          (task) => task.status === filter
        );

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn xóa công việc này?")) {
      return;
    }

    await api.delete(
      `/tasks/${id}`,
      getConfig()
    );

    fetchTasks();
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
              className="menu-item active"
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
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Đăng xuất
        </button>

      </aside>


      <main className="dashboard-main">

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
            onClick={() => setFilter("ALL")}
          >
            📊 Tất cả
          </button>

          <button
            className="edit-button"
            onClick={() => setFilter("TODO")}
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
            onClick={() => setFilter("DONE")}
          >
            ✅ Hoàn thành
          </button>

        </div>


        <section className="tasks-section">

          <div className="section-title">
            <h2>Danh sách công việc</h2>

            <p>
              {filteredTasks.length} công việc
            </p>
          </div>


          <div className="task-list">

            {filteredTasks.map((task) => (

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

        </section>

      </main>

    </div>
  );
}

export default Tasks;