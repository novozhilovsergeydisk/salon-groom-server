const nunjucks = require('nunjucks');
const adminService = require('../../services/admin-service.js');
const { DTOFactory, postTransform, promise, log } = require('../../helpers.js');
const { VIEWS_PATH } = require('../../../constants.js');
// const path = require('path');
// const fs = require('fs');
// const { Client, Pool } = require('pg');
// const { VIEWS_PATH, STATIC_PATH } = require('../../constants.js');
// const nunjucks = require('nunjucks');
const cached = new Map();
nunjucks.configure(VIEWS_PATH, { autoescape: true });
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
        const body = postTransform(client.body)
        const res = adminService.clientByPhone(body.phone);

        // log({ res })

        const data = res.then(data => {
            if (data.length === 0) {
                // const info = data.name + ' | ' + data.email;
                const result = adminService.addUser(body);
                return promise(result).then(data => {
                    const client_id = data[0].id;
                    const name = data[0].name;
                    const phone = data[0].phone;
                    // log(client_id)
                    const order = adminService.addOrder(client_id).catch(error => log({ error }));
                    return { order: order, client: { name: name, phone: phone } }
                    // log({ result })
                    // return result;
                })
            } else {
                const client_id = data[0].id;
                const name = data[0].name;
                const phone = data[0].phone;
                const order = adminService.addOrder(client_id).catch(error => log({ error }));
                return { order: order, client: { name: name, phone: phone } }

                // return  adminService.addOrder(client_id).catch(error => log({ error }));
                // return result;
                // log({ result })

                // result.then(data => log({ data }));

                // return 'ui 2';
            }
        })
        .catch(err => log({ err }))

        // return res;

        // log({ data })
        //
        // data.then(data__ => log({ data__ }))

        return DTOFactory({data: data})

        // return dto;

        // let stream = null;
        // const id = client.par.value;
        // if (cached.has(`clinicById(${id})`)) {
        //     console.time('cached-clinicHTML');
        //     const clinics = cached.get(`clinicById(${id})`);
        //     if (cachedHTML.has(`clinicById(${id})`)) {
        //         const render = cachedHTML.get(`clinicById(${id})`)
        //         stream = promise(render);
        //     } else {
        //         const render = nunjucks.render('reports/index.html', { clinics: clinics });
        //         cachedHTML.set(`clinicById(${id})`, render);
        //         stream = promise(render);
        //     }
        //     console.timeEnd('cached-clinicHTML');
        //     log({ 'cachedHTML.size':cachedHTML.size })
        //     return DTOFactory({ stream: stream });
        //     // cached.set(`clinicById(${id})`, clinics);
        // } else {
        //     console.time('clinicById');
        //     const data = adminService.clinicById(id)
        //     ;
        //     stream = data
        //         .then(clinics => {
        //             if (!cached.has(`clinicById(${id})`)) {
        //                 cached.set(`clinicById(${id})`, clinics);
        //             }
        //             // const patients = [{ title: "Иванов", id: 1 }, { title: "Новожилов", id: 2}, { title: "Гришин", id: 3}];
        //             const render = nunjucks.render('reports/index.html', { clinics: clinics });
        //
        //             // log(typeof render);
        //
        //             return render;
        //
        //         })
        //         .catch(error => {
        //             log({ error });
        //             return '<h1>500</h1>' + `<strong>${error}</strong>`;
        //         });
        //     console.timeEnd('clinicById');
        //     log({ 'cachedHTML.size':cachedHTML.size })
        //     return DTOFactory({ stream: stream });
        // }
    }

    async order__(cli) {
        // log({cli});
        const { phone } = cli.body;
        // log({ phone });
        const client = adminService.clientByPhone(phone);

        log({ client });

        const clientData = client
            .then(cliData => {
                // log({ cliData });

                // log(d[0].id);
                //
                // if (d[0].id > 0) {
                //     order__(cli);
                // }

                // const dto = DTOFactory({stream: cliData});
                return cliData;
            })
            .catch(err => {
                log({ err });
                const dto = DTOFactory({stream: null});
                dto.status = 'failed';
                dto.error = err;
                return dto;
            });

        // const data = adminService.addClient(cli);

        log({ clientData });

        // const result = clientData.then(data__ => {
        //     log({ data__ });
        //
        //     // const stream__ = data__.stream;
        //
        //     // log({ stream__ })
        //
        //     // log({ 'stream__.length': stream__.length });
        //
        //     if (data__.length === 0) {
        //         const data = adminService.addClient(cli);
        //         const stream = data
        //             .then(d => {
        //                 log({ d });
        //
        //                 return d;
        //
        //                 // log(d[0].id);
        //                 //
        //                 // if (d[0].id > 0) {
        //                 //     order__(cli);
        //                 // }
        //
        //                 // const dto = DTOFactory({stream: d});
        //                 // return dto;
        //             })
        //             .catch(error => {
        //                 // log('ERROR');
        //                 log({ error });
        //                 const dto = DTOFactory({stream: null});
        //                 dto.status = 'failed';
        //                 dto.error = error;
        //                 return dto;
        //                 // return '<h1>500</h1>' + `<strong>${error}</strong>`;
        //             });
        //
        //         log({ stream });
        //
        //         return stream;
        //
        //         // log({ data__ });
        //     }
        // });

        const order__ = (cli => {
            log({ cli });
            // const data = adminService.addClient(cli);
            // const stream = data
            //     .then(data => {
            //         // log({ data });
            //
            //         return data;
            //
            //     })
            //     .catch(error => {
            //         log({error});
            //         return '<h1>500</h1>' + `<strong>${error}</strong>`;
            //     });
            //
            // // log({ stream });
            //
            // stream.then(d => {
            //     log({d});
            // });
            //
            // return DTOFactory({stream: stream});
        });

        // order__(cli);

        // const stream = data
        //     .then(d => {
        //         log({ d });
        //
        //         // log(d[0].id);
        //         //
        //         if (d[0].id > 0) {
        //             order__(cli);
        //         }
        //
        //         const dto = DTOFactory({stream: d});
        //         return dto;
        //     })
        //     .catch(error => {
        //         // log('ERROR');
        //         log({ error });
        //         const dto = DTOFactory({stream: null});
        //         dto.status = 'failed';
        //         dto.error = error;
        //         return dto;
        //         // return '<h1>500</h1>' + `<strong>${error}</strong>`;
        //     });
        //
        // return stream;

        // log({ err });


        const dump = (result => {
            result.then(data => {
                log({ data })
            })
        });


        // stream.then(d => {
        //     log({d});
        // });
        // const dto = DTOFactory({stream: stream});
        // dto.foo = 'bar';
        // log({ dto });

        // log({ result })
        //
        // // dump(result);
        //
        // result.then(data => {
        //     log({ data })
        //     // log(data.stream)
        // })

        return DTOFactory({stream: {foo: 'bar'}});
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
        return DTOFactory({ stream: nunjucks.render('price/index.html', { masters: [] }) });
    }

    async review() {
        return DTOFactory({ stream: nunjucks.render('review/index.html', { masters: [] }) });
    }

    async works() {
        return DTOFactory({ stream: nunjucks.render('our-works/index.html', { masters: [] }) });
    }

    async masters() {
        return DTOFactory({ stream: nunjucks.render('our-masters/index.html', { masters: [] }) });
    }

    async contacts() {
        return DTOFactory({ stream: nunjucks.render('contacts/index.html', { contacts: [] }) });
    }

    async index() {
        return DTOFactory({ stream: nunjucks.render('main/index.html', { main: [] }) });
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