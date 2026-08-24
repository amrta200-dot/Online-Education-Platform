import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables"
      );

      return res.status(500).json({
        message: "Authentication configuration is missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;