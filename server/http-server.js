'use strict'

const http = require('http');
const path = require('path');
const Route = require('./routes.js');
const ClientApp = require('./lib/Client.js');
const { notify, log, generateToken, hash } = require('./helpers.js');
const conf = require('./conf.js');
const { mail } = require('./services/mail-service.js');

process.env.PGHOST='localhost';
process.env.PGUSER='postgres';
process.env.PGDATABASE='salon_groom';
process.env.PGPASSWORD='postgres@12345';
process.env.PGPORT=5432;

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

const cachedPromise = new Map();
// const { Auth } = require('./lib/auth.js');
const MIME_TYPES = {
    html: 'text/html; charset=UTF-8',
    js:   'application/javascript; charset=UTF-8',
    css:  'text/css',
    png:  'image/png',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    ico:  'image/x-icon',
    svg:  'application/xhtml+xml',
    woff: 'application/x-font-woff',
    woff2: 'application/x-font-woff2',
    ttf: 'application/x-font-ttf',
    otf: 'application/x-font-otf'
};

// http://espressocode.top/http-headers-content-type/
// https://nodejsdev.ru/doc/email/

// const CONTENT_TYPES = {
//     MILTIPART_FORMDATA: 'multipart/form-data',
//     MILTIPART_URLENCODED: 'application/x-www-form-urlencoded; charset=UTF-8',
//     APPLICATION_JSON: 'application/json'
// }

// log(MIME_TYPES.html);

// console.table([
//     {doctor: 'Новожилов С.Ю.'},
//     {patient: 'Тихонова Галина Федотовна', sys: 143, dia: 89, pulse: 54, glukose: 5.9},
//     {patient: 'Багдасарян Анна Рафаэловна', sys: 133, dia: 79, pulse: 64},
//     {patient: 'Каргальская Ирина Геннадьевна', sys: 123, dia: 69, pulse: 74}
// ]);

const resolve = data => {
    return new Promise(resolve => {
        // console.log console.log({ 'resolve(data)': data });
        resolve(data);
    });
};

const reject = error => {
    return new Promise(reject => {
        // console.log({ 'reject(error)': error });
        reject(error);
    });
};

const __404 = (client, res, info= null) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.statusCode = 404;
    res.end(info);
    log('404 - ' + client.url);

    // if (info) {
    //     const mailOptions = {
    //         from: conf.mailOptions.from,
    //         to: conf.mailOptions.to,
    //         subject: conf.mailOptions.subject,
    //         text: '404 - ' + client.url
    //     };
    //
    //     mail.options(mailOptions);
    //
    //     mail.send();
    // }
};

class Server {
    constructor() {};

    message(client, req) {
        return req.headers.host + ' | ' + client.url + ' | ' + req.method + ' | ' + client.mimeType;
    }

    response(mimeType, html, res, status = 200) {
        res.setHeader('Content-Type', mimeType);
        res.statusCode = status;
        res.end(html);
    };

    createServer(port, host) {
        const server = http.createServer(async (req, res) => {
            if (req.method === 'GET') {
                let { url } = req;

                const urlArr = url.split('?');
                url = urlArr[0];

                // log({ urlArr })
                //
                // log({ url })

                const fileExt = path.extname(url).substring(1);
                const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
                const client = new ClientApp(req.headers.host, req.method, url, fileExt, mimeType);
                client.res = res;
                // let body = null;
                // let bodyArr = [];

                console.time('route')
                const resolve = new Route(client).resolve();

                if (!(resolve instanceof Promise)) {
                    __404(client, res, '404 not found')
                } else {
                    resolve.then(content => {
                        const isPromice = content instanceof Promise;
                        // const info = req.headers.host + ' | ' + client.url + ' | ' + req.method + ' | ' + client.mimeType;

                        if (!(content instanceof Promise)) {
                            if (content.stream instanceof Promise) {
                                content.stream.then(stream => {


                                    if ((typeof stream) === 'string') {
                                        this.response(mimeType, stream, res);
                                        // res.setHeader('Content-Type', mimeType);
                                        // res.statusCode = 200;
                                        // res.end(stream);
                                    }
                                    if (stream instanceof Object) {
                                        // log({ url, mimeType })

                                        stream.pipe(res);
                                    }

                                })
                            } else {
                                this.response(mimeType, content.stream, res);
                                // res.setHeader('Content-Type', mimeType);
                                // res.statusCode = 200;
                                // res.end(content.stream);
                            }

                            // log({ 'content.status': content.status })
                        }
                        //

                        // if (client.mimeType === MIME_TYPES.html) {
                        //     if (content === null || content === undefined) {
                        //         // log({ content })
                        //         // __404(client, res,  this.message(client, req));
                        //     } else {
                        //         // log({ mimeType })
                        //     }
                        //     //     if (isPromice) {
                        //     //         content.then(data => {
                        //     //             console.time('cached-promise');
                        //     //             (data === null) ? __404(client, res, info) : this.header(client.mimeType, data, res);
                        //     //             console.timeEnd('cached-promise');
                        //     //         });
                        //     //     } else {
                        //     //         console.time('cached-no-promise');
                        //     //         const html = ((typeof content) ==='string' ) ? content : content.toString();
                        //     //         this.header(client.mimeType, html, res);
                        //     //         console.timeEnd('cached-no-promise');
                        //     //     }
                        //     // }
                        // } else {
                        //     if (isPromice) {
                        //         // log({ mimeType })
                        //
                        //         // content
                        //         //     .then(stream => {
                        //         //         res.setHeader('Content-Type', client.mimeType);
                        //         //         if (stream) {
                        //         //             stream.pipe(res);
                        //         //         } else {
                        //         //             __404(client, res, info);
                        //         //         }
                        //         //     })
                        //         //     .catch(error_stream => {
                        //         //         __404(client, res, info); log({ 'error_stream': error_stream });
                        //         //     });
                        //     } else {
                        //         // log({ url })
                        //         // log({ mimeType })
                        //         // log({ content })
                        //         // __404(client, res, ' not promice');
                        //     }
                        // }

                        // res.setHeader('Content-Type', mimeType);
                        // res.statusCode = 200;
                        // res.end('<h3>transplant</h3>');
                    })
                }

                console.timeEnd('route')

                // res.setHeader('Content-Type', MIME_TYPES.html);
                // res.statusCode = 200;
                // res.end('<h1>header</h1>');

                // console.timeEnd('chain')
            }

            if (req.method === 'POST') {
                const { url } = req;


                const fileExt = path.extname(url).substring(1);
                const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
                const client = new ClientApp(req.headers.host, req.method, url, fileExt, mimeType);
                let body = null;
                let bodyArr = [];
                req.on('data', chunk => {
                    bodyArr.push(chunk);
                });
                req.on('end', function() {
                    const urlencoded = req.method === 'POST' && req.headers["content-type"] === 'application/x-www-form-urlencoded';
                    if (urlencoded) {
                        body = Buffer.concat(bodyArr).toString();
                        client.body = body;
                        const resolve = new Route(client).resolve();
                        resolve.renderer(resolve.route, undefined, client).then(Promise => {
                            Promise.data.then(data => {
                                data.order.then(fd => {
                                    const order = fd[0];
                                    const client = data.client;
                                    const response = { status: 'success', order: { id: order.id, created_at: order.created_at }, client: { name: client.name, phone: client.phone } }
                                    const info = 'Заявка №' + order.id + '. Клиент: ' + client.name + ', тел. ' + client.phone + '. Создана ' + order.created_at + '.';
                                    notify(info);
                                    res.setHeader('Content-Type', mimeType);
                                    res.statusCode = 200;
                                    res.end(JSON.stringify(response));
                                })
                            })
                        })
                        .catch(error => log({ error }))
                    }
                });
            }
        });

        server.on('request', function(req, res) {
            // log(req.url)
        });

        server.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    }

    start(port, host) {
        this.createServer(port, host);
    }
}

module.exports = new Server();
