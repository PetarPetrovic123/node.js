import jwt from "jsonwebtoken";
import { roleHierarchy } from "./roles.js";

export function authenticateJWT(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) return res.status(403).json({ message: "Missing token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    console.log("Decoded JWT:", decoded); 
    req.user = decoded;
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
