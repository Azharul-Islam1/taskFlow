 import express    from 'express'
import Task       from '../models/Task.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (e) { res.status(500).json({ message: e.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags, subtasks, checklist } = req.body
    const task = await Task.create({
      title, description, status, priority, dueDate,
      tags:      tags      || [],
      subtasks:  subtasks  || [],
      checklist: checklist || [],
      user: req.user.id
    })
    res.status(201).json(task)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })

    const { title, description, status, priority, dueDate, tags, subtasks, checklist } = req.body

    if (title       !== undefined) task.title       = title
    if (description !== undefined) task.description = description
    if (status      !== undefined) task.status      = status
    if (priority    !== undefined) task.priority    = priority
    if (dueDate     !== undefined) task.dueDate     = dueDate || null
    if (tags        !== undefined) task.tags        = tags

    if (checklist !== undefined) {
      checklist.forEach(incoming => {
        if (incoming._id) {
          const existing = task.checklist.id(incoming._id)
          if (existing) {
            existing.text    = incoming.text
            existing.checked = incoming.checked
          } else {
            task.checklist.push({ text: incoming.text, checked: incoming.checked })
          }
        } else {
          task.checklist.push({ text: incoming.text, checked: incoming.checked })
        }
      })
      const incomingIds = checklist.filter(c => c._id).map(c => String(c._id))
      task.checklist = task.checklist.filter(c => incomingIds.includes(String(c._id)) || !c._id)
    }

    if (subtasks !== undefined) {
      subtasks.forEach(incoming => {
        if (incoming._id) {
          const existing = task.subtasks.id(incoming._id)
          if (existing) {
            existing.title     = incoming.title
            existing.completed = incoming.completed
          } else {
            task.subtasks.push({ title: incoming.title, completed: incoming.completed })
          }
        } else {
          task.subtasks.push({ title: incoming.title, completed: incoming.completed })
        }
      })
      const incomingIds = subtasks.filter(s => s._id).map(s => String(s._id))
      task.subtasks = task.subtasks.filter(s => incomingIds.includes(String(s._id)) || !s._id)
    }

    await task.save()
    res.json(task)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: req.body.status },
      { new: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.patch('/:id/subtasks/:sid', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    const sub = task.subtasks.id(req.params.sid)
    if (!sub) return res.status(404).json({ message: 'Subtask not found' })
    sub.completed = !sub.completed
    await task.save()
    res.json(task)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.patch('/:id/checklist/:cid', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    const item = task.checklist.id(req.params.cid)
    if (!item) return res.status(404).json({ message: 'Checklist item not found' })
    item.checked = !item.checked
    await task.save()
    res.json(task)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

export default router