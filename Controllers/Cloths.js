const { Cloth } = require('../Schema/Cloths');
const { User } = require('../Schema/User');
const path = require('path');

// @desc Create Cloth
exports.createCloth = async (req, res, next) => {
  const user = await User.findById({ _id: req.body.user });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `No User found with this id of ${req.body.user}`,
    });
  }

  const cloth = await Cloth.create(req.body);
  return res.status(201).json({
    success: true,
    data: cloth,
  });
};

// @desc Delete Cloth

exports.deleteCloth = async (req, res, next) => {
  const cloth = await Cloth.findById(req.params.id);

  if (!cloth) {
    return res.status(400).json({
      success: false,
      message: 'Cloth details not Found',
    });
  }

  await cloth.deleteOne({ id: req.params.id });
  return res.status(200).json({
    success: true,
    data: cloth,
  });
};

// @desc Edit Cloth

exports.editCloth = async (req, res, next) => {
  const cloth = await Cloth.findByIdAndUpdate(req.params.id, req.body);

  if (!cloth) {
    return res.status(400).json({
      success: false,
      message: 'Cloth details not Found',
    });
  }

  // const updatedTask = await Task.save(req.body);
  return res.status(201).json({
    success: true,
    data: cloth,
  });
};

// @desc Get All Cloths

exports.getCloth = async (req, res) => {
  console.log(req.params.id);

  try {
    const cloths = await Cloth.find({ user: req.params.id }).lean().exec();

    if (cloths.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tasks found for this user',
      });
    }

    return res.status(200).json({
      success: true,
      data: cloths,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc Upload Task

exports.clothPhotoUpload = async (req, res, next) => {
  const cloth = await Cloth.findById(req.params.id);

  if (!cloth) {
    return res.status(400).json({
      success: false,
      message: 'Cloth details not Found',
    });
  }

  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: 'Please Upload a file',
    });
  }

  const file = req.files.file;

  //Make Sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image file',
    });
  }

  //Check FileSize
  if (!file.size > process.env.MAX_FILE_UPLOAD) {
    return res.status(400).json({
      success: false,
      message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
    });
  }

  //Create Custom FileName, it is done so that if someone else upload file than the existing file could not override
  console.log(cloth.id);
  file.name = `photo_${cloth._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Cloth.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
};


// @desc Share Cloth
// exports.shareCloth = async (req, res, next) => {
//   const user = await User.findById(req.params.userId);

//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: `No User found with this id of ${req.params.userId}`,
//     });
//   }

  // const cloth = await Cloth.findById(req.params.id);

  // if (!cloth) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Cloth details not Found',
  //   });
  // }

  // console.log(cloth.name);

  // const cloth = await Cloth.create(req.body);
  // return res.status(201).json({
  //   success: true,
  //   data: cloth,
  // });
//};

exports.shareCloth = async (req, res, next) => {
  const clothId = req.params.clothId;
  const userId = req.params.userId;

  const cloth = await Cloth.findById(clothId);
  if (!cloth) {
    return res.status(404).json({
      success: false,
      message: `No cloth found with this id of ${clothId}`,
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `No user found with this id of ${userId}`,
    });
  }

  // Check if the user is already shared with
  if (cloth.sharedWith.includes(userId)) {
    return res.status(400).json({
      success: false,
      message: `Cloth already shared with user ${userId}`,
    });
  }

  // Add the user to the sharedWith array
  cloth.sharedWith.push(userId);

  // Save the updated cloth document
  await cloth.save();

  return res.status(200).json({
    success: true,
    message: `Cloth shared with user ${userId}`,
  });
};
