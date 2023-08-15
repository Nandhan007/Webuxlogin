const express=require('express');
const router=express.Router();
const usercontroller=require("../controllers/users");

router.get(["/","/login"],(req,res)=>{
    // res.send("<h1>HELLO WORLD Nithiyanantham</h1>");
    res.render("index");
});
router.get("/register",(req,res)=>{
    // res.send("<h1>HELLO WORLD Nithiyanantham</h1>");
    res.render("register");
});

router.get("/home",usercontroller.loggedIn,(req,res)=>{
    // res.send("<h1>HELLO WORLD Nithiyanantham</h1>");
    if(req.user){
        res.render("home",{user: req.user});
        // console.log(req.user);
    }
    else{
        res.redirect("/login");
        // console.log("success!");
    }
});
router.get("/forget",(req,res)=>{
    // res.send("<h1>HELLO WORLD Nithiyanantham</h1>");
    res.render("forget");
});
module.exports=router;