// rename: auth?
const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
require("dotenv").config();

// generate token: require('crypto').randomBytes(24).toString('base64')

