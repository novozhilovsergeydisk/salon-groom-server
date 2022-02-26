const fs = require('fs');
const { DTOFactory, __STATIC } = require('../helpers.js');

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
class patientControllers {
    async test() {
        return DTOFactory({ stream: nunjucks.render('test/index.html', { patients: patients }) });
    }

    async main() {
        return DTOFactory({ stream: nunjucks.render('main/index.html', { patients: patients }) });
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
        } catch(e) {

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

const staticController = {
    staticContent: async (client) => {
        // log(client)

        // log({ '__STATIC(client.url)': __STATIC(client.url) })

        const stream = fs.createReadStream(__STATIC(client.url));

        // log({ stream })

        // const stream = promise(__STATIC(client.url), 'Error static').then(() => fs.createReadStream(__STATIC(client.url))).catch(e => log(e));
        const dto = DTOFactory({ stream: stream });
        return dto;
    }
};

const patientController = new patientControllers();

module.exports = { patients, patientController, staticController };