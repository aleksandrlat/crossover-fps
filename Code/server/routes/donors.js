export default function (app) {
    let io = app.locals.io,
        container = app.locals.container,
        controller = container.donors(),
        patients = io.of('/donors');

    app.get('/donors', controller.getDonors.bind(controller));
    app.post('/donors', controller.createDonor.bind(controller, patients));
};