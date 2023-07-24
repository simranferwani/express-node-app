import mongoose, { Schema } from "mongoose";

interface IHobbies  {
  name: string;
  year: number;
  passionLevel: 'low' | 'medium' | 'high' | 'very-high';
}

const hobbiesSchema = new Schema<IHobbies>({
  name: { type: String, required: true },
  passionLevel: { type: String, required: true , enum: ['low', 'medium', 'high', 'very-high']},
  year: { type: Number, required: true },
});


const Hobbies = mongoose.model<IHobbies>('Hobbies', hobbiesSchema);