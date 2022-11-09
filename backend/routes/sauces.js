/*******************************************************************
 *****      Contenu de l'application (logique de routing)       ****
 *******************************************************************/

const express = require('express'); //importation d'express pour créer le routeur
const router = express.Router(); //création du routeur express
const auth = require('../middleware/auth'); //importation du middleware d'authentification
const multer = require('../middleware/multer-config'); //importation du middleware de config multer
const saucesCtrl = require ('../controllers/sauces'); //importation du controller pour associer les fonctions aux différentes routes

// Route pour la création d'une sauce
router.post('/', auth, multer, saucesCtrl.createSauce);

// Route pour la modification d'une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// Route pour la suppression d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Route pour l'affichage d'une seule sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);

// Route pour l'affichage de toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);

// Route pour la fonction like/dislike
router.post('/:id/like', auth, saucesCtrl.likeSauce);

// Exportation du routeur
module.exports = router; //pour pouvoir l'utiliser sur app.js