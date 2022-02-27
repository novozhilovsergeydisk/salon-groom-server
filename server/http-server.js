'use strict'

const http = require('http');
// const path = require('path');
const Route = require('./routes.js');
const ClientApp = require('./lib/Client.js');
const {bufferConcat, replace, memory, notifyOrder, log} = require('./helpers.js');
const conf = require('./conf.js');
const { mkd } = require('./lib/Renderer/index.js');
const mailAdmin = require('./lib/MailerAdmin.js');
const querystring = require('querystring');

// const cache = new Map();
// const routeList = require('./route-list.js');
// cache.set('routeList', routeList);

// log({ cache })


// const { MIME_TYPES } = require('./const.js');
// const {mail} = require('./services/mail-service.js');

// simplicity and flexibility | SAF platform | flexify
//  SAF - server platform for building applications

// const fs = require("fs"); // Or 'import fs from "fs";' with ESM
// if (fs.existsSync(path)) {
//     // Do something
// }

// const { sys } = require('util');
//
// log({ sys });

// sys.puts(sys.inspect(someVariable));

log({ conf })

process.env.PGHOST = conf.db.host;
process.env.PGUSER = conf.db.user;
process.env.PGDATABASE = conf.db.name;
process.env.PGPASSWORD = conf.db.password;
process.env.PGPORT = conf.db.port;

console.table(memory())

// export const IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i

// const Ajv = require("ajv")
// const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
//
// const schema = {
//     type: "object",
//     properties: {
//         foo: {type: "integer"},
//         bar: {type: "string"}
//     },
//     required: ["foo", "bar"],
//     additionalProperties: false
// }
//
// const validate = ajv.compile(schema)
//
// const data = {
//     foo: 1,
//     bar: "mem"
// }
//
// const valid = validate(data)
// if (!valid) console.log(validate.errors)

// log(generateToken());
// log(hash());

// const cachedPromise = new Map();
// const { Auth } = require('./lib/auth.js');

// http://espressocode.top/http-headers-content-type/
// https://nodejsdev.ru/doc/email/

const CONTENT_TYPES = {
    MILTIPART_FORMDATA: 'multipart/form-data',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    APPLICATION_JSON: 'application/json'
}

// log(MIME_TYPES.html);

const docPats = [
    {doctor: 'Новожилов С.Ю.'},
    {patient: 'Тихонова Галина Федотовна', sys: 143, dia: 89, pulse: 54, glukose: 5.9},
    {patient: 'Багдасарян Анна Рафаэловна', sys: 133, dia: 79, pulse: 64},
    {patient: 'Каргальская Ирина Геннадьевна', sys: 123, dia: 69, pulse: 74}
];

const patients = [
    {patient: 'Тихонова Галина Федотовна', sys: 143, dia: 89, pulse: 54, glukose: 5.9},
    {patient: 'Багдасарян Анна Рафаэловна', sys: 133, dia: 79, pulse: 64, glukose: 5.8},
    {patient: 'Каргальская Ирина Геннадьевна', sys: 123, dia: 69, pulse: 74, glukose: 5.7}
];

mkd.process(patients);

const __404 = (client, res, info = null) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.statusCode = 404;
    res.end(info);
};

const send = (client => {

    // log({ client })

    const strinfifyData = JSON.stringify(client.data);

    log({ strinfifyData })
    //
    // log(client.mimeType)


    // log(client.statusCode)

    client.res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    client.res.statusCode = 200;
    client.res.end(strinfifyData);
});

const response = send;

class Server {
    constructor() {
    }

    response(mimeType, html, res, status = 200) {
        res.setHeader('Content-Type', mimeType);
        res.statusCode = status;
        res.end(html);
    }

    pipe(mimeType, stream, res, status = 200) {
        res.setHeader('Content-Type', mimeType);
        res.statusCode = status;
        stream.pipe(res);
    }

    createServer(port, host) {
        const server = http.createServer(async (req, res) => {
            const client = new ClientApp(req, res);

            // log({ client })

            // const queryString = querystring.parse(req.url);
            // log({ queryString })
            const route = new Route(client);
            const hasRoute = route.has();

            // log({ client })
            // log(client.host)
            // log(client.url)
            // log(client.http_method)
            // log({ hasRoute })
            // log('----------')

            if (!hasRoute) {
                __404(client, res, '404 - ' + client.url);
                mailAdmin.sendMessage('Страница не найдена', '404 - ' + client.url).catch(console.error('mailAdmin.sendMessage()'));
                // MailerAdmin.sendMessage('404 - ' + req.url, 'Страница не найдена');
                // notify('404 - ' + req.url, 'Страница не найдена');
            } else {
                if (req.method === 'GET') {
                    const resolve = await route.resolve(client);

                    // log({ resolve })

                    if ((typeof resolve.stream) === 'string') {

                        // log({ client })

                        this.response(client.mimeType, resolve.stream, res);
                    } else {
                        const stream = await resolve.stream;
                        this.pipe(client.mimeType, stream, res);
                    }
                }
                if (req.method === 'POST') {
                    const contentType = req.headers['content-type'];
                    let body = null;
                    let bodyArr = [];
                    req.on('data', chunk => {
                        if (contentType === CONTENT_TYPES.FORM_URLENCODED) bodyArr.push(chunk);
                        if (contentType === CONTENT_TYPES.APPLICATION_JSON) body += chunk;
                    });
                    req.on('end', async function () {

                        log({ contentType })

                        if (contentType === CONTENT_TYPES.FORM_URLENCODED) {
                            try {
                                body = bufferConcat(bodyArr); // bufferConcat

                                // log({ body })

                                client.body = body;

                                const stream = await route.resolve(client);

                                // log({ stream })
                                //
                                // log(stream.data)

                                client.data = stream.data;

                                const order = stream.data.order;
                                // log({  order })
                                // log('fin')
                                const clientInfo = stream.data.client;

                                // log({  order })

                                response(client);
                                const info = 'Заявка №' + order.id + '. Клиент: ' + clientInfo.name + ', тел. ' + clientInfo.phone + '. Создана ' + order.created_at + '.';

                                // log({ info })

                                notifyOrder(info);
                                mailAdmin.sendMessage(info, 'Запись на сайте').catch(console.error('mailAdmin.sendMessage'));
                            } catch (er) {
                                // bad json
                                res.statusCode = 400;
                                res.end(`error: ${er.message}`);
                            }
                        }
                        if (contentType === CONTENT_TYPES.APPLICATION_JSON) {
                            try {
                                body = replace('null', '', body);
                                const { stream } = await route.resolve(client);
                                client.data = stream[0];
                                response(client);
                                mailAdmin.sendMessage(client.data, 'POST ' + client.url).catch(console.error('mailAdmin.sendMessage'));
                            } catch (er) {
                                // bad json
                                res.statusCode = 400;
                                res.end(`error: ${er.message}`);
                            }
                        }
                    });
                    req.on('information', (info) => {
                        console.log(`Got information prior to main response: ${info.statusCode}`);
                    });
                }
            }
        });

        // server.on('request', function (req, res) {
        //     log('request')
        //     // logger.run(req, res);
        // });

        server.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    }

    start(port, host) {
        this.createServer(port, host);
    }
}

module.exports = new Server();
