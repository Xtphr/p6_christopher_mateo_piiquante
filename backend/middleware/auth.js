/*******************************************************************
 *****      Configuration du middleware d'authentification      ****
 *******************************************************************/

const jwt = require('jsonwebtoken'); //importation du package jsonwebtoken pour créer des tokens d'identification
const dotenv = require('dotenv'); //importation du module dotenv pour gérer les données d'environnement
dotenv.config(); //fonction pour utiliser dotenv

// Exportation du middleware d'authentification
module.exports = (req, res, next) =>{
    try{
        // Récupération du token d'authentification
        const token = req.headers.authorization.split(' ')[1]; //methode split pour récupérer le token après l'espace "bearer" dans le header
        // Décodage du token d'authentification
        const decodedToken = jwt.verify(token, process.env.JWTPRIVATEKEY); //méthode verify pour décoder le token
        // Récupération du userId encodé dans le token
        const userId = decodedToken.userId;
        req.auth ={ //rajout du token à l'objet request pour pouvoir l'exploiter sur les différentes routes
            userId: userId
        };
        next(); //si user authentifié, on exécute la fonction suivante
    } catch(error){
        res.status(401).json({error});
    }
};