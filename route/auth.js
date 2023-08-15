// I create js file and providing route for sending data from html to database
const express=require('express');
const controlerdata=require("../controllers/users");
const router=express.Router();
router.post('/login',controlerdata.login);
router.post('/register',controlerdata.register);
router.get('/logout',controlerdata.logout);
router.post('/forgot',controlerdata.forgot);
module.exports=router;
