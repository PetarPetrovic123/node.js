import jwt from "jsonwebtoken";

export function authenticateJWT(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) return res.status(403).json({ message: "Missing token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}

export function authorizeRoles(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied!" });
    }
    next();
  };
}
