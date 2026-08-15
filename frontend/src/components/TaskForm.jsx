import { useState } from "react";


function TaskForm({ addTask }) {

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [dueDate, setDueDate] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!title.trim()) {

            alert("Please enter task title");

            return;
        }


        await addTask({

            title: title.trim(),

            description: description.trim(),

            due_date: dueDate
        });


        setTitle("");

        setDescription("");

        setDueDate("");
    };


    return (

        <form
            className="task-form"
            onSubmit={handleSubmit}
        >

            <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) =>
                    setTitle(e.target.value)
                }
            />


            <textarea
                placeholder="Task description"
                value={description}
                onChange={(e) =>
                    setDescription(e.target.value)
                }
            />


            <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                    setDueDate(e.target.value)
                }
            />


            <button type="submit">
                Add Task
            </button>

        </form>
    );
}


export default TaskForm;