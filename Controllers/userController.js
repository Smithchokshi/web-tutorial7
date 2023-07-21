const userModel = require('../Models/userModel');
const validator = require('validator');

const registerUser = async (req, res) => {
  try {
    const { users } = req.body;

    const existingUsers = [];

    await Promise.all(users.map(async item => {

      if (!item.firstName || !item.email || !item.lastName)
        return res.status(400).json({
          message: 'All fields are required.',
          success: false
        });

      if (!validator.isEmail(item.email))
        return res.status(400).json({
          message: 'Please enter valid email.',
          success:false
        });

      let user = await userModel.findOne({ email: item.email });
      if(user) existingUsers.push(user);
    }));

    const newUsers = users.filter(record => !existingUsers.includes(record));

    if (users.length === existingUsers.length)
      return res.status(400).json({
        message: 'Users with the given email already exists.',
        success: false
      });

    await userModel.insertMany(newUsers);

    res.status(200).json({
      message: 'Users added',
      success: true
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {

      await userModel.updateOne({ _id: id }, updatedData);


      res.status(200).json({
        message: 'User updated',
        success: true,
      });
    } catch (e) {
      if (e.name === 'CastError') {
        return res.status(404).json({
          message: 'No matching record found',
          success: false,
        });
      }

      res.status(500).json({
        message: 'Internal Server Error',
        success: false,
      });
    }
}

const getUserDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await userModel.findById({ _id:id });

    const { _id, ...userDetails } = user.toObject();
    const modifiedUser = {
      id: _id,
      ...userDetails
    };

    res.status(200).json({
      success: true,
      user: modifiedUser
    });
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({
        message: 'No matching record found',
        success: false,
      });
    }

    res.status(500).json({
      message: 'Internal Server Error',
      success: false
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    let modifiedUsers = users;

    if (users.length !== 0) {
      modifiedUsers = users.map(user => {
        const { _id, ...userDetails } = user.toObject();
        return { id: _id, ...userDetails };
      });
    }

    res.status(200).json({
      message: 'Users retrieved',
      success: true,
      users: modifiedUsers,
    });
  } catch (e) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedUser = await userModel.deleteOne({_id: id});

    if (deletedUser.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message : "User deleted"
      });
    } else {
      return res.status(404).json({
        message: 'No matching record found',
        success: false,
      });
    }

  } catch (e) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false
    });
  }
}


module.exports = { registerUser, updateUser, getUserDetails, getAllUsers, deleteUser };
