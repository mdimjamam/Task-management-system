const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const filePath = path.join(dataDir, "tasks.json");

// Make sure data folder and JSON file exist
const initializeDatabase = () => {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]", "utf8");
    }
};

// Read tasks
const getTasks = () => {
    try {
        initializeDatabase();

        const data = fs.readFileSync(filePath, "utf8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {
        console.error("READ JSON ERROR:", error);
        return [];
    }
};

// Save tasks
const saveTasks = (tasks) => {
    initializeDatabase();

    fs.writeFileSync(
        filePath,
        JSON.stringify(tasks, null, 2),
        "utf8"
    );
};


// ==========================================
// GET ALL TASKS
// ==========================================
exports.getTasks = (req, res) => {

    try {

        const tasks = getTasks();

        res.json({
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
// ==========================================
exports.createTask = (req, res) => {

    try {

        const tasks = getTasks();

        const {
            title,
            description,
            due_date
        } = req.body;

        if (!title || !title.trim()) {

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

        saveTasks(tasks);

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
// ==========================================
exports.updateTask = (req, res) => {

    try {

        const tasks = getTasks();

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
                    ? req.body.title
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

        tasks[taskIndex] = updatedTask;

        saveTasks(tasks);

        res.json({

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
// ==========================================
exports.deleteTask = (req, res) => {

    try {

        const tasks = getTasks();

        const taskId = req.params.id;

        const filteredTasks = tasks.filter(
            task => String(task.id) !== String(taskId)
        );

        if (filteredTasks.length === tasks.length) {

            return res.status(404).json({

                success: false,

                message: "Task not found"
            });
        }

        saveTasks(filteredTasks);

        res.json({

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