const doenv = require('dotenv');
const express=require('express');
const app=express();
const sql = require("mysql2");
const path=require('path');
const hbs=require('hbs');
const cookieparser=require("cookie-parser");

doenv.config({
    path:"./.env"
});
// database creation and linking
const db=sql.createConnection({
    host:process.env.Database_host,
    user:process.env.Database_user,
    password:process.env.Database_pass,
    database: process.env.Database_data
});
const location=path.join(__dirname,"./public");
app.use(express.static(location));
app.set("view engine","hbs");
// console.log(__dirname);

// checking database connection
db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("MySQL connection is successful");
    }
});
app.use(cookieparser());

// homepage server creation
// Route creation for each hbs file (handle bar file for view engine or rendering either html or images)
// app.get("/",(req,res)=>{
//     // res.send("<h1>HELLO WORLD Nithiyanantham</h1>");
//     res.render("index");
// });
// app.get("/register",(req,res)=>{
//     // res.send("<h1>HELLO WORLD Nithiyanantham</h1>");
//     res.render("register");
// });

// partialRegister() => for using html code for a single time to the multiple files same as location variable
// const loc=path.join(__dirname,"./views/partials");
// hbs.registerPartials(loc);
// use {{> filename]}} for accessing in multiple files

// Simplification routes will be used in new file because of complexity
app.use(express.urlencoded({extended:false}));

app.use('/',require('./route/pages'));
app.use('/auth',require('./route/auth'));
// port creation
app.listen(5000,()=>{
    console.log("Server Started @ Port 5000");
});