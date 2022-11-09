/*******************************************************************
 *****   Configuration du middleware de gestion de fichiers     ****
 *******************************************************************/

const multer = require('multer'); //importation du package multer pour gérer les fichiers entrants

// Dictionnaire des extensions autorisées
const MIME_TYPES ={ //tableau pour résoudre l'extension du fichier appropriée
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ //méthode diskStorage pour indiquer à multer où enregistrer les images

    // Indication de la destination de stockage pour les fichiers de type image
    destination: (req, file, callback) =>{
        callback(null, 'images') //en l'occurrence dans le fichier images
    },
    // Création du nom du fichier de l'image
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_'); //renommer le fichier en gardant son nom d'origine mais en remplacant espaces par "_"
        const extension = MIME_TYPES[file.mimetype]; //renommer l'extension du fichier selon le dictionnaire
        callback(null, name + Date.now() + '.' + extension); //ajout d'un timestamp pour rendre le fichier plus singulier
    }
});

// Exportation de multer configuré
module.exports = multer({storage}).single('image'); //stockage configuré uniquement pour les images
