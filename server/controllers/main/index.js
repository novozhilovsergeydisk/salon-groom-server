// const nunjucks = require('nunjucks');
const adminService = require('../../services/admin-service.js');
const { DTOFactory, postTransform, promise, log } = require('../../helpers.js');
const { tmpl } = require('../../lib/Renderer/index.js');
// const { VIEWS_PATH } = require('../../../constants.js');
// const path = require('path');
// const fs = require('fs');
// const { Client, Pool } = require('pg');
// const { VIEWS_PATH, STATIC_PATH } = require('../../constants.js');
// const nunjucks = require('nunjucks');
const cached = new Map();
// log({ VIEWS_PATH })
// log('fin')
// nunjucks.configure(VIEWS_PATH, { autoescape: true });
// const userService = require('../../services/user-service.js');
const conf = require('../../conf.js');
// const { parse } = require('querystring');

// const nodemailer = require('nodemailer');
//
// const transporter = nodemailer.createTransport({
//     host: conf.mailer.host,
//     port: conf.mailer.port,
//     secure: conf.mailer.secure,
//     auth: {
//         user: conf.mailer.auth.user,
//         pass: conf.mailer.auth.pass
//     }
// });

// log(generateToken());

// Handlers
class mainControllers {
    async order(client) {
        let { phone } = client.body;
        phone = decodeURIComponent(phone);
        let data = null;
        const res = await adminService.clientByPhone(phone);
        if (res.length === 0) {
            const result = await adminService.addUser(client.body);
            const client_id = result[0].id;
            const name = result[0].name;
            const phone = result[0].phone;
            const order = await adminService.addOrder(client_id).catch(error => log({ error }));
            data =  { order: order[0], client: { name: name, phone: phone }, status: 'success' }
        } else {
            const client_id = res[0].id;
            const name = res[0].name;
            const phone = res[0].phone;
            const order = await adminService.addOrder(client_id).catch(error => log({ error }));
            data = { order: order[0], client: { name: name, phone: phone }, status: 'success' }
        }
        const dto  = DTOFactory({data: data});
        log({ dto })
        return dto
    }
    async send(client) {
        const body = decodeURIComponent(client.body);

        // log({ body });

        // const bodyArr = body.split('&');
        //
        // bodyArr.forEach(item => {
        //     let newArr = item.split('=');
        // });
        //
        // const jsonString = JSON.stringify(Object.assign({}, bodyArr))
        //
        // log({ jsonString });

        return DTOFactory({ stream: body });
    }

    async price() {
        return DTOFactory({ stream: tmpl.process({ data: [] }, 'price/index.html') });
    }

    async review() {
        return DTOFactory({ stream: tmpl.process({ data: [] }, 'review/index.html') });
    }

    async works() {
        return DTOFactory({ stream: tmpl.process({ data: [] }, 'our-works/index.html') });
    }

    async masters() {
        return DTOFactory({ stream: tmpl.process({ data: [] }, 'our-masters/index.html') });
    }

    async contacts() {
        return DTOFactory({ stream: tmpl.process({ data: [] }, 'contacts/index.html') });
    }

    async index(client) {
        // log({ 'client.yandexContent': client.yandexContent, 'client.url': client.url })

        // {% if user.authorised %}
        // {% extends "logged-in.html" %}
        // {% else %}
        // {% extends "logged-out.html" %}
        // {% endif %}
        // log({ VIEWS_PATH })
        // log(nunjucks)
        // return DTOFactory({ stream: 'test' });
        return DTOFactory({ stream: tmpl.process({ yandexContent: client.yandexContent }, 'main/index.html') });
    }

    async private() {
        return DTOFactory({ stream: 'test' });
        // return DTOFactory({ stream: nunjucks.render('private/index.html', { main: [] }) });
    }

    async refresh() {
        return DTOFactory({ stream: 'refresh' });
    }

    async activate() {
        return DTOFactory({ stream: 'activate' });
    }

    async register(client) {
        try {
            // log({ client });
            // log(typeof client.body);

            const json = JSON.parse(client.body);

            // log(json.email);

            // const { req, res } = client;


            // userService.register();

            return DTOFactory({ stream: nunjucks.render('register/index.html', patients) });
        } catch (e) {

        }
    }
}

const mainController = new mainControllers();

module.exports = mainController;