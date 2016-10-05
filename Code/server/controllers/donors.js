import async from '../../lib/async';
import warn from '../../lib/logger';

/**
 * WebSocket controller
 */
export class Donors {

    constructor(db) {
        this._donors = db.collection('donors');
    }

    getDonors(req, res) {
        async(function* () {
            let donors = yield this._donors
                .find({
                    lat: {
                        $gt: parseFloat(req.query.ymin),
                        $lt: parseFloat(req.query.ymax)
                    },
                    lon: {
                        $gt: parseFloat(req.query.xmin),
                        $lt: parseFloat(req.query.xmax)
                    }
                })
                .toArray();

            res.json(donors);
            // socket.emit(donors);
        }.bind(this));
    }

    createDonor(patients, req, res) {
        async(function* () {
            let donor = req.body;

            donor.lat = parseFloat(donor.lat);
            donor.lon = parseFloat(donor.lon);

            let result = yield this._donors.insertOne(donor);

            patients.emit('newDonor', donor);

            res.json({ id: donor._id });
        }.bind(this));
    }

    /*updateDonor(socket, donor) {
        async(function* () {
            let result = yield this._donors.updateOne({_id: donor._id}, donor);

            socket.broadcast.emit('newDonor', donor);
        }.bind(this));
    }*/
}