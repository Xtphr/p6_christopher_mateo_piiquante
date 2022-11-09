/*******************************************************************
 *****       Création du serveur de développement Node          ****
 *******************************************************************/

const http = require('http'); //importation du package http de node qui permet de créer un serveur
const app = require('./app'); //importation du fichier app.js qui contient l'application express
const dotenv = require('dotenv'); //importation du package dotenv pour stocker les variables d'environnement
dotenv.config(); //fonction pour configurer dotenv

// Fonction normalize pour renvoyer un port valide
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Déclaration du port sur lequel l'application doit tourner
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Recherche et gestion des erreurs dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur pour pouvoir gérer les reqêtes/réponses de l'app (méthode createServer du package http)
const server = http.createServer(app);

// Connexion au port
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); //écoute sur le port défini
