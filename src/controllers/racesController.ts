import { Request, Response } from 'express';

const racesModel = require('../models/racesModel');
const jwtUtil = require('../utils/jwt/index');

exports.find_races = async (req: Request, res: Response) => {
	try {
		const userToken = await jwtUtil.checkToken(req);

		if (userToken.message) {
			throw Error(userToken.message);
		}

		let races = await racesModel.findRaces();

		if (races) {
			res.status(200).send({ message: 'Status OK', data: { races: races } });
		} else {
			res.status(200).send({ message: 'No races created' });
		}
	} catch (err: any) {
		res.status(401).send({ message: err.message });
	}
};

exports.create_races = async function (req: Request, res: Response) {
	try {
		const userToken = await jwtUtil.checkToken(req);
		console.log(userToken);

		if (userToken.message) {
			throw Error(userToken.message);
		}

		let race = req.body;

		if (!race.nombreCarrera || !race.distanciaCarrera || !race.fechaCarrera || !race.lugarCarrera) {
			throw Error('Error: missing params ');
		}

		race = await racesModel.createRace(userToken.user, race);

		res.status(200).send({ message: 'Status OK', race });
	} catch (err: any) {
		res.status(501).send({ message: err.message });
	}
};
