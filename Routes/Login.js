const router = require('express').Router();
const { User } = require('../Schema/User');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/login', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: 'Email not Found!!' });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: 'Invalid Password!! Enter Correct Password' });


    const token = user.generateAuthToken();
    res
      .status(200)
      .send({
        data: {"userId": user.id, "token": token},
        message: 'logged in successfully',
      });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


router.get('/login:id', async (req, res) => {
  try {
    
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user)
      return res.status(401).send({ message: 'User not Exists' });


    res
      .status(200)
      .send({
        data: user,
        message: 'User details fetched Successfully',
      });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(data);
};

module.exports = router;
