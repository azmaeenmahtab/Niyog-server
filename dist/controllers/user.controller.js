"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileController = exports.updateUserRole = void 0;
const user_service_1 = require("../services/user.service"); // Adjust the path to your service file
const updateUserRole = async (req, res, next) => {
    try {
        const { userId } = req.query;
        const { role } = req.body;
        // 1. Validate that the role is provided
        if (!role) {
            res.status(400).json({
                success: false,
                message: "Role is required in the request body."
            });
            return;
        }
        // 2. Strict Role Validation (Matching your system's design)
        const allowedRoles = ["applicant", "recruiter"];
        if (!allowedRoles.includes(role)) {
            res.status(400).json({
                success: false,
                message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`
            });
            return;
        }
        // 3. Call your service layer to handle the MongoDB Atlas logic
        const updatedUser = await user_service_1.userService.setUserRole(userId, role);
        // 4. Handle case where user ID doesn't exist in MongoDB
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: "User not found."
            });
            return;
        }
        // 5. Return success response
        res.status(200).json({
            success: true,
            message: `User role updated to ${role} successfully.`,
            data: updatedUser,
        });
    }
    catch (error) {
        // 6. Forward error to your global Express error-handling middleware
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
const getUserProfileController = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Valid user ID parameter is required.',
            });
            return;
        }
        const user = await (0, user_service_1.getUserProfileService)(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User profile not found.',
            });
            return;
        }
        // Sanitize user output if needed (e.g. omitting sensitive fields)
        res.status(200).json({
            success: true,
            message: 'User profile retrieved successfully.',
            data: user,
        });
    }
    catch (error) {
        console.error('getUserProfileController error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error.',
        });
    }
};
exports.getUserProfileController = getUserProfileController;
