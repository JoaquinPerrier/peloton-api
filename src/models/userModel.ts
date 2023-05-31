import { getDocs, collection, addDoc, query, where, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

exports.findOne = async function (user: string) {
	const q = query(collection(db, 'admin'), where('user', '==', user));

	const userQuery = await getDocs(q);
	if (!userQuery.empty) {
		const user = userQuery.docs.map(usuario => ({
			...usuario.data()
		}));
		return user;
	}

	return undefined;
};

exports.login = async function (email: string, password: string): Promise<string | void> {
	let user;
	try {
		await signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				user = userCredential.user.uid;
			})
			.catch(error => {
				throw new Error(error.message);
			});
	} catch (error: any) {
		throw new Error(error.message);
	} finally {
		return user;
	}
};

exports.createNewUser = async function (name: string, surname: string, email: string, password: string): Promise<any> {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		let uid = userCredential.user.uid;
		const newUserReference = await addDoc(collection(db, 'users'), {
			name: name,
			surname: surname,
			email: email,
			firebase_uid: uid
		});

		const newUser = await getDoc(newUserReference);
		return newUser.data();
	} catch (error: any) {
		throw new Error(error);
	}
};

exports.recoverPassword = async function (email: string) {
	await sendPasswordResetEmail(auth, email)
		.then(() => {
			return true;
		})
		.catch(error => {
			throw new Error(error.message);
		});
};
