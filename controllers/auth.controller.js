const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, birthDate, birthPlace, birthTime } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    
    const userData = { 
      username, 
      email, 
      password: hash 
    };
    
    if (firstName) userData.firstName = firstName;
    if (lastName) userData.lastName = lastName;
    if (birthDate) userData.birthDate = birthDate;
    if (birthPlace) userData.birthPlace = birthPlace;
    if (birthTime) userData.birthTime = birthTime;
    
    const user = await User.create(userData);

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        birthPlace: user.birthPlace,
        birthTime: user.birthTime
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        birthPlace: user.birthPlace,
        birthTime: user.birthTime
      }
    });
  } catch (err) {
    next(err);
  }
};