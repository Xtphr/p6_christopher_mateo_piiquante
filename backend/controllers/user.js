/*******************************************************************
 *****         Configuration du contrôleur d'utilisateur        ****
 *******************************************************************/

const bcrypt = require('bcrypt'); //importation de bcrypt pour hasher les passwords
const jwt = require('jsonwebtoken'); //importation de jsonwebtoken pour créer/modifier les tokens d'authentification
const dotenv = require('dotenv');
dotenv.config();
const User = require ('../models/User'); //importation du modèle utilisateur pour l'utiliser


// Fonction d'inscription pour un nouvel utilisateur
exports.signup = (req, res, next) =>{ //middleware pour l'inscription de new user
    bcrypt.hash(req.body.password, 10) //méthode hash appliquée 10 fois (sinon pas assez sécurisé / trop long)
    .then(hash =>{
        const user = new User({ //création d'un nouvel utilisateur selon le modèle
            email: req.body.email,
            password: hash
        });
        user.save() //enregistrement dans la bdd
        .then(() => res.status(201).json({message: 'Utilisateur créé.'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

// Fonction de connexion pour un utilisateur existant
exports.login = (req, res, next) =>{ //middleware pour la connexion d'un user existant
    User.findOne({email: req.body.email}) //méthode findOne pour récupérer la saisie de l'email
    .then(user =>{
        // Vérification de l'user
        if (!user){ //si utilisateur non enregistré dans la bdd
            res.status(401).json({message: 'Utilisateur inconnu.'}); //erreur d'autorisation
        } else{ //si utilisateur ok
            // Vérification du password
            bcrypt.compare(req.body.password, user.password) //méthode compare pour vérifier le mdp
            .then(valid =>{
                if (!valid){ //si mdp incorrect
                    res.status(401).json({message: 'Mot de passe incorrect.'}); //renvoi erreur d'autorisation
                } else{ //si mdp correct
                    res.status(200).json({ //validation de la connexion
                        // Attribution d'un token d'authentification
                        userId: user._id, //récupération de l'userId exact
                        token: jwt.sign( //méthode sign de jsonwebtoken pour chiffrer un nouveau token
                            { userId: user._id }, //un token qui contient l'id de l'user en tant que playload (données encodées dans le token)
                            process.env.JWTPRIVATEKEY, //utilisation d'une chaine secrete de dvp aléatoire pour crypter le token
                            {expiresIn: '24h'} //durée de validité du token
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({error})); //sinon erreur serveur car erreur de traitement
        }
    })
    .catch(error => res.status(500).json({error})); //sinon erreur serveur
};