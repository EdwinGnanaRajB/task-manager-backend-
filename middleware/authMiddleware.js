import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Step 1: Check header exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    // Step 2: Extract token
    const token = authHeader.split(" ")[1];

    // Step 3: Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Save user
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;