'use strict'

const http = require('http');
const path = require('path');
const Route = require('./route');
const Client = require('./lib/Client.js');
const { log, generateToken, hash } = require('./helpers.js');
const conf = require('./conf.js');
const { transporter } = require('./lib/Mailer.js');

// const fs = require('fs');
// const mime = require('mime');
// const url = require('url');
// const model = require('./lib/Model.js');
// const { logger, asyncLocalStorage } = require('./lib/Logger');
// log( conf.mailer_config );

log(generateToken());

log(hash());

// var faker = require('faker');
// const randomName = faker.name.findName(); // Rowan Nikolaus
// const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
// const randomCard = faker.helpers.createCard(); // random contact card containing many properties
// const randomImage = faker.image.fashion();

//log({ randomName, randomEmail, randomImage });

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

const CONTENT_TYPES = {
    MILTIPART_FORMDATA: 'multipart/form-data',
    MILTIPART_URLENCODED: 'application/x-www-form-urlencoded; charset=UTF-8',
    APPLICATION_JSON: 'application/json'
}

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
    res.end('404 not found');
    log('404 - ' + client.url);

    if (info) {
        const mailOptions = {
            from: conf.mailOptions.from,
            to: conf.mailOptions.to,
            subject: conf.mailOptions.subject,
            text: '404 - ' + info
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};

const send = ((mimeType, html, res) => {
    res.setHeader('Content-Type', mimeType);
    res.statusCode = 200;
    res.end(html);
});

class Server {
    constructor() {};

    make(client, res, req) {
        try {
            this.execute(client).then(data => {
                // log({ data });
                this.answerStrategy(client, data.stream, res, req);
            });
        } catch(err) {
            log({ 'Error while execute()': err });
        }
    }

    execute(client) {
        return Promise.resolve()
            .then(() => {
                const resolve = new Route(client).resolve();

                // log({ resolve });

                return resolve;
            })
            // Здесь можно проверить аутентификацию, авторизацию пользователя
            //
            // .then(dat => {
            //     // user.fullName = 'Новожилов Сергей';
            //     // const isAuth = auth.login();
            //     // log({ isAuth });
            //
            //     log({ dat });
            //
            //     return dat;
            // })
            .catch(err => {
                console.log({ 'Error execute()': err });
                return null;
            });
    }

    answerStrategy(client, content, res, req = null) {
        const isPromice = content instanceof Promise;
        // const isObject = typeof content === 'object';
        const info = req.headers.host + ' | ' + client.url + ' | ' + req.method + ' | ' + client.mimeType;
        if (client.mimeType === MIME_TYPES.html) {
            if (content === null || content === undefined) {
                __404(client, res,  info);
            } else {
                if (isPromice) {
                    content.then(data => {
                        (data === null) ? __404(client, res, info) : send(client.mimeType, data, res);
                    });
                } else {
                    const html = ((typeof content) ==='string' ) ? content : content.toString();
                    send(client.mimeType, html, res);
                }
            }
        } else {
            if (isPromice) {
                content
                    .then(stream => {
                        res.setHeader('Content-Type', client.mimeType);
                        if (stream) {
                            stream.pipe(res);
                        } else {
                            __404(client, res, info);
                        }
                    })
                    .catch(error_stream => {
                        __404(client, res, info); log({ 'error_stream': error_stream });
                    });
            } else {
                __404(client, res, ' not promice');
            }
        }
    }

    createServer(port, host) {
        const server = http.createServer(async (req, res) => {
            // logger(req, res);
            // req.log.info('something else');
            const { url } = req;
            const fileExt = path.extname(url).substring(1);
            const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
            const client = new Client(req.headers.host, req.method, url, fileExt, mimeType);
            let body = '';

            if (req.method === 'POST') {
                req.on('data', chunk => {
                    const contentType = req.headers["content-type"];

                    // log({ contentType });

                    // if (contentType === CONTENT_TYPES.MILTIPART_FORMDATA) {
                    //     log('MILTIPART_FORMDATA');
                    //     log({ chunk });
                    //     body += chunk.toString(); // convert Buffer to string
                    //     client.body = body;
                    // }
                    //
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

                    body += chunk.toString(); // convert Buffer to string
                });
            }

            if (req.method === 'GET') {
                this.make(client, res, req);
            }

            req.on('end', function() {
                if (req.method === 'POST') {
                    client.body = body;
                    return Promise.resolve()
                        .then(() => {
                            const resolve = new Route(client).resolve();
                            resolve.then(data => {
                                res.setHeader('Content-Type', mimeType);
                                res.statusCode = 200;
                                res.end(JSON.stringify(data));
                            });
                            return resolve;
                        })
                        .catch(err => {
                            console.log({ 'Error execute()': err });
                            return null;
                        });
                }
            });
        });

        server.on('request', function(req, res) {
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