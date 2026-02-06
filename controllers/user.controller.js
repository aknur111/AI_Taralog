const User = require("../models/User");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    if (email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailTaken) return res.status(400).json({ message: "Email already in use" });
    }
    if (username) {
      const usernameTaken = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (usernameTaken) return res.status(400).json({ message: "Username already in use" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
