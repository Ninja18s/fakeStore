const router = require('express').Router();


const { createUser, logIn, getAllUsers, myProfile, update, deleteUser, logout, logoutAll } = require('../controller/user/user');
const authMiddleware = require('../middleware/authMiddleware');



//<-------------------Admin routes------------------>
router.get('/admin/users', getAllUsers)

router.delete('/admin/:id', authMiddleware, deleteUser)

//-------------------User routes-------------------->

router.post('/register', createUser);

router.post('/login', logIn);

router.get('/user/myProfile', authMiddleware, myProfile);

router.patch('/user/update',authMiddleware, update)

router.post('/user/logout', authMiddleware , logout);

router.post('/user/logoutAll', authMiddleware , logoutAll);


module.exports = router;