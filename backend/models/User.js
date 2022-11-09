/*******************************************************************
 *****   Création du schéma de données pour les utilisateurs    ****
 *******************************************************************/

const mongoose = require('mongoose'); //importation de mongoose pour interagir avec la bdd MongoDB
const uniqueValidator = require('mongoose-unique-validator'); //importation du package uniqueValidator pour valider les informations

// Création du modèle utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true}, //unique pour pas que plusieurs utilisateurs utilisent le même email
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator); //fonction pour prévalider les informations avant de les enregistrer

// Exportation du modèle utilisateur
module.exports = mongoose.model('User', userSchema);