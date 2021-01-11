import { Request, Response } from 'express';
import { UserInterface } from '../entities/user/model';
import UserService from '../entities/user/service';
import { HTTP401Error } from '../../../utils/http_errors';

export default class UserController {
  public async createUser(req: Request, res: Response): Promise<Response<any>> {
    const currentDate = new Date(Date.now());
    const userParams = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      gender: req.body.gender,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const user: UserInterface = await UserService.createUser(userParams);
    return res.status(201).send(user);
  }

  public async getUser(req: Request, res: Response): Promise<Response<any>> {
    try {
      const user: UserInterface = await UserService.findUserById(req.params.id);
      return res.status(200).send(user);
    } catch (err) {
      throw new HTTP401Error(err.message);
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<Response<any>> {
    try {
      await UserService.findUserByIdAndDelete(req.params.id);
      return res.status(200).send();
    } catch (err) {
      throw new HTTP401Error(err.message);
    }
  }
}
