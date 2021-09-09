import { variables } from '$lib/variables';
import admin from 'firebase-admin';
import firebaseServiceAccount from '../../../firebaseServiceAccount.json';

export const initialiseApp = () => {
	!admin.apps?.length
		? admin.initializeApp({
				credential: admin.credential.cert({
					clientEmail: firebaseServiceAccount.client_email,
					privateKey: firebaseServiceAccount.private_key,
					projectId: firebaseServiceAccount.project_id
				}),
				storageBucket: variables.firebase_bucket_name
		  })
		: admin.app();

	const bucket = admin.storage().bucket();

	const getMarkdownFromBucket = async (fileName: string) => {
		const fileRes = await bucket.file(fileName).download();
		const file = fileRes[0];
		const fileBuffer = Buffer.from(file).toString('utf-8');
		return fileBuffer;
	};
	return {
		getMarkdownFromBucket
	};
};
