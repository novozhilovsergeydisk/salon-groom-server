const nunjucks = require('nunjucks');
// const userService = require('../service/user-service.js');
const adminService = require('../../services/admin-service.js');
const { DTOFactory, getFunctionParams, log } = require('../../helpers.js');
const { VIEWS_PATH } = require('../../../constants.js');

nunjucks.configure(VIEWS_PATH, { autoescape: true });

// Handlers
class reportsControllers {
    async clinicById(client) {
        const id = client.par.value;
        const data = adminService.clinicById(id)
        ;
        const stream = data
            .then(clinics => {
                log({ clinics });
                const patients = [{ title: "Иванов", id: 1 }, { title: "Новожилов", id: 2}, { title: "Гришин", id: 3}];
                const render = nunjucks.render('reports/index.html', { patients: patients, clinics: clinics });
                return render;

            })
            .catch(error => {
                log({ error });
                return '<h1>500</h1>' + `<strong>${error}</strong>`;
            });

        return DTOFactory({ stream: stream });
    }

    async addClient(cli) {
        // log({ cli });
        const data = adminService.addClient(cli);
        const stream = data
            .then(data => {
                // log({ data });

                return data;

            })
            .catch(error => {
                log({ error });
                return '<h1>500</h1>' + `<strong>${error}</strong>`;
            });

        // log({ stream });

        // stream.then(d => {
        //     log({ d });
        // });

        return DTOFactory({ stream: stream });
    }

    async addUser(client) {
        // const id = client.par.value;
        const data = adminService.addUser(client);
        const stream = data
            .then(data => {
                return 'addUser';
            })
            .catch(error => {
                log({ error });
                return '<h1>500</h1>' + `<strong>${error}</strong>`;
            });

        return DTOFactory({ stream: stream });
    }
}

const reportsController = new reportsControllers();

module.exports = reportsController;