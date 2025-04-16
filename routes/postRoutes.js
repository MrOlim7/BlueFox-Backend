const express = require('express');
const router = express.Router();
const Post = require('../Posts'); // Assure-toi que le modèle Post est défini

// Route pour récupérer tous les posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Erreur lors du chargement des posts :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// Route pour créer un post
router.post('/posts', async (req, res) => {
  const { username, text } = req.body;
  console.log("Pseudo reçu :", username); // Ajoute ce log

  if (!username || !text) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const newPost = new Post({ username, text });
    await newPost.save();
    res.status(201).json({ message: "Post créé avec succès.", post: newPost });
  } catch (error) {
    console.error("Erreur lors de la création du post :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});


module.exports = router; // Export du routeur
