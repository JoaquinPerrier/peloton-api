import { Request, Response } from 'express';

const raceModel = require('../models/raceModel');
const jwtUtil = require('../utils/jwt/index');

exports.find_races = async (req: Request, res: Response) => {
	try {
		const userToken = await jwtUtil.checkToken(req);

		if (userToken.message) {
			throw Error(userToken.message);
		}

		let races = await raceModel.findRaces();

		if (races) {
			res.status(200).send({ message: 'Status OK', data: { races: races } });
		} else {
			res.status(200).send({ message: 'No races created' });
		}
	} catch (err: any) {
		res.status(401).send({ message: err.message });
	}
};
