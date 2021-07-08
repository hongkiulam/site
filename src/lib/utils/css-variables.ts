export const COLORS = {
	PRIMARY: '#e88a46',
	LIGHT1: '#fafafa',
	LIGHT2: '#d4d4d4',
	DARK1: '#2f2f2f',
	DARK2: '#545454'
};

export const SPACE = {
	STANDARD: 12,
	get SMALL() {
		return this.STANDARD / 2;
	},
	get LARGE() {
		return this.STANDARD * 2;
	},
	get XLARGE() {
		return this.STANDARD * 4;
	}
};
