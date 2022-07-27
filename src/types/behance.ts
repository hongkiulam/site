export interface InternalBehanceProject extends BehanceProjectOverview {
	images: Record<number, PictureSource>[];
}
export interface BehanceProjectOverview {
	created_on: number;
	id: number;
	name: string;
	published_on: number;
	modified_on: number;
	url: string;
	slug: string;
	privacy: string;
	fields: { id: number; name: string; slug: string; url: string }[];
	covers: {
		[size: string]: string;
	};
	mature_content: number;
	mature_access: string;
	owners: any;
	stats: { views: number; appreciations: number; comments: number };
	conceived_on: number;
	colors: any;
	is_editable: boolean;
	share_url: string;
	field_links: { url: string; name: string }[];
	multiple_owners: boolean;
	modified_date: Date;
	featured_on: any;
	private: boolean;
}
export interface BehanceProject extends BehanceProjectOverview {
	modules: Array<ProjectModuleImage | ProjectModuleMediaCollection>;
	// the rest irrelevant
}

export interface PictureSource {
	srcset: string;
	media_query: string;
	width: number;
	height: number;
}

export interface ProjectModuleImage {
	id: number;
	type: 'image';
	src: string;
	sizes: Record<string, string>;
	picture: {
		sources: PictureSource[];
		// the rest irrelevant
	};
	// the rest irrelevant
}
interface ProjectModuleMediaCollection {
	id: number;
	type: 'media_collection';
	components: Array<{
		src: string;
		sizes: Record<string, string>;
		picture: {
			sources: PictureSource[];
			// the rest irrelevant
		};
	}>;
	// the rest irrelevant
}

export interface BehanceStore {
	project: {
		otherProjects: BehanceProjectOverview[];
		project: BehanceProject;
	};
	// the rest irrelevant
}
