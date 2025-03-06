const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Regex pour valider les numéros de téléphone belges et français
const phoneRegex = /^(?:(?:\+|00)(?:32|33)|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return phoneRegex.test(v);
        },
        message: "Le numéro de téléphone doit être au format belge ou français",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // 📌 Regex pour valider les emails
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 📌 Hashage du mot de passe avant l'enregistrement
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
