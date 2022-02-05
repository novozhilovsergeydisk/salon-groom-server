'use strict'

const path = require('path');
const crypto = require('crypto');
const { Client } = require('pg');
const conf = require('./conf.js');
const { STATIC_PATH, VIEWS_PATH } = require('../constants.js');
const TOKEN_LENGTH = 32;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;
const { mail } = require('./services/mail-service.js');

const __STATIC = url => {
    return path.join(STATIC_PATH, url);
};

const __VIEWS = () => {
    return VIEWS_PATH;
};

const notify = (info => {
    const mailOptions = {
        from: conf.mailOptions.from,
        to: conf.mailOptions.to,
        subject: conf.mailOptions.subject,
        text: info
    };

    mail.options(mailOptions);

    mail.send();
});

const postTransform = (str => {
    const body = decodeURIComponent(str);
    // log({ body });
    const split = body.split('&');
    // log({ split })
    let data = {};
    let valueArr = [];
    split.forEach((value, index) => {
        valueArr = value.split('=');
        data[valueArr[0]] = valueArr[1];
        // log({ valueArr })
    });
    return data;
});

const error = err => {
    throw Error(err);
};

const throwErr = error;

const errorLog = err => {
    console.error(err);
};

const _err = errorLog;
const _error = errorLog;

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
    const COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
    const DEFAULT_PARAMS = /=[^,]+/gm;
    const FAT_ARROW = /=>.*$/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;

    const formattedFn = fn
        .toString()
        .replace(COMMENTS, "")
        .replace(FAT_ARROW, "")
        .replace(DEFAULT_PARAMS, "");

    const params = formattedFn
        .slice(formattedFn.indexOf("(") + 1, formattedFn.indexOf(")"))
        .match(ARGUMENT_NAMES);

    return params || [];
};

/**
 * Получить строковое представление тела функции.
 * @param fn Функция
 */
const getFunctionBody = fn => {
    const restoreIndent = body => {
        const lines = body.split("\n");
        const bodyLine = lines.find(line => line.trim() !== "");
        let indent = typeof bodyLine !== "undefined" ? (/[ \t]*/.exec(bodyLine) || [])[0] : "";
        indent = indent || "";

        return lines.map(line => line.replace(indent, "")).join("\n");
    };

    const fnStr = fn.toString();
    const rawBody = fnStr.substring(
        fnStr.indexOf("{") + 1,
        fnStr.lastIndexOf("}")
    );
    const indentedBody = restoreIndent(rawBody);
    const trimmedBody = indentedBody.replace(/^\s+|\s+$/g, "");


    return trimmedBody;
};

/**
 * DTO Factory function.
 * @param props
 */
const DTOFactory = (props => {
    // log({ props });

    if (!props) {
        throw Error('Invalid props param')
    }

    const ret = {
        status: props.status ? props.status : 'success',
        stream: props.stream ? props.stream : null,
        error: props.error ? props.error : undefined,
        ...props
    };

    // log({ 'props': props, 'ret': ret });

    return ret;
});

const isNumber = (id => {
    return (typeof parseInt(id)
        === 'number');
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
            } catch(e) {
                reject(e.message);
            }
        })();
    });
});

const select = connect;

const parse = ((text, values) => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const client_pg = new Client();
                await client_pg.connect();
                const res = await client_pg.query(text, values);

                // log({ 'res.rows': res.rows })

                resolve(res.rows);
                await client_pg.end();
            } catch(e) {
                // log({ 'ERROR @': e })
                reject(e.message);
            }
        })();
    });
});

const sql = parse;
const query = parse;

const toObj = (body => {
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
    hash,
    isNumber,
    connect,
    parse,
    select,
    sql,
    query,
    toObj,
    promise,
    resolve,
    reject,
    error,
    _err,
    _error,
    throwErr,
    errorLog,
    postTransform,
    notify,
    __STATIC,
    __VIEWS
};