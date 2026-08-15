import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://task-management-system-a7l9.onrender.com/api/tasks";

function App() {
    const [tasks, setTasks] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // =========================
    // FETCH TASKS
    // =========================

    const fetchTasks = async () => {
        try {
            setLoading(true);

            const response = await axios.get(API_URL);

            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            alert("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =========================
    // ADD / UPDATE TASK
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            alert("Please enter a task title");
            return;
        }

        try {
            if (editingId) {
                await axios.put(
                    `${API_URL}/${editingId}`,
                    formData
                );
            } else {
                await axios.post(API_URL, formData);
            }

            resetForm();
            fetchTasks();

        } catch (error) {
            console.error("Error saving task:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save task"
            );
        }
    };

    // =========================
    // COMPLETE TASK
    // =========================

    const toggleComplete = async (task) => {
        try {
            await axios.put(
                `${API_URL}/${task.id}`,
                {
                    completed: !task.completed
                }
            );

            fetchTasks();

        } catch (error) {
            console.error("Error updating task:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    // =========================
    // DELETE TASK
    // =========================

    const deleteTask = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            await axios.delete(`${API_URL}/${id}`);

            fetchTasks();

        } catch (error) {
            console.error("Error deleting task:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    // =========================
    // EDIT TASK
    // =========================

    const editTask = (task) => {
        setEditingId(task.id);

        setFormData({
            title: task.title,
            description: task.description || "",
            dueDate: task.dueDate || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            title: "",
            description: "",
            dueDate: ""
        });
    };

    // =========================
    // STATISTICS
    // =========================

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingTasks = tasks.filter(
        (task) => !task.completed
    ).length;

    const completionPercentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );

    // =========================
    // FILTER TASKS
    // =========================

    const filteredTasks = tasks.filter((task) => {

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            (task.description || "")
                .toLowerCase()
                .includes(search.toLowerCase());

        if (filter === "completed") {
            return matchesSearch && task.completed;
        }

        if (filter === "pending") {
            return matchesSearch && !task.completed;
        }

        return matchesSearch;
    });

    return (
        <div className="app">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                <div className="brand">
                    <div className="brand-icon">
                        ✓
                    </div>

                    <div>
                        <h2>TaskFlow</h2>
                        <span>Task Manager</span>
                    </div>
                </div>

                <nav className="navigation">

                    <a
                        href="#dashboard"
                        className="nav-item active"
                    >
                        <span>▦</span>
                        Dashboard
                    </a>

                    <a
                        href="#tasks"
                        className="nav-item"
                    >
                        <span>✓</span>
                        My Tasks
                    </a>

                    <a
                        href="#add-task"
                        className="nav-item"
                    >
                        <span>＋</span>
                        Add Task
                    </a>

                </nav>

                <div className="sidebar-bottom">

                    <div className="productivity-card">
                        <div className="productivity-icon">
                            ⚡
                        </div>

                        <div>
                            <strong>
                                Stay productive
                            </strong>

                            <p>
                                Complete your tasks on time.
                            </p>
                        </div>
                    </div>

                    <div className="profile">
                        <div className="avatar">
                            U
                        </div>

                        <div>
                            <strong>
                                User
                            </strong>

                            <span>
                                Task Manager
                            </span>
                        </div>
                    </div>

                </div>

            </aside>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="main-content">

                {/* TOP HEADER */}

                <header className="top-header">

                    <div>
                        <p className="welcome">
                            Welcome back 👋
                        </p>

                        <h1>
                            Task Dashboard
                        </h1>

                        <p className="subtitle">
                            Organize your work and stay productive.
                        </p>
                    </div>

                    <button
                        className="header-add-btn"
                        onClick={() =>
                            document
                                .getElementById("add-task")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        + New Task
                    </button>

                </header>

                <div className="dashboard-container">

                    {/* =========================
                        STATISTICS
                    ========================= */}

                    <section
                        className="stats"
                        id="dashboard"
                    >

                        <div className="stat-card blue">

                            <div className="stat-top">
                                <div className="stat-icon">
                                    ☰
                                </div>

                                <span className="stat-label">
                                    ALL TASKS
                                </span>
                            </div>

                            <h2>
                                {totalTasks}
                            </h2>

                            <p>
                                Total tasks
                            </p>

                        </div>

                        <div className="stat-card orange">

                            <div className="stat-top">
                                <div className="stat-icon">
                                    ◷
                                </div>

                                <span className="stat-label">
                                    PENDING
                                </span>
                            </div>

                            <h2>
                                {pendingTasks}
                            </h2>

                            <p>
                                Tasks remaining
                            </p>

                        </div>

                        <div className="stat-card green">

                            <div className="stat-top">
                                <div className="stat-icon">
                                    ✓
                                </div>

                                <span className="stat-label">
                                    COMPLETED
                                </span>
                            </div>

                            <h2>
                                {completedTasks}
                            </h2>

                            <p>
                                Tasks completed
                            </p>

                        </div>

                        <div className="stat-card purple">

                            <div className="stat-top">
                                <div className="stat-icon">
                                    %
                                </div>

                                <span className="stat-label">
                                    PROGRESS
                                </span>
                            </div>

                            <h2>
                                {completionPercentage}%
                            </h2>

                            <p>
                                Overall progress
                            </p>

                        </div>

                    </section>

                    {/* =========================
                        ADD TASK
                    ========================= */}

                    <section
                        className="form-card"
                        id="add-task"
                    >

                        <div className="section-heading">

                            <div>
                                <span className="section-tag">
                                    {editingId
                                        ? "EDIT TASK"
                                        : "CREATE TASK"}
                                </span>

                                <h2>
                                    {editingId
                                        ? "Update your task"
                                        : "Add a new task"}
                                </h2>

                                <p>
                                    {editingId
                                        ? "Modify the task details below."
                                        : "Create a task and keep your work organized."}
                                </p>
                            </div>

                            <div className="form-icon">
                                ✦
                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="task-form"
                        >

                            <div className="form-group">

                                <label>
                                    Task Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Complete project documentation"
                                    value={formData.title}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Add some details about this task..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-buttons">

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    {editingId
                                        ? "✓ Update Task"
                                        : "+ Create Task"}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                )}

                            </div>

                        </form>

                    </section>

                    {/* =========================
                        TASK SECTION
                    ========================= */}

                    <section
                        className="tasks-section"
                        id="tasks"
                    >

                        <div className="tasks-header">

                            <div>
                                <span className="section-tag">
                                    TASK LIST
                                </span>

                                <h2>
                                    Your Tasks
                                </h2>

                                <p>
                                    Manage and track your tasks.
                                </p>
                            </div>

                            <div className="progress-box">

                                <div className="progress-info">
                                    <span>
                                        Completion
                                    </span>

                                    <strong>
                                        {completionPercentage}%
                                    </strong>
                                </div>

                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${completionPercentage}%`
                                        }}
                                    ></div>
                                </div>

                            </div>

                        </div>

                        {/* SEARCH + FILTER */}

                        <div className="task-toolbar">

                            <div className="search-box">

                                <span>
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="filters">

                                <button
                                    className={
                                        filter === "all"
                                            ? "filter-btn active"
                                            : "filter-btn"
                                    }
                                    onClick={() =>
                                        setFilter("all")
                                    }
                                >
                                    All
                                </button>

                                <button
                                    className={
                                        filter === "pending"
                                            ? "filter-btn active"
                                            : "filter-btn"
                                    }
                                    onClick={() =>
                                        setFilter("pending")
                                    }
                                >
                                    Pending
                                </button>

                                <button
                                    className={
                                        filter === "completed"
                                            ? "filter-btn active"
                                            : "filter-btn"
                                    }
                                    onClick={() =>
                                        setFilter("completed")
                                    }
                                >
                                    Completed
                                </button>

                            </div>

                        </div>

                        {/* TASK LIST */}

                        {loading ? (

                            <div className="empty-state">
                                <div className="loading-spinner">
                                    ⟳
                                </div>

                                <h3>
                                    Loading tasks...
                                </h3>
                            </div>

                        ) : filteredTasks.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ✓
                                </div>

                                <h3>
                                    No tasks found
                                </h3>

                                <p>
                                    Add a new task to get started.
                                </p>

                            </div>

                        ) : (

                            <div className="task-list">

                                {filteredTasks.map((task) => (

                                    <article
                                        className={
                                            task.completed
                                                ? "task-card completed"
                                                : "task-card"
                                        }
                                        key={task.id}
                                    >

                                        <div className="task-check">

                                            <button
                                                onClick={() =>
                                                    toggleComplete(task)
                                                }
                                                className={
                                                    task.completed
                                                        ? "check-btn checked"
                                                        : "check-btn"
                                                }
                                            >
                                                {task.completed
                                                    ? "✓"
                                                    : ""}
                                            </button>

                                        </div>

                                        <div className="task-content">

                                            <div className="task-title-row">

                                                <h3>
                                                    {task.title}
                                                </h3>

                                                <span
                                                    className={
                                                        task.completed
                                                            ? "status completed-status"
                                                            : "status pending-status"
                                                    }
                                                >
                                                    {task.completed
                                                        ? "Completed"
                                                        : "Pending"}
                                                </span>

                                            </div>

                                            <p>
                                                {task.description ||
                                                    "No description provided."}
                                            </p>

                                            <div className="task-meta">

                                                {task.dueDate && (
                                                    <span>
                                                        📅 Due:{" "}
                                                        {task.dueDate}
                                                    </span>
                                                )}

                                                <span>
                                                    ID: {task.id}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="task-actions">

                                            <button
                                                onClick={() =>
                                                    toggleComplete(task)
                                                }
                                                className="action-btn complete-action"
                                                title={
                                                    task.completed
                                                        ? "Mark as pending"
                                                        : "Complete task"
                                                }
                                            >
                                                {task.completed
                                                    ? "↩ Undo"
                                                    : "✓ Complete"}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    editTask(task)
                                                }
                                                className="action-btn edit-action"
                                            >
                                                ✎ Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteTask(task.id)
                                                }
                                                className="action-btn delete-action"
                                            >
                                                🗑 Delete
                                            </button>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        )}

                    </section>

                </div>

                <footer className="footer">
                    <p>
                        TaskFlow © 2026 • Task Management System
                    </p>
                </footer>

            </main>

        </div>
    );
}

export default App;
