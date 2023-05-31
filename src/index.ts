import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const port = Number(process.env.PORT || 5000);

module.exports = express()
	.use(cors())
	.use(express.json({ limit: '5mb' }))
	.use(express.urlencoded({ extended: false, limit: '5mb' }))
	.use('/', router)
	.listen(port, () => console.log(`🚀 Server running on port: ${port}`));