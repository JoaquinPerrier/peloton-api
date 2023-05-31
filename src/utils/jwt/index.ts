import { Request } from 'express';
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createToken = async function (payload: any): Promise<string> {
	const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1000000s' });
	return token;
};

exports.checkToken = async function (req: Request): Promise<any> {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ')[1];

		if (token === null || token == undefined) throw new Error('JWT: Missing token');

		const user = jwt.verify(token, process.env.JWT_SECRET, (err: any, decodedToken: any) => {
			if (err) throw new Error('JWT: Not Authorized (Expired token or signature is not verified)');
			return decodedToken;
		});
		return user;
	} catch (error: any) {
		return { error, message: error.message };
	}
};
