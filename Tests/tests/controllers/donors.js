import assert from 'assert';
import { Donors } from '../../../Code/server/controllers/donors';

describe('Donors', function() {
    describe('#getDonors()', function() {
        let dataMock = [
                {
                    _id: 'randId',
                    firstName: 'firstName',
                    lastName: 'Last Name',
                    email: 'email@email.com'
                }
            ],
            cursorMock = {
                toArray: () => {
                    return new Promise(resolve => {
                        resolve(dataMock);
                    });
                }
            },
            collectionMock = { find: () => cursorMock},
            dbMock = { collection: () => collectionMock },

            queryMock = { xmin: '', xmax: '', ymin: '', ymax: ''},
            reqMock = { query: queryMock },

            donors = new Donors(dbMock);

        it('should return donors', function() {
            donors.getDonors(reqMock, {
                json: donors =>
                    assert.deepEqual(donors, dataMock, 'Donors are correct')
            });
        });
    });

    describe('#createDonor()', function() {
        let dataMock = {
                lat: '',
                lon: '',
                firstName: 'firstName',
                lastName: 'Last Name',
                email: 'email@email.com'
            },

            collectionMock = { insertOne: donor => {
                return new Promise(resolve => {
                    donor._id = 'randId';
                    resolve(donor);
                });
            } },

            dbMock = { collection: () => collectionMock },

            reqMock = { body: dataMock },

            patientsMock = {
                emit: () => {}
            },

            donors = new Donors(dbMock);

        it('should create new donor', function() {
            donors.createDonor(patientsMock, reqMock, {
                json: res =>
                    assert.deepEqual(res.id, 'randId', 'Created donor id is not correct')
            });
        });
    });
});
