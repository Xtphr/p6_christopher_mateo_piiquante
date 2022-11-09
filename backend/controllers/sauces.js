/*******************************************************************
 *****        Contenu de l'application (logique métier)         ****
 *******************************************************************/

const Sauce = require('../models/Sauce'); //importation du modèle produit
const fs = require('fs'); //importation des fonctions du FileSystem

// Fonction pour la création d'une sauce
exports.createSauce = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce); //obtention d'un objet utilisable sous form-data avec méthode parse
    delete sauceObject._id; //suppression de l'id de l'objet car il sera généré par la bdd
    delete sauceObject._userId; //suppression de l'userId par sécurité et on le remplace plus bas en bdd par l'userId extrait du token par le middleware d'auth
    const sauce = new Sauce({ //création d'une instance du modèle Sauce
        ...sauceObject, //en lui passant les informations requises du corps de requête
        likes: 0, //nb likes initialisé à 0
        dislikes: 0, //nb dislikes initialisé à 0
        usersLiked: [], //tableau des likers
        usersDisliked: [], //tableau des dislikers
        userId: req.auth.userId, //on remplace ici l'userID
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //url complète de l'image : http://localhost/images/filename
    });
    sauce.save() //méthode save pour enregistrer la sauce dans le bdd, renvoie une promise
    .then(() => res.status(201).json({message:'Sauce enregistrée.'})) //code de réussite
    .catch(error => res.status(400).json({error})); //code d'erreur (racourci de "error: error")
};

// Fonction pour l'affichage d'une seule sauce
exports.getOneSauce = (req, res, next) =>{ //route getOne pour renvoyer une sauce de la bdd
    Sauce.findOne({_id: req.params.id}) //promise qui renvoie un tableau d'une sauce de la bdd en fonction de son id
    .then(sauce => res.status(200).json(sauce)) //succés
    .catch(error => res.status(404).json({error})); //erreur
};


// Fonction pour l'affichage de toutes les sauces
exports.getAllSauces = (req, res, next) =>{ //route getAll pour renvoyer toutes les sauces de la bdd
    Sauce.find() //promise qui renvoie un tableau de toutes les sauces de la bdd
    .then(sauces => res.status(200).json(sauces)) //succés
    .catch(error => res.status(400).json({error})); //erreur
};

// Fonction pour la modification d'une sauce

exports.modifySauce = (req, res, next) => { //route modify pour modifier une sauce
    let sauceObject = {}; //variable de l'objet sauce
    req.file ? ( //si il y a un champ file dans la requête (càd que l'image est modifiée)
        Sauce.findOne({_id: req.params.id}) //récupération de l'objet dans la base de donnée
        .then(sauce => {
            if(req.auth.userId !== sauce.userId){ //si l'userId de la bdd est différent de l'userId du token
                res.status(403).json({message: 'Non autorisé !'}) //erreur d'autorisation car utilisateur malveillant
            } else { //sinon, si l'utilisateur est vérifié
                const filename = sauce.imageUrl.split('/images/')[1]; //récupération du nom du fichier grâce à split autour du dossier images
                fs.unlinkSync(`images/${filename}`) //méthode unlink async pour supprimer de manière asynchrone l'image
            }
        }),
        sauceObject = {
            ...JSON.parse(req.body.sauce), //méthode parse pour obtenir un form-data utilisable (qui n'est pas une chaine de caractères)
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //et recréation de l'url de l'image
        }
    ) : sauceObject = {...req.body} //si il n'y a pas de fichier transmis, simple récupération de l'objet dans le corps de la requête
    delete sauceObject._userId; //suppression de l'user id venant de la requête (mesure de sécurité pour pas qu'un utilisateur modifie l'objet avec l'id d'un autre utilisateur)
    Sauce.findOne({_id: req.params.id}) //récupération de l'objet dans la base de donnée
    .then((sauce) =>{
        if (sauce.userId != req.auth.userId){ //si l'userId de la bdd est différent de l'userId du token
            res.status(401).json({message: 'Non autorisé.'}); //erreur d'autorisation car utilisateur malveillant
        } else{ //sinon ok, l'utilisateur est vérifié
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}) //mise à jour de l'enregistrement avec l'id qui vient des paramètres de l'url
            .then(() => res.status(200).json({message: 'Sauce modifiée.'})) //message de succés
            .catch(error => res.status(401).json({error})); //sinon erreur
        }
    })
    .catch(error => res.status(400).json({error})); //sinon erreur
};

// Fonction pour la suppression d'une sauce
exports.deleteSauce = (req, res, next) =>{ //route delete pour supprimer une sauce
    Sauce.findOne({_id: req.params.id}) //récupération de l'objet dans la bdd
    .then((sauce =>{
        if (sauce.userId != req.auth.userId){ //si l'userId de la bdd est différent de l'userId du token
            res.status(401).json({message: 'Non autorisé.'}) //erreur d'autorisation car utilisateur malveillant
        } else{ //si l'utilisateur est vérifié
            const filename = sauce.imageUrl.split('/images/')[1]; //récupération du nom du fichier grâce à split autour du dossier images
            fs.unlink(`images/${filename}`, () =>{ //suppression de l'image avec fonction unlink
                Sauce.deleteOne({_id: req.params.id}) //suppression de la sauce
                .then(() => res.status(200).json({message: 'Sauce supprimée.'})) //réponse ok
                .catch(error => res.status(401).json({error})); //sinon erreur
            })
        }
    }))
    .catch(error => res.status(500).json({error})); //sinon erreur serveur
};

/*****************************************
 ** ANCIENNE VERSION DU CONTROLLER LIKE **
 *****************************************
// Fonction pour le like/dislike d'une sauce
exports.likeSauce = (req, res, next) =>{ //route likeSauce pour liker/disliker une sauce
    Sauce.findOne({_id: req.params.id}) //récupération de l'objet dans la bdd
    .then (sauce =>{
        if(sauce.usersDisliked.indexOf(req.body.userId) === -1 && sauce.usersLiked.indexOf(req.body.userId) === -1){ //si l'user n'a ni liked/disliked
            if(req.body.like === 1){ //si l'user veut liker une sauce
                sauce.usersLiked.push(req.body.userId); //ajout de l'userId dans l'array
                sauce.likes += req.body.like; //mise à jour du nb de likes
            } else if(req.body.like === -1){ //l'user veut disliker une sauce
                sauce.usersDisliked.push(req.body.userId); //ajout de l'userId dans l'array
                sauce.dislikes -= req.body.like; //mise à jour du nb de likes
            };
        };
        if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like === 0){ //l'user veut unliker une sauce likée
            const likesUserIndex = sauce.usersLiked.findIndex(user => user == req.body.userId); //recherche de l'user (vérifié) dans l'array
            sauce.usersLiked.splice(likesUserIndex, 1); //méthode splice pour retirer l'user de l'array
            sauce.likes -= 1; //mise à jour du nb de likes
        };
        if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like === 0){ //l'user veut reliker une sauce dislikée
            const likesUserIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId); //recherche de l'user (vérifié) dans l'array
            sauce.usersDisliked.splice(likesUserIndex, 1); //méthode splice pour rajouter l'user dans le bon array
            sauce.dislikes -= 1; //mise à jour du nb de likes
        };
        sauce.save(); //enregistrement du produit dans la bdd
        res.status(201).json({message: 'Mention like mise à jour.'}); //statut ok
    })
    .catch(error => res.status(500).json({error})); //Sinon erreur serveur
};
*/

/*****************************************
 ** NOUVELLE VERSION DU CONTROLLER LIKE **
 ****************************************/

exports.likeSauce = (req, res, next) =>{ 
    const userId= req.body.userId; //raccourci userId
    const sauceId = req.params.id; //raccourci sauceId
    const liking = req.body.like; //raccourci liking

    switch(liking){ //instruction switch selon le "like: (number)" de la requête
        case 1: //like = 1
            Sauce.findOne({_id: sauceId}) //recherche sauce dans la bdd
            .then(sauce =>{
                if(sauce.usersLiked.includes(userId)){ //si l'user est déjà dans l'array des likers
                    res.status(400).json({message:"Sauce déjà likée !"}); //msg d'erreur
                } else if(sauce.usersLiked.indexOf(userId) === -1){ //sinon, si l'user est bien absent de l'array des likers
                    Sauce.updateOne({_id: sauceId}, {$inc:{likes:1}, $push:{usersLiked: userId}}) //méthode update pour mettre à jour l'array des likers + nb de likes
                    .then(() => res.status(200).json({message: "Sauce likée."})) //confirmation
                    .catch(() => res.status(400).json({message:"Erreur lors d'un like (case 1.else)"})); //catch erreur 
                };
            })
            .catch(() => res.status(400).json({message:"Erreur dans le switch du case 1"})); //catch erreur
        break;

        case 0: //like =0
            Sauce.findOne({_id: sauceId}) //recherche de la sauce dans la bdd
            .then(sauce =>{
                if(sauce.usersLiked.includes(userId)){ //si l'user avait liké la sauce (méthode includes)
                    Sauce.updateOne({_id: sauceId}, {$inc:{likes: -1}, $pull:{usersLiked: userId}}) //on met à jour en retirant l'user de l'array des likers
                    .then(() => res.status(200).json({message: "Sauce unlikée."})) //confirmation
                    .catch(() => res.status(400).json({message:"Erreur lors d'un unlike (case 0.if)"})); //catch erreur
                } else if(sauce.usersDisliked.includes(userId)){ //sinon si l'user avait disliké la sauce
                    Sauce.updateOne({_id: sauceId}, {$inc:{dislikes: -1}, $pull:{usersDisliked: userId}}) //on met à jour en retirant l'user de l'array dislikers
                    .then(() => res.status(200).json({message: "Sauce undislikée."})) //confirmation
                    .catch(() => res.status(400).json({message:"Erreur lors d'un undislike (case 0.else)"})); //catch erreur
                };
            })
            .catch(() => res.status(400).json({message: "Erreur dans le switch du case 0"}));
        break;

        case -1: //like = -1
            Sauce.findOne({_id: sauceId}) //recherche de la sauce dans la bdd
            .then(sauce =>{
                if(sauce.usersDisliked.includes(userId)){ //si l'user avait déjà disliké la sauce
                    res.status(400).json({message:"Sauce déjà dislikée !"}); //msg d'erreur
                } else if(sauce.usersDisliked.indexOf(userId) === -1){ //sinon, si l'user est bien absent de l'array des dislikers
                    Sauce.updateOne({_id: sauceId}, {$inc:{dislikes: 1}, $push:{usersDisliked: userId}}) //on met à jour en rajoutant l'user à l'array des disliker + nb de likes
                    .then(() => res.status(200).json({message: "Sauce dislikée."})) //confirmation
                    .catch(() => res.status(400).json({message:"Erreur lors d'un dislike (case -1.else)"})); //catch erreur
                };
            })
            .catch(() => res.status(400).json({message:"Erreur dans le switch du case -1"})); //catch erreur
        break;
        
        default: //si aucun case n'est satisfait (donc que : like < -1 || like > 1)
        console.log("normalement c'est ok");
        res.status(401).json({message: "Vote invalide."}); //erreur catchée
    };
};