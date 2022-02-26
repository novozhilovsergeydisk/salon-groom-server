'use strict';

const { log } = require('./helpers');
const routeList = require('./route-list.js');
const cached = new Map();

class Route {
    constructor(client) {
        this.client = client;
        this.matching = [];
        this.types = {
            object: JSON.stringify,
            string: s => s,
            number: n => n + '',
            undefined: () => undefined,
            function: (fn, par, client) => fn(client, par),
        };
        if (cached.has('matching')) {
            this.routing = cached.get('routes')
            this.matching = cached.get('matching');
        } else {
            this.routing = routeList;
            for (const key in this.routing[client.http_method]) {
                if (key.includes('*')) {
                    const rx = new RegExp('^' + key.replace('*', '(.*)'));
                    const route = this.routing[client.http_method][key];
                    this.matching.push([rx, route]);
                    delete this.routing[client.http_method][key];
                }
            }
            cached.set('routes', this.routing);
            cached.set('matching', this.matching);
        }
    }

    has() {
        const route = this.routing[this.client.http_method][this.client.url];
        let isRoute = false;
        if (!route) {
            let match = null;
            for (let i = 0; i < this.matching.length; i++) {
                const rx = this.matching[i];
                const url = this.client.url;
                match = url.match(rx[0]);
                if (match) {
                    isRoute = true;
                }
            }
        } else {
            isRoute = true;
        }
        return isRoute;
    }

    async resolve() {

        // log('resolve')

        let par;
        const http_method = this.client.http_method;
        let route = this.routing[http_method][this.client.url];
        // log(this.client.url)
        if (!route) {
            for (let i = 0; i < this.matching.length; i++) {
                par = null;
                const rx = this.matching[i];
                const url = this.client.url;



                par = url.match(rx[0]);
                if (par) {
                    const parArr = url.split('/');

                    // log({ parArr })

                    if (parArr.length > 1) {
                        const name = parArr[parArr.length - 2];
                        const value = parArr[parArr.length - 1];
                        par = {name: name, value: value};
                    }
                    route = rx[1];
                    break;
                }
            }
        }
        const type = typeof route;
        const renderer = this.types[type];
        this.route = route;
        this.renderer = renderer;
        this.client.par = par;
        this.par = par;
        if (this.client.body) {
            this.par = this.client.body
        }

        // log(this)

        const ret = await this.renderer(this.route, this.par, this.client);

        // log('ret 2')
        //
        // log({ 'ret.data': ret.data })

        return ret;
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