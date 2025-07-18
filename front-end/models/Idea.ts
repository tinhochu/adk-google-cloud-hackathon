import mongoose from 'mongoose'

import toJSON from './plugins/toJSON'

export const ideaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
    },
    tone: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    generated_script: {
      type: String,
    },
    generated_caption: {
      type: String,
    },
    generated_music: {
      type: Array,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

ideaSchema.plugin(toJSON)

export default mongoose.models.Idea || mongoose.model('Idea', ideaSchema)
