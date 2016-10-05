import path from 'path';
import donors from './donors';

export default function (app) {
    donors(app);

    // send all requests to index.html so browserHistory in React Router works
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../../client/index.html'))
    })
};
