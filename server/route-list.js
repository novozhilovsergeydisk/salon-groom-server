'use strict';

const { patientController, staticController } = require('./controllers/patients.js');
const cabinetControllers = require('./controllers/cabinet.js');
const reportsControllers = require('./controllers/reports/index.js');
const { Auth } = require('./lib/auth.js');
const mainControllers = require('./controllers/main/index.js');

const routing = {
    'GET': {
        '/': mainControllers.index,
        '/works': mainControllers.works,
        '/price': mainControllers.price,
        '/review': mainControllers.review,
        '/masters': mainControllers.masters,
        '/contacts': mainControllers.contacts,
        '/private': mainControllers.private,
        '/api/activate/*': Auth.activate,
        '/api/refresh': Auth.refresh,
        '/css/*': staticController.staticContent,
        '/js/*': staticController.staticContent,
        '/img/*': staticController.staticContent,
        '/images/*': staticController.staticContent,
        '/fonts/*': staticController.staticContent,
        '/webfonts/*': staticController.staticContent,
        '/favicon.ico': staticController.staticContent,
        '/robots.txt': staticController.staticContent,
        '/sitemap.xml': staticController.staticContent,
        '/client/add': reportsControllers.addClient
    },
    'POST': {
        '/api/register': patientController.register,
        '/api/login': (client, par) => handler(client, 'main', 'login', par, {roles: ['admin']}),
        '/api/logut': (client, par) => handler(client, 'main', 'logout', par, {roles: ['admin']}),
        '/sendmail': mainControllers.send,
        '/order': mainControllers.order
    }
};

module.exports = routing;

