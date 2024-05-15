import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './docs.route';
import connectionRoute from './connection.route';
import jobRoute from './job.route';
import transformerRoute from './transformer.route';
import runRoute from './run.route';
import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/connections',
    route: connectionRoute
  },
  {
    path: '/jobs',
    route: jobRoute
  },
  {
    path: '/transformers',
    route: transformerRoute
  },
  {
    path: '/runs',
    route: runRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
