import warn from '../../lib/logger';
import { Donors } from '../controllers/donors';
import Express from 'express';

/**
 * Dependency injection container
 */
export default class Container {

    /**
     * @param {Express} app
     */
    constructor(app) {
        this._app = app;
    }

    /**
     * @returns Donors
     */
    donors() {
        if (!this._donors) {
            this._donors = new Donors(this._app.locals.db);
        }

        return this._donors;
    }
}
