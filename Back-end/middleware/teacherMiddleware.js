const teacherMiddleware = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      message: "Teacher access required",
    });
  }
  next();
};
export default teacherMiddleware;