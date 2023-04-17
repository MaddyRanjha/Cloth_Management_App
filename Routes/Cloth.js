const express = require('express');
const {
  createCloth,
  deleteCloth,
  editCloth,
  getCloth,
  clothPhotoUpload,
  shareCloth,
} = require('../Controllers/Cloths');
const router = express.Router({ mergeParams: true });

router.route('/').post(createCloth);

router.route('/:id').get(getCloth).delete(deleteCloth).put(editCloth);

router.route('/:id/photo').put(clothPhotoUpload);

router.route('/:userId/share/:clothId').put(shareCloth);

module.exports = router;