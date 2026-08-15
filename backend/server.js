const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JSON database file
const dataFile = path.join(__dirname, "tasks.json");

// Read tasks from JSON file
function getTasks() {
    try {
        const data = fs.readFileSync(dataFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save tasks to JSON file
function saveTasks(tasks) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(tasks, null, 2)
    );
}

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Task Management API is running"
    });
});

// GET - Get all tasks
app.get("/api/tasks", (req, res) => {
    const tasks = getTasks();

    res.json(tasks);
});

// GET - Get single task
app.get("/api/tasks/:id", (req, res) => {
    const tasks = getTasks();

    const task = tasks.find(
        task => task.id === req.params.id
    );

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);
});

// POST - Create a task
app.post("/api/tasks", (req, res) => {
    const tasks = getTasks();

    const { title, description, dueDate } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description || "",
        dueDate: dueDate || "",
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    saveTasks(tasks);

    res.status(201).json(newTask);
});

// PUT - Update a task
app.put("/api/tasks/:id", (req, res) => {
    const tasks = getTasks();

    const taskIndex = tasks.findIndex(
        task => task.id === req.params.id
    );

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const {
        title,
        description,
        dueDate,
        completed
    } = req.body;

    tasks[taskIndex] = {
        ...tasks[taskIndex],

        ...(title !== undefined && {
            title: title.trim()
        }),

        ...(description !== undefined && {
            description
        }),

        ...(dueDate !== undefined && {
            dueDate
        }),

        ...(completed !== undefined && {
            completed
        })
    };

    saveTasks(tasks);

    res.json(tasks[taskIndex]);
});

// DELETE - Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const tasks = getTasks();

    const taskIndex = tasks.findIndex(
        task => task.id === req.params.id
    );

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    saveTasks(tasks);

    res.json({
        message: "Task deleted successfully",
        task: deletedTask
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(Server running on port ${PORT});
});
