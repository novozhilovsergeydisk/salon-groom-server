'use strict'

const { SERVER_PATH } = require('../constants.js');
const { asyncLocalStorage } = require(SERVER_PATH + '/lib/Logger');
const { DTOFactory, capitalizeFirstLetter, log } = require(SERVER_PATH + '/helpers');
const { patientController, staticController } = require('./controllers/patients.js');
const cabinetControllers = require('./controllers/cabinet.js');
const reportsControllers = require('./controllers/reports/index.js');
const { Auth } = require(SERVER_PATH + '/lib/auth.js');
const mainControllers = require('./controllers/main/index.js');

const auth = new Auth();

class Route {
    constructor(client) {
        this.matching = [];

        this.types = {
            object: JSON.stringify,
            string: s => s,
            number: n => n + '',
            undefined: () => { return { status: '404 not found' } },
            function: (fn, par, client) => fn(client, par),
        };

        this.routing = {
            'GET': {
                '/': mainControllers.index,
                '/works': mainControllers.works,
                '/price': mainControllers.price,
                '/review': mainControllers.review,
                '/masters': mainControllers.masters,
                '/contacts': mainControllers.contacts,
                '/api/activate/*': auth.activate,
                '/api/refresh': auth.refresh,
                '/api/register': patientController.register,
                '/css/*': staticController.staticContent,
                '/js/*': staticController.staticContent,
                '/img/*': staticController.staticContent,
                '/images/*': staticController.staticContent,
                '/fonts/*': staticController.staticContent,
                '/webfonts/*': staticController.staticContent,
                '/favicon.ico': staticController.staticContent,
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

        this.client = client;
        for (const key in this.routing[client.http_method]) {
            if (key.includes('*')) {
                const rx = new RegExp('^' + key.replace('*', '(.*)'));
                const route = this.routing[client.http_method][key];
                this.matching.push([rx, route]);
                delete this.routing[client.http_method][key];
            }
        }
    }

    resolve() {
        let par;
        const http_method = this.client.http_method;
        let route = this.routing[http_method][this.client.url];
        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                par = null;
                const rx = this.matching[i];
                const url = this.client.url;
                par = url.match(rx[0]);
                if (par) {
                    const parArr = url.split('/');
                    if (parArr.length > 1) {
                        const name = parArr[parArr.length - 2];
                        const value = parArr[parArr.length - 1];
                        par = { name: name, value: value };
                    }
                    route = rx[1];
                    break;
                }
            }
        }
        const type = typeof route;
        const renderer = this.types[type];
        if (this.client.mimeType === 'text/html; charset=UTF-8') {
            const arr = this.client.url.split('/');
            this.client.controller = arr[1] ? arr[1] : 'main';
            this.client.method = arr[2] ? arr[2] : 'index';
        }
        this.route = route;
        this.renderer = renderer;

        //



        //

        this.client.par = par;
        this.par = par;

        if (http_method === 'GET') {
            const ret = this.renderer(this.route, this.par, this.client);
            return ret;
        }

        if (http_method === 'POST') {
            return this;
        }
    }
}

module.exports = Route;

// const routes = [
//     {
//         method: 'GET',
//         url: '/api/patients',
//         handler: patientController.getAllPatients
//     },
//     {
//         method: 'GET',
//         url: '/api/patients/:id',
//         handler: patientController.getPatient
//     },
//     {
//         method: 'POST',
//         url: '/api/patients',
//         handler: patientController.addPatient
//     },
//     {
//         method: 'PUT',
//         url: '/api/patients/:id',
//         handler: patientController.updatePatient
//     },
//     {
//         method: 'DELETE',
//         url: '/api/patients/:id',
//         handler: patientController.deletePatient
//     }
// ];