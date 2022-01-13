const crypto = require('crypto');
const conf = require('./conf.js');

const TOKEN_LENGTH = 32;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

const generateToken = () => {
    const base = ALPHA_DIGIT.length;
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

module.exports = { capitalizeFirstLetter, DTOFactory, log, start, end, getFunctionParams, getFunctionBody, generateToken, hash };