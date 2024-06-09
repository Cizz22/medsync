import express from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import transformerController from '../../controllers/transformer.controller';

const router = express.Router();

router
  .route('/user-defined')
  .get(auth(), transformerController.getUserDefinedTransformers)
  .post(auth(), transformerController.createUserDefinedTransformer);

  router
  .route('/user-defined/validate-code')
  .post(auth(), transformerController.validateTransformerCode);

router
  .route('/user-defined/validate-regex')
  .post(auth(), transformerController.validateTransformerRegex);


router
  .route('/user-defined/:transformerId')
  .get(auth(), transformerController.getUserDefinedTransformer);

router.route('/is-name-available').post(auth(), transformerController.isNameAvailable);


router.route('/system').get(auth(), transformerController.getSystemTransformers);
router.route('/system/:transformerId').get(auth(), transformerController.getSystemTransformer);

export default router;
