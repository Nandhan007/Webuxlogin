const express = require("express");
const sql=require("mysql2");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const { promisify }=require("url");

const db=sql.createConnection({
    host:process.env.Database_host,
    user:process.env.Database_user,
    password:process.env.Database_pass,
    database: process.env.Database_data
});

exports.login = async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).render("index",{msg: "Enter your Username and Password",msg_type: "error"});
        }
       

        db.query('select * from users where email=?',[email],async(error,result)=>{
            if(result.length<=0){
               return res.status(401).render("index",{msg: "Username or Password incorrect!!!",msg_type: "error"});
            }
            // !(await bcrypt.compare(password,result[0].PASSWORD))
            else if(!(password==result[0].PASSWORD)){
              return  res.status(401).render("index",{msg: "Password incorrect!!!",msg_type: "error"});
            }else{
                // res.send("Your'e Successfully logged in!!")
                const id=result[0].ID;
                const token=jwt.sign({id: id},process.env.jwt_secret,{
                    expiresIn: process.env.jwt_expires
                })
                console.log("The Token is "+token);
                const cookiesdata={
                    expires: new Date( Date.now()+process.env.jwt_cookie*24*60*60*1000),
                    httpsonly: true
                };
                res.cookie("Nithiya",token,cookiesdata);
                res.status(200).redirect("/home");

            }
        })
    }
    catch(error){
    console.log(error);
    }
};

exports.register = (req,res)=>{
//    res.send("FORM SUBMITTED");
    console.log(req.body);
    // const name=req.body.name;
    const {name,email,password,confirm_password}=req.body;
    // console.log(name);
    // console.log(email);
    db.query("select email from users where email=?",[email],async (error,result)=>{
        if(error){
            console.log(error);
        }
        if(result.length>0){
            return res.render("register",{msg: "Email is already taken",msg_type: "error"});
        }
        else if(password!==confirm_password){
            return res.render("register",{msg: "Password does not match",msg_type: "error"});
        }

        // const hashpass=await bcrypt.hash(password,8);
        // console.log(hashpass);
        db.query("insert into users set?",{name: name,email: email,password:password},(error,result)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log(result);
                return res.render("register",{msg: "Registeration is successful",msg_type: "good"});
            }
        });


    })
    
};

exports.loggedIn=async (req,res,next)=>{
    console.log(req.cookies);
    if(req.cookies.Nithiya){
        const decode=await jwt.verify(
            req.cookies.Nithiya,
            process.env.jwt_secret
        );
            // console.log(decode);
        db.query("select * from users where ID=?",[decode.id],(err,results)=>{
                // console.log(results)
                if(!results){
                   return next();
                }
                req.user=results[0];
                return next();
        });
        
    }
    else{
       return next();
    }
};

exports.logout = (req,res)=>{
    res.cookie("Nithiya","logout",{
        expires: new Date(Date.now()+2*1000),
        httpsonly: true
    });
    res.status(200).redirect("/login");
};

//cookie delete function and used as placeholder

exports.forgot = (req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.status(400).render("forget",{msg: "Incorrect Email ID",msg_type: "error"});
    }
    db.query("select email,password from users where email=?",[email],(error,result)=>{
        console.log(result);
        if(error){
            console.log(error);
        }
       
        else if(result.length<=0){
            
            return res.render("forget",{msg: "Email is not found",msg_type:"error"});
        }
        else{

           return res.render("forget",{msg: `Your password is ${result[0].password}`,msg_type: "good"});
        }
            
            
           
        }
    )};
