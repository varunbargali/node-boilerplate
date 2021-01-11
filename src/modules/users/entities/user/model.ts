import {
  Document, Schema, Model, model,
} from 'mongoose';

/**
 * Interface to model the User Schema for TypeScript.
 * @param firstName: string,
 * @param lastName: string,
 * @param email: string,
 * @param phoneNumber: string,
 * @param gender: string,
 * @param isDeleted: boolean,
 * @param createdAt: date,
 * @param updatedAt: date
 */
export interface UserInterface extends Document {
    firstName: String,
    lastName?: String,
    email: String,
    phoneNumber?: String,
    gender?: String,
    isDeleted?: Boolean,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  phoneNumber: String,
  gender: {
    type: String,
    enum: ['M', 'F', 'O'],
    default: 'M',
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const User:Model<UserInterface> = model('User', UserSchema);

export default User;
