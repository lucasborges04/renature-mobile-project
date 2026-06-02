const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    itemType: {
      type: String,
      required: [true, "O tipo de item é obrigatório"],
      enum: ["Plástico", "Papel", "Vidro", "Metal", "Orgânico", "Eletrônico"],
    },

    pointsEarned: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "Item reciclado pelo scanner",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Action", ActionSchema);
