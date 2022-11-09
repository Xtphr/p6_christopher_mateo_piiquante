/*******************************************************************
 *****     Création du schéma de données pour les sauces        ****
 *******************************************************************/

const mongoose = require('mongoose'); //importation de mongoose pour interagir avec la bdd MongoDB

const sauceSchema = mongoose.Schema({ //fonction schéma du package mongoose
    userId: {type: String, required: true}, //identifiant MongoDB unique de l'user qui a créé la sauce
    name: {type: String, required: true}, //nom de la sauce
    manufacturer: {type: String, required: true}, //fabricant de la sauce
    description: {type: String, required: true}, //description de la sauce
    mainPepper: {type: String, required: true}, //principal ingrédient épicé de la sauce
    imageUrl: {type: String, required: true}, //URL de l'image de la sauce téléchargée par l'user
    heat: {type: Number, required: true}, //nombre entre 1 et 10 décrivant la sauce
    likes: {type: Number, required: true}, //nombre d'utilisateurs qui like
    dislikes: {type: Number, required: true}, //nombre d'utilisateurs qui dislike
    usersLiked: {type: [String], required: true}, //tableau des userId de ceux qui ont liked
    usersDisliked: {type: [String], required: true} //tableau des userId de ceux qui ont disliked
});

// Exportation du modèle Sauce
module.exports = mongoose.model('Sauce', sauceSchema);