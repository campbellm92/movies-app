// rename: auth?
const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
const { authenticateJWT, generateAccessToken } = require("../middleware/auth");
require("dotenv").config();

router.get("/register", (req, res, next) => {
    res.render("user/register", {
        title: "PopcornBase",
    })
});

router.post("/register", async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).render("user/register", {
          requiredError: "Request body incomplete, both email and password are required",
        });
      };
  
      if (!email.includes("@")) {
        return res.status(400).render("user/register", {
        invalidEmailError: "You must provide a valid email address",
        });
      };
  
      const usersQuery = await req.db.from("users").where("email", "=", email);
  
      if (usersQuery.length > 0) {
        return res.status(409).render("user/register", {
          userAlreadyExistsError: "User already exists",
        });
      };
  
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);
      await req.db.from("users").insert({ email, hash });
  
      res.status(201).render("user/register", { 
        successfulCreation: "User created" });
    } catch (error) {
      res.status(500).json({ error: true, message: "An error occurred" });
    };
  });
  

// Login routers

router.get("/login", (req, res, next) => {
    res.render("user/login", {
        title: "PopcornBase",
    });
});

router.post("/login", async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
    
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 
                "Request body incomplete, both email and password are required"
            });
        }
    
    const users = await req.db.from("users").where("email", "=", email); 

    if (users.length === 0) {
        return res.status(401).json({
            error: true,
            message: "Incorrect email or password"
        })
    }

    const user = users[0];
    const pwMatch = await bcrypt.compare(password, user.hash);

    if (!pwMatch) {
        return res.status(401).json({
            error: true,
            message: "Password doesn't match records. Please try again"
        });
    };

    const token = generateAccessToken(email);

    res.status(200).json({
        token,
        token_type: "Bearer",
        expires_in: 36000
    });

    } catch(error) {
        logger.error(error);
        res.status(500).json({ error: true, message: "An error occured" });
    };
});

router.get("/profile", authenticateJWT, (req, res, next) => {
  res.status(200).json({ error: false, user: req.user });
});

module.exports = router;