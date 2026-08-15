const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/tasks.json");

const readTasks = () => {
    if (!fs.existsSync(filePath)) {
        return [];
    }

    const data = fs.readFileSync(filePath, "utf8");

    return data ? JSON.parse(data) : [];
};

const saveTasks = (tasks) => {
    fs.writeFileSync(
        filePath,
        JSON.stringify(tasks, null, 2)
    );
};


const getTasks = (req, res) => {
    try {
        const tasks = readTasks();

        res.json({
            success: true,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const createTask = (req, res) => {
    try {
        const tasks = readTasks();

        const newTask = {
            id: Date.now().toString(),
            title: req.body.title,
            description: req.body.description || "",
            completed: false
        };

        tasks.push(newTask);

        saveTasks(tasks);

        res.status(201).json({
            success: true,
            task: newTask
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const updateTask = (req, res) => {
    try {
        const tasks = readTasks();

        const index = tasks.findIndex(
            task => task.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        tasks[index] = {
            ...tasks[index],
            ...req.body
        };

        saveTasks(tasks);

        res.json({
            success: true,
            task: tasks[index]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const deleteTask = (req, res) => {
    try {
        const tasks = readTasks();

        const filteredTasks = tasks.filter(
            task => task.id !== req.params.id
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};
