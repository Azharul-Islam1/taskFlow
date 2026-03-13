 import mongoose from 'mongoose'

const SubtaskSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true })

const ChecklistSchema = new mongoose.Schema({
  text:    { type: String, required: true },
  checked: { type: Boolean, default: false }
}, { timestamps: true })

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status:      { type: String, enum: ['todo','inprogress','done'], default: 'todo' },
  priority:    { type: String, enum: ['low','medium','high'],       default: 'medium' },
  dueDate:     { type: Date },
  tags:        [{ type: String }],
  subtasks:    [SubtaskSchema],
  checklist:   [ChecklistSchema],
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default mongoose.model('Task', TaskSchema)