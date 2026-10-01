// Allow only admin (and optionally pharmacist) roles
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: `Access denied. Role '${req.user.role}' is not permitted.`,
    });
  }

  next();
};

// Allow admin or pharmacist
export const adminOrPharmacist = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!["admin", "pharmacist"].includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. Role '${req.user.role}' is not permitted.`,
    });
  }

  next();
};
