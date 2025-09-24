import jwt from "jsonwebtoken";
import { roleHierarchy } from "./roles.js";

export function authenticateJWT(req, res, next) {

  // 1️⃣ Check cookie first
  let token = req.cookies.jwt;
  
  if(!token && req.headers.authorization){
    token = req.header.authorization;
  }

  // 4️⃣ Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.warn("JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    console.log("Decoded JWT for request:", decoded);
    req.user = decoded; // attach decoded payload to req.user
    next();
  });
}

export function authorizeRoles(roles = [],startHour, endHour) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied!" });
    }
    const currentHour = new Date().getHours();
    if(currentHour <= startHour || currentHour > endHour){
      return res.status(403).json({message:"Forbidden access!"})
    }

    next();
  };
}

export function rolesHier(minRole){
  return (req,res,next)=>{
   const userRole = req.user.role;
   const userLevel = roleHierarchy[userRole];
   
   if(userLevel >= roleHierarchy[minRole]){
    return next();
   }
   return res.status(403).json({message:"Forbidden!"});
  }
  
}
