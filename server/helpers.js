'use strict'

const path = require('path');
const crypto = require('crypto');
const {Client} = require('pg');
const {mail} = require('./services/mail-service.js');
const conf = require('./conf.js');
const {STATIC_PATH, VIEWS_PATH} = require('./const.js');
const TOKEN_LENGTH = 32;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

const __STATIC = url => {
    return path.join(STATIC_PATH, url);
};

const __VIEWS = () => {
    return VIEWS_PATH;
};

const throwErr = err => {
    throw Error(err);
};

const errorLog = err => {
    console.error(err);
};

const __ERROR = errorLog;
const __error = errorLog;
const bytesToMb = bytes => Math.round(bytes / 1000, 2) / 1000;

const sliceLastSymbol = ((mod, url) => {
    let urlMod = url;
    if (mod === url) return url;
    if (mod === '/') {
        const lastSymbol = url.charAt(url.length - 1);
        if (lastSymbol === '/') {
            urlMod = url.slice (0, - 1);
        }
    }
    return urlMod;
})

const __ = (url => {
    // log({ url })
    const _split = url.split('?');
    // log({ _split })

    if (_split.length > 0) {
        return _split[0];
    }

    return url;
})

const memory = (() => {
    // console.clear();
    const memory = [];
    const usage = process.memoryUsage();
    const row = {
        rss: bytesToMb(usage.rss), // process resident set size
        heapTotal: bytesToMb(usage.heapTotal), // v8 heap allocated
        heapUsed: bytesToMb(usage.heapUsed), // v8 heap used
        external: bytesToMb(usage.external), // c++ allocated
        stack: bytesToMb(usage.rss - usage.heapTotal), // stack
    };
    memory.push(row);
    // console.table(memory);
    return memory;
})

const notifyOrder = (info => {
    const options = {
        from: conf.options.from,
        to: conf.options.to,
        subject: conf.options.subject,
        text: info
    };
    mail.options(options);
    mail.send();
});

const notify = ((error, sub = 'Ошибка сервиса', text = 'Error:') => {

    log(conf.mailer)

    const mailOptions = {
        from: conf.options.from,
        to: conf.options.to,
        subject: sub,
        text: text + ' ' + error
    };
    mail.options(mailOptions);
    mail.send();
    __ERROR(error)
})

const replace = ((oldS, newS, fullS) => {
    for (var i = 0; i < fullS.length; ++i) {
        if (fullS.substring(i, i + oldS.length) == oldS) {
            fullS = fullS.substring(0, i) + newS + fullS.substring(i + oldS.length, fullS.length);
        }
    }
    return fullS;
});

const reject = err => {
    return new Promise(reject => {
        console.error(err);
        reject(err);
    });
};

const _promise = (data, error = null) => {
    return new Promise((resolve) => {
        resolve(data);
    }).catch(err => {
        if (error) {
            console.error(error)
            return error
        } else {
            console.error(err)
            return err
        }
    });
};

const promise = _promise;
const resolve = _promise;

const generateToken = (length = null) => {
    const base = (length) ? length : ALPHA_DIGIT.length;
    let key = '';
    for (let i = 0; i < TOKEN_LENGTH; i++) {
        const index = Math.floor(Math.random() * base);
        key += ALPHA_DIGIT[index];
    }
    return key;
};

const token = generateToken;

const hash = () => {
    const phrase = generateToken();
    const hash = crypto.createHmac('sha256', conf.secret)
        .update(phrase)
        .digest('hex');
    return hash;
};

const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string') {
        return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
};

const log = data => console.log(data);

const start = () => {
    log('');
    log('START ---------------------------------------------');
}

const end = () => {
    log('END ---------------------------------------------');
    log('');
}

/**
 * Получить список параметром функции.
 * @param fn Функция
 */
const getFunctionParams = fn => {
    const COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\\)]*(('(?:\\'|[^'\r\n])*')|('(?:\\'|[^'\r\n])*'))|(\s*=[^,\\)]*))/gm;
    const DEFAULT_PARAMS = /=[^,]+/gm;
    const FAT_ARROW = /=>.*$/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;

    const formattedFn = fn
        .toString()
        .replace(COMMENTS, '')
        .replace(FAT_ARROW, '')
        .replace(DEFAULT_PARAMS, '');

    const params = formattedFn
        .slice(formattedFn.indexOf('(') + 1, formattedFn.indexOf(')'))
        .match(ARGUMENT_NAMES);

    return params || [];
};

/**
 * Получить строковое представление тела функции.
 * @param fn Функция
 */
const getFunctionBody = fn => {
    const restoreIndent = body => {
        const lines = body.split('\n');
        const bodyLine = lines.find(line => line.trim() !== '');
        let indent = typeof bodyLine !== 'undefined' ? (/[ \t]*/.exec(bodyLine) || [])[0] : '';
        indent = indent || '';

        return lines.map(line => line.replace(indent, '')).join('\n');
    };

    const fnStr = fn.toString();
    const rawBody = fnStr.substring(
        fnStr.indexOf('{') + 1,
        fnStr.lastIndexOf('}')
    );
    const indentedBody = restoreIndent(rawBody);
    const trimmedBody = indentedBody.replace(/^\s+|\s+$/g, '');

    return trimmedBody;
};

class Database {
    constructor() {
    }
    async connect() {
        try {
            this.client_pg = new Client();
            this.connect = await this.client_pg.connect();
            // const client_pg = new Client();
            // const res = await client_pg.query(text, values);
            // resolve(res.rows);
            // await client_pg.end();
        } catch (e) {
            this.error = e.message;
            // reject(e.message);
        }
        return this;
    }

    async query(text, values) {
        try {
            this.res = await this.client_pg.query(text, values);
            await this.client_pg.end();
            return this.res.rows;
            // const client_pg = new Client();
            // this.connect = await this.client_pg.connect();
            // resolve(res.rows);
        } catch (e) {
            this.error = e.message;
            // reject(e.message);
        }
        // return this;
    }
}

const db = new Database();

/**
 * DTO Factory function.
 * @param props
 */
const DTOFactory = (props => {
    if (!props) {
        throw Error('Invalid props param')
    }
    const ret = {
        status: props.status ? props.status : 'success',
        stream: props.stream ? props.stream : null,
        error: props.error ? props.error : undefined,
        ...props
    };
    return ret;
});

const isNumber = (id => {
    return (typeof parseInt(id) === 'number');
});

const connect = (sql => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const client_pg = new Client();
                await client_pg.connect();
                const res = await client_pg.query(sql);
                resolve(res.rows);
                await client_pg.end();
            } catch (e) {
                reject(e.message);
            }
        })();
    });
});

const select = connect;

const query = ((text, values) => {
    return new Promise((resolve, reject) => {
        return (async () => {
                try {
                    const client_pg = new Client();
                    await client_pg.connect();
                    const res = await client_pg.query(text, values);
                    resolve(res.rows);
                    await client_pg.end();
                } catch (e) {
                    reject(e.message);
                }
            })();
        });
    });

const sql = query;
const parse = query;

const bufferConcat = (body => {
    const bufConcat = Buffer.concat(body).toString();
    // log({ bufConcat });
    const bufArray = bufConcat.split('&');
    // log({ bufArray });
    let json = {};
    let arr = [];
    bufArray.map((item) => {
        arr = item.split('=');
        json[arr[0]] = arr[1];
        // log({ item });
    });
    // log({ json });
    return json;
});

module.exports = {
    capitalizeFirstLetter,
    DTOFactory,
    log, start,
    end,
    getFunctionParams,
    getFunctionBody,
    generateToken,
    token,
    hash,
    isNumber,
    connect,
    parse,
    select,
    sql,
    query,
    bufferConcat,
    promise,
    resolve,
    reject,
    __ERROR,
    __error,
    throwErr,
    errorLog,
    replace,
    notify,
    memory,
    sliceLastSymbol,
    db,
    notifyOrder,
    __,
    __STATIC,
    __VIEWS
};
