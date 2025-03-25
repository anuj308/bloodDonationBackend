import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js"
import Hospital from "../models/hospital.models.js";
import NGO from "../models/ngo.models.js";

// User authentication middleware
export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

// Hospital authentication middleware
export const verifyHospitalJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // Check if the token has a role and it's a hospital
        if (!decodedToken?.role || decodedToken.role !== "hospital") {
            throw new ApiError(401, "Access denied: Hospital authorization required")
        }
    
        const hospital = await Hospital.findById(decodedToken?._id).select("-password -refreshToken -verificationOTP")
    
        if (!hospital) {
            throw new ApiError(401, "Invalid access token")
        }
    
        req.hospital = hospital;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

// NGO authentication middleware
export const verifyNGOJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // Check if the token has a role and it's an NGO
        if (!decodedToken?.role || decodedToken.role !== "ngo") {
            throw new ApiError(401, "Access denied: NGO authorization required")
        }
    
        const ngo = await NGO.findById(decodedToken?._id).select("-password -refreshToken -verificationOTP")
    
        if (!ngo) {
            throw new ApiError(401, "Invalid access token")
        }
    
        req.ngo = ngo;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

// Admin authentication middleware
export const verifyAdminJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // Check if the token has a role and it's an admin
        if (!decodedToken?.role || decodedToken.role !== "admin") {
            throw new ApiError(401, "Access denied: Admin authorization required")
        }
        
        // Since we don't have an Admin model yet, just set the decoded token info to req.admin
        req.admin = {
            _id: decodedToken._id,
            email: decodedToken.email,
            role: decodedToken.role
        };
        
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

// Combined verification middleware - verifies any valid token and sets appropriate entity
export const verifyAnyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // Check token role and verify against appropriate model
        const role = decodedToken?.role || "user"; // Default to user if no role
        
        switch(role) {
            case "admin":
                // For admin, just set the decoded token info
                req.admin = {
                    _id: decodedToken._id,
                    email: decodedToken.email,
                    role: "admin"
                };
                req.entityType = "admin";
                break;
                
            case "hospital":
                const hospital = await Hospital.findById(decodedToken?._id)
                    .select("-password -refreshToken -verificationOTP");
                if (!hospital) throw new ApiError(401, "Invalid hospital access token");
                req.hospital = hospital;
                req.entityType = "hospital";
                break;
                
            case "ngo":
                const ngo = await NGO.findById(decodedToken?._id)
                    .select("-password -refreshToken -verificationOTP");
                if (!ngo) throw new ApiError(401, "Invalid NGO access token");
                req.ngo = ngo;
                req.entityType = "ngo";
                break;
                
            default: // User
                const user = await User.findById(decodedToken?._id)
                    .select("-password -refreshToken");
                if (!user) throw new ApiError(401, "Invalid user access token");
                req.user = user;
                req.entityType = "user";
        }
        
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})