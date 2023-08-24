import { Router, Request, Response } from 'express';

const router: Router = Router();
const usersController = require('./controllers/usersController');
const racesController = require('./controllers/racesController');

router.get('/', (_req: Request, res: Response): void => {
	res.send({ message: 'Server successfully connected' });
});

// USERS ROUTES
router.post('/api/login', (_req: Request, res: Response): void => {
	usersController.login(_req, res);
});

// RACES ROUTES
router.get('/api/races', (_req: Request, res: Response): void => {
	racesController.find_races(_req, res);
});

router.get('/api/races', (_req: Request, res: Response): void => {
	racesController.find_races(_req, res);
});

export default router;
