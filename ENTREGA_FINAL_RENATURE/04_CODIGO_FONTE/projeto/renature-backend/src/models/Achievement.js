const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    iconName: {
      type: String,
      default: "award",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Achievement", AchievementSchema);
