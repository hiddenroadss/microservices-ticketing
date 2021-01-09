import {CustomError} from './customError';


export class DatabaseConnectionError extends CustomError {
    statusCode = 500;

    constructor() {
        super('Error connecting to db');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [
            {message: 'Error connecting to database'}
        ]
    }
}