/*******************************************************************
 *****      Contenu de l'application (logique globale)          ****
 *******************************************************************/

const express = require('express'); //importation d'express (framework Node) pour créer l'application
const mongoose = require('mongoose'); //importation mongoose pour interagir avec la bdd MongoDB
const path = require('path'); //importation de path pour gérer les chemins de fichiers
const helmet = require('helmet'); //importation du module de sécurité helmet
const dotenv = require('dotenv'); //importation du module de sécurité dotenv
dotenv.config();
const mongoSanitize = require('express-mongo-sanitize'); //importation du package express mongo sanitize

const saucesRoutes = require('./routes/sauces'); //importation du routeur sauces
const userRoutes = require('./routes/user'); //importation du routeur user

const app = express(); //création de l'application express
app.use(express.json()); //lecture du corps des requêtes de content type json sur l'objet req.body (remplace body-parser)
app.use(helmet()); //utilisation du module helmet pour sécuriser les en-têtes http et éviter les atatques de script


// Connexion à la base de données
mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_CLUSTER + '.mongodb.net/' + '?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie.'))
  .catch(() => console.log('Connexion à MongoDB échouée.'));


// Traitement des erreurs de CORS
app.use((req, res, next) => { //middleware général qui s'applique à toutes les requêtes du serveur (use) pour éviter une erreur CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); //n'importe quelle origine peut accéder à l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //autorisation de certains en-têtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //autorisation de certaines méthodes
    next(); //appel du middleware suivant
});

// Utilisation du sanitizer
app.use(mongoSanitize({ replaceWith: '_'})); //pour remplacer les caractères interdits ($ et .) en underscores

// Indication des accès principaux
app.use('/api/sauces', saucesRoutes); //enregistrement du routeur pour toutes les demandes effectuées sur api/sauces
app.use('/api/auth', userRoutes); //enregistrement du routeur à la racine des routes liées à l'authentification
app.use('/images', express.static(path.join(__dirname, 'images'))); //traitement statique du dossier /images pour gérer les requêtes vers cette route

// Exportation de l'app
module.exports = app; //pour y accéder depuis les autres fichiers (notamment sur server.js)