"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const verifyJWTToken_1 = require("../middlewares/verifyJWTToken");
const router = (0, express_1.Router)();
router.patch('/update-role', verifyJWTToken_1.validateToken, user_controller_1.updateUserRole);
router.get('/profile/:userId', verifyJWTToken_1.validateToken, user_controller_1.getUserProfileController);
exports.default = router;
