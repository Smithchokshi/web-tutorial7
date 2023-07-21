const express = require('express');
const { registerUser, updateUser, getUserDetails, getAllUsers, deleteUser } = require('../Controllers/userController');

const router = express.Router();

router.post('/add', registerUser);
router.put('/update/:id', updateUser);
router.get('/user/:id', getUserDetails);
router.get('/users', getAllUsers);
router.delete('/delete/:id', deleteUser);

router.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    success: false,
  });
});

module.exports = router;