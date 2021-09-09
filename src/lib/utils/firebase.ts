import { variables } from '$lib/variables';
import admin from 'firebase-admin';

export const initialiseApp = () => {
	// replace /n with real line breaks
	const pk = variables.firebase_service_account.private_key.replace(/\\n/g, '\n');
	!admin.apps?.length
		? admin.initializeApp({
				credential: admin.credential.cert({
					clientEmail: variables.firebase_service_account.client_email,
					privateKey: pk,
					projectId: variables.firebase_service_account.project_id
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
