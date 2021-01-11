import { AppRoute } from '../../../types';
import healthCheck from '../controllers/health_check';

const healthCheckRoutes: AppRoute[] = [
  {
    method: 'get',
    path: '/health-check',
    action: healthCheck,
  },
];

export default healthCheckRoutes;
