import type { BehanceStore } from '$types/behance';
import axios from 'axios';
import NodeHtmlParser from 'node-html-parser';

// commonjs import works in development but not in production
const parse =
	process.env.NODE_ENV === 'development' ? NodeHtmlParser : (NodeHtmlParser as any).parse;
// const { parse } = NodeHtmlParser as any;

export default async (url: string) => {
	const behanceEntryResponse = await axios(url);
	const behanceEntryHTML =
		behanceEntryResponse.status === 200 ? await behanceEntryResponse.data : '';
	const page = parse(behanceEntryHTML);
	const behancePageStore: BehanceStore = JSON.parse(
		page.querySelector('#beconfig-store_state').textContent
	);
	return behancePageStore;
};
