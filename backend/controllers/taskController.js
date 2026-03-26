const Task = require('../models/Task');

// @desc    Get all tasks (with filtering, search, pagination)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query object
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Full-text search on title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination math
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit), 50); // cap at 50 per page
    const skip = (pageNum - 1) * limitNum;

    // Sort object
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [tasks, totalCount] = await Promise.all([
      Task.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(query),
    ]);

    // Stats for the dashboard
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = { Pending: 0, 'In Progress': 0, Completed: 0 };
    stats.forEach((s) => (statusStats[s._id] = s.count));

    res.json({
      success: true,
      data: tasks,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        limit: limitNum,
        hasNext: pageNum < Math.ceil(totalCount / limitNum),
        hasPrev: pageNum > 1,
      },
      stats: statusStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, priority, status, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update task statuses (for drag-and-drop)
// @route   PATCH /api/tasks/bulk-status
// @access  Private
const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{ id, status }]

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ success: false, message: 'tasks must be an array' });
    }

    const ops = tasks.map(({ id, status }) => ({
      updateOne: {
        filter: { _id: id, user: req.user._id },
        update: { status },
      },
    }));

    await Task.bulkWrite(ops);

    res.json({ success: true, message: 'Tasks updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, bulkUpdateStatus };
