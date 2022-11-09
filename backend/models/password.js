/*******************************************************************
 *****       Création du schéma de mot de passe sécurisé        ****
 *******************************************************************/

 // Importation du package password-validator
const passwordValidator = require("password-validator");

// Création du schéma de mot de passe
const passwordSchema = new passwordValidator();

// Contraintes que doit respecter le mot de passe
passwordSchema
  .is().min(5) // Minimum length 5
  .is().max(100) // Maximum length 100
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits(1) // Must have at least 1 digit
  .has().not().spaces() // Should not have spaces
  .is().not().oneOf(["Passw0rd", "Password123", "Etp0urqu0ipasluiaussi"]); // Blacklist these values

module.exports = passwordSchema;