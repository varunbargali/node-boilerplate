import { Error } from 'mongoose';
import User, { UserInterface } from './model';
import { HTTP400Error, HTTP404Error } from '../../../../utils/http_errors';

export default class UserService {
  public static async createUser(userParams) {
    const user = new User(userParams);
    const validateError = user.validateSync();
    if (validateError) {
      throw new HTTP400Error(validateError, validateError.errors);
    }

    const existingUser: UserInterface = await User.findOne({ email: user.email });
    if (existingUser) {
      throw new HTTP400Error(Error, 'User already exists');
    }

    return await user.save();
  }

  public static async findUserById(id: string) {
    const user: UserInterface = await User.findById(id);
    if (user == null) {
      throw new HTTP404Error();
    }
    return user;
  }

  public static async filterUser(query: any) {
    return await User.findOne(query);
  }

  public static async updateUser(userParams: UserInterface) {
    return await User.findOneAndUpdate({ _id: userParams._id }, userParams);
  }

  public static async findUserByIdAndDelete(_id: String) {
    const user: UserInterface = await User.findByIdAndDelete(_id);
    if (user == null) {
      throw new HTTP404Error();
    }
    return user;
  }

  public static async deleteUser(query: any) {
    return await User.deleteOne(query);
  }
}
