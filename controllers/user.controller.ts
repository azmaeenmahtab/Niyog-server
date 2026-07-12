// user.controller.ts
import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service"; // Adjust the path to your service file

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const updatedUser = await userService.setUserRole(userId as string, role);

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
  } catch (error) {
    // 6. Forward error to your global Express error-handling middleware
    next(error);
  }
};