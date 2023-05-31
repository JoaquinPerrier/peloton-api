import { Request, Response } from 'express';

const userModel = require('../models/userModel');
const jwtUtil = require('../utils/jwt/index');

const expReg =
	/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

exports.login = async function (req: Request, res: Response) {
	if (req.body.user && req.body.password) {
		try {
			const currentUser = await userModel.findOne(req.body.user);
			let payload = {
				...currentUser[0]
			};

			const token = await jwtUtil.createToken(payload);
			res.send({ message: 'Status OK', user: currentUser, token: token });
		} catch (error: any) {
			res.status(401).send({ message: 'Invalid credentials' });
		}
	} else if (!req.body.user) {
		res.status(401).send({ message: 'The user field is required' });
	} else {
		res.status(401).send({ message: 'The password field is required' });
	}
};

/*
exports.user_detail = function (req: Request, res: Response) {
	res.status(501).send({ message: 'NOT IMPLEMENTED - user detail' });
};

// Handle User create on POST.
exports.user_create_post = async function (req: Request, res: Response) {
	try {
		let { name, surname, email, password } = req.body;

		if (name && surname && email && password) {
			if (expReg.test(email)) {
				if (password.length >= 6) {
					const newUser = await userModel.createNewUser(name, surname, email, password);
					let payload = {
						...newUser
					};
					const token = await jwtUtil.createToken(payload);
					res.send({ message: 'Status OK', newUser: newUser, token: token });
				} else {
					res.status(401).send({ message: 'Password must contain at least 6 characters' });
				}
			} else {
				res.status(401).send({ message: 'Invalid email. Please enter an email with domain ‘@endava.com' });
			}
		} else {
			res.status(401).send({ message: 'All fields are required' });
		}
	} catch (errorMessage) {
		res.status(401).send({ message: 'Email already exists' });
	}
};

// Send an email to reset password.
exports.resetPassword = async function (req: Request, res: Response) {
	let { email } = req.body;
	try {
		await userModel.recoverPassword(email);
		res.send({ message: 'Status OK' });
	} catch (error) {
		res.status(500).send({ message: 'Couldn´t send email to recover password' });
	}
};

*/
