import { getDocs, collection, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';

exports.findRaces = async function (): Promise<any> {
	const q = query(collection(db, 'races'));
	const raceQuery = await getDocs(q);

	if (!raceQuery.empty) {
		const race = raceQuery.docs.map(race => ({
			...race.data()
		}));
		return race;
	}

	return undefined;
};

exports.createRace = async function (userToken: string, race: any) {
	let data = {
		userOwner: userToken,
		nombreCarrera: race.nombreCarrera,
		distanciaCarrera: race.distanciaCarrera,
		fechaCarrera: race.fechaCarrera,
		lugarCarrera: race.lugarCarrera
	};
	console.log(data);

	try {
		const questionID = await addDoc(collection(db, 'trivias'), data);
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};
