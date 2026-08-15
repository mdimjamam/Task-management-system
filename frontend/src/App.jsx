import { useEffect, useState } from "react";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import API from "./api";

import "./App.css";


function App() {

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);


    // ==========================================
    // GET TASKS
    // ==========================================

    const fetchTasks = async () => {

        try {

            const response = await API.get("/tasks");

            console.log("GET TASKS:", response.data);

            setTasks(response.data.tasks || []);

        } catch (error) {

            console.error(
                "FETCH TASKS ERROR:",
                error.response?.data || error.message
            );

            alert("Failed to load tasks");

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // ADD TASK
    // ==========================================

    const addTask = async (task) => {

        try {

            const response = await API.post(
                "/tasks",
                task
            );

            console.log(
                "TASK CREATED:",
                response.data
            );

            await fetchTasks();

        } catch (error) {

            console.error(
                "ADD TASK ERROR:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to add task"
            );
        }
    };


    // ==========================================
    // DELETE TASK
    // ==========================================

    const deleteTask = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await API.delete(
                `/tasks/${id}`
            );

            await fetchTasks();

        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };


    // ==========================================
    // TOGGLE TASK
    // ==========================================

    const toggleTask = async (task) => {

        try {

            const newStatus =
                task.status === "completed"
                    ? "pending"
                    : "completed";


            await API.put(
                `/tasks/${task.id}`,
                {
                    title: task.title,

                    description:
                        task.description || "",

                    due_date:
                        task.due_date || "",

                    status: newStatus
                }
            );


            await fetchTasks();

        } catch (error) {

            console.error(
                "UPDATE ERROR:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };


    // ==========================================
    // LOAD TASKS
    // ==========================================

    useEffect(() => {

        fetchTasks();

    }, []);


    // ==========================================
    // STATISTICS
    // ==========================================

    const completedTasks =
        tasks.filter(
            task => task.status === "completed"
        ).length;


    const pendingTasks =
        tasks.length - completedTasks;


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="app">

            <header>

                <h1>
                    Task Management System
                </h1>

                <p>
                    Manage your daily tasks easily
                </p>

            </header>


            <main>

                {/* Statistics */}

                <section className="stats">

                    <div className="stat-card">

                        <h2>
                            {tasks.length}
                        </h2>

                        <p>
                            Total Tasks
                        </p>

                    </div>


                    <div className="stat-card">

                        <h2>
                            {completedTasks}
                        </h2>

                        <p>
                            Completed
                        </p>

                    </div>


                    <div className="stat-card">

                        <h2>
                            {pendingTasks}
                        </h2>

                        <p>
                            Pending
                        </p>

                    </div>

                </section>


                {/* Add Task */}

                <section className="add-section">

                    <h2>
                        Add New Task
                    </h2>

                    <TaskForm
                        addTask={addTask}
                    />

                </section>


                {/* Task List */}

                <section className="tasks-section">

                    <h2>
                        My Tasks
                    </h2>


                    {loading ? (

                        <p>
                            Loading tasks...
                        </p>

                    ) : (

                        <TaskList
                            tasks={tasks}
                            deleteTask={deleteTask}
                            toggleTask={toggleTask}
                        />

                    )}

                </section>

            </main>

        </div>
    );
}

export default App;