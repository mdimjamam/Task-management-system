const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Student Task Manager API is running"
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
