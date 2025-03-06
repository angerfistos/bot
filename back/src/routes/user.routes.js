const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
require("dotenv").config();

/* -------------------------------------------------------------------------- */
/*                               📌 SWAGGER DOCS                              */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phone
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */

/* -------------------------------------------------------------------------- */
/*                           🔹 ROUTES PUBLIC (Sans Token)                    */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Users]
 */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const newUser = new User({ firstName, lastName, phone, email, password });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion utilisateur et obtention d'un token
 *     tags: [Users]
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                           🔹 ROUTES PRIVÉES (Avec Token)                   */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Met à jour les informations de l'utilisateur
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, email } = req.body;

    if (!firstName || !lastName || !phone || !email) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Profil mis à jour avec succès", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                          🔹 SUPPRESSION DE COMPTE                          */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     summary: Supprime le compte de l'utilisateur
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                          🔹 ROUTE ADMIN (Liste Users)                      */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs (Admin)
 *     tags: [Users]
 */
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
