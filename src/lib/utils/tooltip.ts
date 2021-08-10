import '$lib/styles/tooltip.scss';

interface TooltipOptions {
	message: string;
	position?:
		| 'top'
		| 'top-left'
		| 'left'
		| 'bottom-left'
		| 'bottom'
		| 'bottom-right'
		| 'right'
		| 'top-right';
	size?: 'small' | 'medium' | 'large' | 'fit';
}

export default (node: HTMLElement, opt: TooltipOptions) => {
	node.setAttribute('role', 'tooltip');
	node.setAttribute('aria-label', opt.message);
	node.setAttribute('data-microtip-position', opt.position || 'top');
	if (opt.size) {
		node.setAttribute('data-microtip-size', opt.size);
	}
	node.style.setProperty('--microtip-font-size', '1em');
};
