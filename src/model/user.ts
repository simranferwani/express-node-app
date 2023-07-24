import mongoose, { Schema, Types } from "mongoose";

interface IUser {
  name: string;
  hobbies: Types.ObjectId[]; // Array of references to hobbies
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  hobbies: [{ type: Schema.Types.ObjectId, ref: 'Hobbies' }],
});

const User = mongoose.model<IUser>('User', userSchema);