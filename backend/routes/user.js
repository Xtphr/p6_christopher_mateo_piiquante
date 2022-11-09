/*******************************************************************
 *****          Configuration du parcours utilisateur           ****
 *******************************************************************/

const express = require('express'); //importation d'express pour créer le routeur
const router = express.Router(); //création du routeur express
const passwordCheck = require('../middleware/password'); //importation du middleware password
const userCtrl = require('../controllers/user'); //importation du controller pour associer les fonctions aux différentes routes

// Route pour la création d'un utilisateur
router.post('/signup', passwordCheck, userCtrl.signup); //indication du segment de route final car le reste est déjà déclaré dans l'app express

// Route pour la connexion d'un utilisateur
router.post('/login', userCtrl.login); //indication du segment de route final car le reste est déjà déclaré dans l'app express

// Exportation du routeur
module.exports = router; //pour pouvoir l'utiliser sur app.js