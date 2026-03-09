const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const auth = require('../middleware/auth')


router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})


router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body
    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      user: req.user.id
    })
    await task.save()
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})


router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})


router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: req.body.status },
      { new: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})


router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router