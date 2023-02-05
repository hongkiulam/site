export type CSSColor = `color-${'bg' | 'copy'}-${'1' | '2'}`;
export const cssColorVar = (key: CSSColor): string => {
	if (typeof window === 'undefined') return '';
	const variables = window.getComputedStyle(document.documentElement);
	return variables.getPropertyValue('--' + key).replace(/\s/g, '');
};
