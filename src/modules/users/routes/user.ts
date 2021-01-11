import { AppRoute } from '../../../types';
import UserController from '../controllers/user';

const userController: UserController = new UserController();

const userAppRoutes: AppRoute[] = [
  {
    method: 'post',
    path: '/user',
    action: userController.createUser,
  },
  {
    method: 'get',
    path: '/user/:id',
    action: userController.getUser,
  },
  {
    method: 'delete',
    path: '/user/:id',
    action: userController.deleteUser,
  },
];

export default userAppRoutes;
