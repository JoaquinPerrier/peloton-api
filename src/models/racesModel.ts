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
