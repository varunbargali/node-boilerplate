import { Request, Response } from 'express';

/**
 * @swagger
 *
 * /health-check:
 *   get:
 *     description: Health Check
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 */
export default async function healthCheck(request: Request, response: Response): Promise<Response> {
  return response.status(200).send({
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date(),
  });
}
