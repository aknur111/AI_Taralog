const Reading = require("../models/Reading");
const User = require("../models/User");

exports.getAllReadings = async (req, res, next) => {
  try {
    const readings = await Reading.find()
      .populate("user", "username email firstName lastName gender birthDate")
      .sort({ createdAt: -1 });
    res.json(readings);
  } catch (e) {
    next(e);
  }
};

exports.deleteAnyReading = async (req, res, next) => {
  try {
    const reading = await Reading.findById(req.params.id);
    if (!reading) return res.status(404).json({ message: "Reading not found" });

    await reading.deleteOne();
    res.json({ message: "Deleted by admin" });
  } catch (e) {
    next(e);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    next(e);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [users, readings] = await Promise.all([
      User.find().select("gender birthDate createdAt"),
      Reading.find().select("readingType createdAt user")
    ]);

    const now = new Date();
    const getAge = (birthDate) => {
      const birth = new Date(birthDate);
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      return age;
    };

    const getAgeGroup = (age) => {
      if (age < 25) return "18-24";
      if (age < 35) return "25-34";
      if (age < 45) return "35-44";
      if (age < 55) return "45-54";
      return "55+";
    };

    const userMap = new Map();
    users.forEach(u => {
      userMap.set(u._id.toString(), {
        gender: u.gender || "other",
        age: u.birthDate ? getAge(u.birthDate) : null
      });
    });

    const genderStats = { male: 0, female: 0, other: 0 };
    const ageGroups = { "18-24": 0, "25-34": 0, "35-44": 0, "45-54": 0, "55+": 0 };
    
    users.forEach(u => {
      if (u.gender) genderStats[u.gender]++;
      if (u.birthDate) {
        ageGroups[getAgeGroup(getAge(u.birthDate))]++;
      }
    });

    const readingTypes = { taro: 0, love: 0, money: 0, work: 0, general: 0 };
    const uniqueUsersByType = { taro: new Set(), love: new Set(), money: new Set(), work: new Set(), general: new Set() };
    const readingsByGender = { male: 0, female: 0, other: 0 };
    const readingsByAge = { "18-24": 0, "25-34": 0, "35-44": 0, "45-54": 0, "55+": 0 };

    readings.forEach(r => {
      const type = r.readingType;
      const userId = r.user?.toString();
      const userData = userMap.get(userId);

      if (type && readingTypes[type] !== undefined) {
        readingTypes[type]++;
        uniqueUsersByType[type].add(userId);
      }

      if (userData) {
        if (userData.gender) readingsByGender[userData.gender]++;
        if (userData.age !== null) readingsByAge[getAgeGroup(userData.age)]++;
      }
    });

    const uniqueUsersCount = {};
    Object.keys(uniqueUsersByType).forEach(type => {
      uniqueUsersCount[type] = uniqueUsersByType[type].size;
    });

    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyReadings = {};
    readings.filter(r => new Date(r.createdAt) >= last30Days).forEach(r => {
      const day = new Date(r.createdAt).toISOString().split("T")[0];
      dailyReadings[day] = (dailyReadings[day] || 0) + 1;
    });

    res.json({
      totalUsers: users.length,
      totalReadings: readings.length,
      genderStats,
      ageGroups,
      readingTypes,
      uniqueUsersByType: uniqueUsersCount,
      readingsByGender,
      readingsByAge,
      dailyReadings
    });
  } catch (e) {
    next(e);
  }
};
