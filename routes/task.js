import express from "express";
import Task from "../models/task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// =======================
// ✅ CREATE TASK
// =======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      title,
      description,
      userId: req.user.id
    });

    await task.save();

    res.json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =======================
// ✅ GET ALL TASKS (only logged user)
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =======================
// ✅ GET SINGLE TASK
// =======================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =======================
// ✅ UPDATE TASK
// =======================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: "Task updated",
      task
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =======================
// ✅ DELETE TASK
// =======================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;