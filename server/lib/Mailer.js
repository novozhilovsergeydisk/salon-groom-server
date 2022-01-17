const nodemailer = require('nodemailer');
const conf = require('../conf.js');

const transporter = nodemailer.createTransport({
    host: conf.mailer.host,
    port: conf.mailer.port,
    secure: conf.mailer.secure,
    auth: {
        user: conf.mailer.auth.user,
        pass: conf.mailer.auth.pass
    }
});

module.exports = { transporter, nodemailer }