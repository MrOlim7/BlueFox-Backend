const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./User');
const postRoutes = require('./routes/postRoutes'); // Import du routeur
const router = express.Router(); // Initialise le routeur
require('dotenv').config();


const app = express();
const SECRET_KEY = 'supersecretkey123';

app.use(cors()); // Middleware CORS
app.use(express.json()); // Pour gérer les requêtes JSON

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function() {
    console.log('Connexion réussie à MongoDB');
  })
  .catch(function(err) {
    console.error('Erreur lors de la connexion à MongoDB', err);
  });

// Routes
app.use('/api', postRoutes); // Préfixe toutes les routes des posts avec /api

// Middleware pour traiter le JSON
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));

app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend de BlueFox !');
});

// Route pour créer un nouveau post
router.post('/posts', async (req, res) => {
  const { username, text } = req.body;

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

// Utilise le routeur
app.use('/api', router);

// Route signup
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès!' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du compte.' });
  }
});

// Route login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    res.status(200).json({ message: 'Connexion réussie !' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
});

// Route login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    res.status(200).json({ message: 'Connexion réussie !' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
});

// Route pour obtenir tous les posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Trier par date décroissante
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
