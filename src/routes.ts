import { Router, Request, Response } from 'express';

const router: Router = Router();
const usersController = require('./controllers/usersController');

router.get('/', (_req: Request, res: Response): void => {
	res.send({ message: 'Server successfully connected' });
});

// USERS ROUTES
router.post('/api/login', (_req: Request, res: Response): void => {
	usersController.login(_req, res);
});

export default router;
