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
    svg:  'image/svg+xml',
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

    if (info) {
        const mailOptions = {
            from: conf.mailOptions.from,
            to: conf.mailOptions.to,
            subject: conf.mailOptions.subject,
            text: '404 - ' + info
        };

        mail.options(mailOptions);

        mail.send();
    }
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
                const { url } = req;
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

            const { url } = req;
            const fileExt = path.extname(url).substring(1);
            const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
            const client = new ClientApp(req.headers.host, req.method, url, fileExt, mimeType);
            let body = null;
            let bodyArr = [];

            if (req.method === 'POST') {
                req.on('data', chunk => {
                    bodyArr.push(chunk);

                    // const contentType = req.headers["content-type"];

                    // if (contentType === CONTENT_TYPES.MILTIPART_FORMDATA) {
                    //     log('MILTIPART_FORMDATA');
                    //     log({ chunk });
                    //     body += chunk.toString(); // convert Buffer to string
                    //     client.body = body;
                    // }
                    // application/x-www-form-urlencoded
                    // if (contentType === CONTENT_TYPES.MILTIPART_URLENCODED) {
                    //     log('MILTIPART_URLENCODED');
                    //     log({ chunk });
                    //
                    //     body += chunk.toString(); // convert Buffer to string
                    // }
                    //
                    // /*const bodyArr = body.split('&');
                    //
                    // const jsonString = JSON.stringify(Object.assign({}, bodyArr))
                    //
                    // log({ jsonString });*/
                    //
                    // if (contentType === CONTENT_TYPES.APPLICATION_JSON) {
                    //     log({ chunk });
                    //     body += chunk.toString(); // convert Buffer to string
                    //     client.body = body;
                    // }

                    // body += chunk.toString(); // convert Buffer to string
                });

                req.on('end', function() {
                    const urlencoded = req.method === 'POST' && req.headers["content-type"] === 'application/x-www-form-urlencoded';
                    if (urlencoded) {
                        // let body = [];
                        // request.on('data', (chunk) => {
                        //     body.push(chunk);
                        // }).on('end', () => {
                        //     body = Buffer.concat(body).toString();
                        //     // at this point, `body` has the entire request body stored in it as a string
                        // });
                        body = Buffer.concat(bodyArr).toString();
                        client.body = body;
                        const resolve = new Route(client).resolve();
                        resolve.renderer(resolve.route, undefined, client).then(Promise => {
                            Promise.data.then(data => {
                                // log({ data })


                                data.order.then(fd => {
                                    // log(fd)
                                    // log(data.client)
                                    // log({ fd })
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

                            // notify('OK')
                            // log({ data })
                            // res.setHeader('Content-Type', mimeType);
                            // res.statusCode = 200;
                            // res.end(JSON.stringify(data));

                            // log({ data })
                        })
                        .catch(error => log({ error }))
                    }
                });
            }

//             // logger(req, res);
//             // req.log.info('something else');
//             const { url } = req;
//             const fileExt = path.extname(url).substring(1);
//             const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
//             const client = new ClientApp(req.headers.host, req.method, url, fileExt, mimeType);
//             let body = null;
//             let bodyArr = [];
//
//             if (req.method === 'POST') {
//                 req.on('data', chunk => {
//                     bodyArr.push(chunk);
//
//                     // const contentType = req.headers["content-type"];
//
//                     // if (contentType === CONTENT_TYPES.MILTIPART_FORMDATA) {
//                     //     log('MILTIPART_FORMDATA');
//                     //     log({ chunk });
//                     //     body += chunk.toString(); // convert Buffer to string
//                     //     client.body = body;
//                     // }
//                     // application/x-www-form-urlencoded
//                     // if (contentType === CONTENT_TYPES.MILTIPART_URLENCODED) {
//                     //     log('MILTIPART_URLENCODED');
//                     //     log({ chunk });
//                     //
//                     //     body += chunk.toString(); // convert Buffer to string
//                     // }
//                     //
//                     // /*const bodyArr = body.split('&');
//                     //
//                     // const jsonString = JSON.stringify(Object.assign({}, bodyArr))
//                     //
//                     // log({ jsonString });*/
//                     //
//                     // if (contentType === CONTENT_TYPES.APPLICATION_JSON) {
//                     //     log({ chunk });
//                     //     body += chunk.toString(); // convert Buffer to string
//                     //     client.body = body;
//                     // }
//
//                     // body += chunk.toString(); // convert Buffer to string
//                 });
//             }
//
//             if (req.method === 'GET') {
//                 // const memoize = cache.memoize(this.renderer);
//                 //
//                 // log({ memoize });
//                 //
//                 // memoize(this.route, this.par, this.client);
//                 // console.time('send');
//
//
//
//                 // this.send(client, res, req);
//
//
//                 if (req.method === 'GET') {
//                     console.time('chain')
//                     try {
//
//                         this.header(client.mimeType, '<h1>header</h1>', res);
//
//                         // this.chain(client).then(data => {
//                         //     // log({ data });
//                         //     this.answerStrategy(client, data.stream, res, req);
//                         // });
//                     } catch(err) {
//                         log({ 'Error while chain()': err });
//                     }
//                     console.timeEnd('chain')
//                 }
//
//                 // let map = new Map();
//
//                 // if (!cached.has(url)) {
//                 //     cached.set(url, url);
//                 //     // log({ url });
//                 // }
//
//
//                 // map.set("1", "str1");    // строка в качестве ключа
//                 // map.set(1, "num1");      // цифра как ключ
//                 // map.set(true, "bool1");  // булево значение как ключ
//
// // помните, обычный объект Object приводит ключи к строкам?
// // Map сохраняет тип ключей, так что в этом случае сохранится 2 разных значения:
// //                 alert(map.get(1)); // "num1"
// //                 alert(map.get("1")); // "str1"
//
//                 log(cached.size); // 3
//
//                 // cached.forEach((v, k) => {
//                 //     log(k + '=' + v);
//                 // })
//
//                 // log({ url });
//                 // console.timeEnd('send');
//                 // log('---------------');
//             }
//
//             req.on('end', function() {
//                 const urlencoded = req.method === 'POST' && req.headers["content-type"] === 'application/x-www-form-urlencoded';
//                 if (urlencoded) {
//
//                     // let body = [];
//
//                     // request.on('data', (chunk) => {
//                     //     body.push(chunk);
//                     // }).on('end', () => {
//                     //     body = Buffer.concat(body).toString();
//                     //     // at this point, `body` has the entire request body stored in it as a string
//                     // });
//
//                     body = toObj(bodyArr);
//                     client.body = body;
//
//                     // log(body.toString());
//
//                     // res.setHeader('Content-Type', mimeType);
//                     // res.statusCode = 200;
//                     // res.end(JSON.stringify(body));
//                     //
//                     // log(req.headers["content-type"]);
//
//                     const send = (() => {
//                         return Promise.resolve()
//                             .then(() => {
//                                 // console.time('resolve');
//                                 const resolve = new Route(client).resolve();
//                                 // console.timeEnd('resolve');
//                                 if (resolve.status === '404 not found') {
//                                     const info = req.headers.host + ' | ' + client.url + ' | ' + req.method + ' | ' + client.mimeType;
//                                     __404(client, res, info);
//                                     return;
//                                 }
//
//                                 // log({ resolve });
//                                 // log('OK');
//
//                                 resolve.then(data => {
//
//                                     // const stream = data.stream;
//
//                                     // log({ stream });
//
//                                     res.setHeader('Content-Type', mimeType);
//                                     res.statusCode = 200;
//                                     res.end(JSON.stringify(data));
//                                 });
//                                 return;
//                                 // return resolve;
//                             })
//                             .catch(err => {
//                                 console.log({ 'Error chain()': err });
//                                 return null;
//                             });
//                     });
//
//                     return send();
//                 }
//             });
        });

        server.on('request', function(req, res) {
            log(req.url)
            // log('request')
            // logger.run(req, res);
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
