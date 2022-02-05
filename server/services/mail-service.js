const nodemailer = require('nodemailer');
const conf = require('../conf.js');

class MailService {
    constructor(obj = null) {
        this.transporter = nodemailer.createTransport({
            host: conf.mailer.host,
            port: conf.mailer.port,
            secure: conf.mailer.secure,
            auth: {
                user: conf.mailer.auth.user,
                pass: conf.mailer.auth.pass
            }
        });

        if (obj) this.options(obj);
    }

    /*from: conf.mailOptions.from,
    to: conf.mailOptions.to,
    subject: conf.mailOptions.subject*/

    async sendActivationMail(to, link) {}

    options(obj) {
        this.mailOptions = obj;
    }

    send(obj = null) {
        if (obj) this.options(obj);

        if (this.mailOptions) {
            this.transporter.sendMail(this.mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }
}

const mail = new MailService();
module.exports = { mail, MailService };