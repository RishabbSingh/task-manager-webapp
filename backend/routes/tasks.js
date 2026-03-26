const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskRules, handleValidation } = require('../middleware/validate');

// All task routes require authentication
router.use(protect);

router.route('/').get(getTasks).post(taskRules, handleValidation, createTask);

router.patch('/bulk-status', bulkUpdateStatus);

router.route('/:id').get(getTask).put(taskRules, handleValidation, updateTask).delete(deleteTask);

module.exports = router;
