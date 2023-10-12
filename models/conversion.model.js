import { Schema, Types } from 'mongoose';

export const ConversionSchema = new Schema(
  {
    user:
    {
      _id:
      {
        required: true,
        type: Types.ObjectId
      },
      name:
      {
        required: true,
        type: String,
        trim: true
      }
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