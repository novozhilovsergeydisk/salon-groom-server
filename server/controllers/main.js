const path = require('path');
const fs = require('fs');
const { DTOFactory, log } = require('../helpers.js');
const { VIEWS_PATH, STATIC_PATH } = require('../../constants.js');
const nunjucks = require('nunjucks');
const userService = require('../service/user-service.js');
// const { parse } = require('querystring');

// log({ VIEWS_PATH });

nunjucks.configure(VIEWS_PATH, { autoescape: true });

// Demo data
let patients = [
    {
        id: 1,
        fio: 'Иванов Иван'
    },
    {
        id: 2,
        fio: 'Петров Петр'
    },
    {
        id: 3,
        fio: 'Сидоров Андрей'
    }
];

// Handlers
class mainControllers {
    async order(client) {
        const body = decodeURIComponent(client.body);

        // log({ body });

        const bodyArr = body.split('&');

        // log(bodyArr);

        bodyArr.map(item => {
            return item.split('=');
        });

        const newObj = {};

        bodyArr.forEach(item => {
            const newArr = item.split('=');
            newObj[newArr[0]] = newArr[1];
        });



        log({ newObj });

        const jsonString = JSON.stringify(Object.assign({}, bodyArr))

        // log({ jsonString });

        return DTOFactory({ stream: body });
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

    async getAllPatients() {
        const dto = DTOFactory({ stream: nunjucks.render('index.html', patients) });
        // const dto = DTOFactory({ stream: { 'VIEWS_PATH': VIEWS_PATH } });
        // log({ dto });
        return dto;
    }

    async getPatient(client) {
        // log({ 'client': client.par.name });
        let patient = {};
        if (client.par.value) {
            const id = Number(client.par.value); //Number(req.params.id); // blog ID
            patient = patients.find(patient => patient.id === id);
        }
        // log({ patient });
        const dto = DTOFactory({ stream: JSON.stringify(patient) });
        return dto;
    }

    async addPatient() {
        const id = patients.length + 1; // generate new ID
        // return { foo: 'bar' };
        console.log({ id });
        const newPatient = {
            id,
            fio: req.body.fio
        };
        // console.log({ newPatient });
        patients.push(newPatient);
        return newPatient;
    }

    async updatePatient(req, reply) {
        const id = Number(req.params.id)
        patients = patients.map(patient => {
            if (patient.id === id) {
                return {
                    id,
                    fio: req.body.fio
                }
            }
        });
        return {
            id,
            fio: req.body.fio
        };
    }

    async deletePatient(req, reply) {
        const id = Number(req.params.id);
        patients = patients.filter(patient => patient.id !== id);
        return { msg: `Patient with ID ${id} is deleted` };
    }
}

const existFile = (file) => {
    const filePromice = new Promise((resolve, reject) => {
        fs.stat(file, function (err, stats) {
            if (err) {
                reject('File not found');
            } else {
                resolve(stats);
            }
        });
    });

    return filePromice.then(stats => {
        return new Promise(resolve => {
            stats._file = file;
            resolve({ info: 'file ' + file, status: 'success', error: '' });
        });
    }).catch(err => {
        return new Promise(reject => {
            reject({ info: 'file ' + file, status: 'failed', error: err });
        });
    });
};

const createReadStream = (file, url) => {
    // const { file, name } = client;
    // log({ ' stream(file)': file });

    const promiseStream = new Promise((resolve, reject) => {
        fs.stat(file, (error) => {
            if (error) {
                const error_stream = 'No resource file: ' + url;
                reject(error_stream);
            }
            else {
                const stream = fs.createReadStream(file);
                // log({ 'Served resource file and resolve promise': stream });
                // log(`\n-------------------------------\n`);
                resolve(stream);
            }
        });
    });

    return promiseStream;
}

const serve = (url) => {
    const filePath = path.join(STATIC_PATH, url);
    return Promise.resolve()
        .then(() => {
            return existFile(filePath);
        })
        .then(result => {
            return result.stream = (result.status === 'success') ? createReadStream(filePath, url) : null;
        })
        .catch(err => {
            console.log({ 'Error serve()': err });
        });
};

const staticController = {
    staticContent: async (client) => {
        return DTOFactory({ stream: serve(client.url) });
    }
};

const mainController = new mainControllers();

module.exports = mainController;