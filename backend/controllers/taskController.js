const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const filePath = path.join(dataDir, "tasks.json");

// ==========================================
// INITIALIZE DATABASE
// ==========================================
const initializeDatabase = () => {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]", "utf8");
    }
};

// ==========================================
// READ TASKS FROM JSON
// ==========================================
const readTasks = () => {
    try {
        initializeDatabase();

        const data = fs.readFileSync(filePath, "utf8");

        if (!data.trim()) {
            return [];
        }

        const tasks = JSON.parse(data);

        return Array.isArray(tasks) ? tasks : [];

    } catch (error) {
        console.error("READ JSON ERROR:", error);
        return [];
    }
};

// ==========================================
// SAVE TASKS TO JSON
// ==========================================
const saveTasks = (tasks) => {
    try {
        initializeDatabase();

        fs.writeFileSync(
            filePath,
            JSON.stringify(tasks, null, 2),
            "utf8"
        );

        return true;

    } catch (error) {
        console.error("SAVE JSON ERROR:", error);
        return false;
    }
};

// ==========================================
// GET ALL TASKS
// GET /api/tasks
// ==========================================
exports.getTasks = (req, res) => {
    try {
        const tasks = readTasks();

        res.status(200).json({
            success: true,
            tasks: tasks
        });

    } catch (error) {
        console.error("GET TASKS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks"
        });
    }
};

// ==========================================
// CREATE TASK
// POST /api/tasks
// ==========================================
exports.createTask = (req, res) => {
    try {
        const tasks = readTasks();

        const {
            title,
            description = "",
            due_date = ""
        } = req.body;

        // Validate title
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        const newTask = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description || "",
            due_date: due_date || "",
            status: "pending",
            created_at: new Date().toISOString()
        };

        tasks.push(newTask);

        const saved = saveTasks(tasks);

        if (!saved) {
            return res.status(500).json({
                success: false,
                message: "Failed to save task"
            });
        }

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        console.error("CREATE TASK ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create task"
        });
    }
};

// ==========================================
// UPDATE TASK
// PUT /api/tasks/:id
// ==========================================
exports.updateTask = (req, res) => {
    try {
        const tasks = readTasks();

        const taskId = req.params.id;

        const taskIndex = tasks.findIndex(
            task => String(task.id) === String(taskId)
        );

        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const oldTask = tasks[taskIndex];

        const updatedTask = {
            ...oldTask,

            title:
                req.body.title !== undefined
                    ? String(req.body.title).trim()
                    : oldTask.title,

            description:
                req.body.description !== undefined
                    ? req.body.description
                    : oldTask.description,

            due_date:
                req.body.due_date !== undefined
                    ? req.body.due_date
                    : oldTask.due_date,

            status:
                req.body.status !== undefined
                    ? req.body.status
                    : oldTask.status,

            id: oldTask.id
        };

        if (!updatedTask.title) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        tasks[taskIndex] = updatedTask;

        const saved = saveTasks(tasks);

        if (!saved) {
            return res.status(500).json({
                success: false,
                message: "Failed to update task"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {
        console.error("UPDATE TASK ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update task"
        });
    }
};

// ==========================================
// DELETE TASK
// DELETE /api/tasks/:id
// ==========================================
exports.deleteTask = (req, res) => {
    try {
        const tasks = readTasks();

        const taskId = req.params.id;

        const taskExists = tasks.some(
            task => String(task.id) === String(taskId)
        );

        if (!taskExists) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const filteredTasks = tasks.filter(
            task => String(task.id) !== String(taskId)
        );

        const saved = saveTasks(filteredTasks);

        if (!saved) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete task"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("DELETE TASK ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete task"
        });
    }
};