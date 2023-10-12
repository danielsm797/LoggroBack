import { Schema, Types } from 'mongoose';

export const ConversionSchema = new Schema(
  {
    user:
    {
      required: true,
      type: String,
      trim: true
    },
    path:
    {
      required: true,
      type: String,
      trim: true
    },
    prevExtension:
    {
      required: true,
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
)