function TaskList({
    tasks,
    deleteTask,
    toggleTask
}) {

    if (tasks.length === 0) {

        return (

            <div className="empty">

                <h3>
                    No tasks found
                </h3>

                <p>
                    Add your first task above.
                </p>

            </div>
        );
    }


    return (

        <div className="task-list">

            {tasks.map((task) => (

                <div
                    className={`task-card ${
                        task.status === "completed"
                            ? "completed"
                            : ""
                    }`}
                    key={task.id}
                >

                    <div>

                        <h3>
                            {task.title}
                        </h3>


                        {task.description && (

                            <p>
                                {task.description}
                            </p>

                        )}


                        {task.due_date && (

                            <small>

                                Due:{" "}

                                {new Date(
                                    task.due_date
                                ).toLocaleDateString()}

                            </small>

                        )}

                    </div>


                    <div className="task-actions">

                        <button
                            className="complete-btn"
                            onClick={() =>
                                toggleTask(task)
                            }
                        >

                            {task.status === "completed"
                                ? "Pending"
                                : "Complete"}

                        </button>


                        <button
                            className="delete-btn"
                            onClick={() =>
                                deleteTask(task.id)
                            }
                        >

                            Delete

                        </button>

                    </div>

                </div>

            ))}

        </div>
    );
}


export default TaskList;