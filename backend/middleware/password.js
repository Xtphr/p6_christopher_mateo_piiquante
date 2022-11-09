/*******************************************************************
 *****            Configuration de passwordValidator            ****
 *******************************************************************/

// Importation du schéma de mot de passe
const passwordSchema = require("../models/password");

//Fonction pour vérifier le mot de passe
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.writeHead(
      400,
      "Le mot de passe doit comprendre 8 caractères min. dont un chiffre et sans espace",
      {
        "content-type": "application/json",
      }
    );
    res.end("Le format du mot de passe est incorrect.");
  } else {
    next();
  }
};











/* PREMIERE CONFIGURATION
// Importation du package password-validator
const passwordValidator = require('password-validator');

// Création du schéma de mot de passe
const passwordSchema = new passwordValidator();

// Schéma que doit respecter le mot de passe
passwordSchema
.is().min(5)                                    // Minimum length 5
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Vérification de la qualité du password
module.exports = (req, res, next) =>{
    if(passwordSchema.validate(req.body.password)){
        next();
    } else{
        return res
        .status(400)
        .json({error: "Le mot de passe n'est pas assez fort : "+ passwordSchema.validate('req.body.password', {list: true})})
    }
};
*/