import { Request, Response } from 'express';

export interface AppRoute {

    /**
     * API Method Name
     * Method Name must be in lowercase.
     */
    method: string;

    /**
     * API EndPoint
     */
    path: string;

    /**
     * Method to Execute.
     * @param {Request} request
     * @param {Response} response
     * @returns {Object}
     */
    action: (request: Request, response: Response) => Promise<Response>;
}
