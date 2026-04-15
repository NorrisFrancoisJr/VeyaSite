export class ObTabbedContent extends HTMLElement {

	VERSION = '1.0.0';

	ACTIVE_ATTR = 'data-tabbed-content-active';
	ACTIVE_SELECTOR = `[${this.ACTIVE_ATTR}]`;
	TAB_SELECTOR = '[data-tabbed-content-tab]';
	PANE_SELECTOR = '[data-tabbed-content-pane]';

	connectedCallback() {
		this.querySelectorAll(this.TAB_SELECTOR).forEach(tab => {
			tab.querySelector('a')?.addEventListener('click', this.handleLinkClick.bind(this));
		});
	}

	handleLinkClick(e) {
		e.preventDefault();
		const link = e.target.closest('a');
		if (link) this.setActive(link);
	}

	getActivePane() {
		return this.querySelector(this.PANE_SELECTOR + this.ACTIVE_SELECTOR);
	}

	getActiveTab() {
		return this.querySelector(this.TAB_SELECTOR + this.ACTIVE_SELECTOR);
	}

	findPaneById(id) {
		return this.querySelector('#' + id);
	}

	setActive(link) {
		const tab = link.closest(this.TAB_SELECTOR);
		if (tab.hasAttribute(this.ACTIVE_ATTR)) return;
		const targetId = link.href.split('#')[1];

		this.mayViewTransition(() => {
			const targetPane = this.findPaneById(targetId);
			const currentPane = this.getActivePane();

			this.getActiveTab()?.removeAttribute(this.ACTIVE_ATTR);
			tab.setAttribute(this.ACTIVE_ATTR, '');

			currentPane?.removeAttribute(this.ACTIVE_ATTR);
			currentPane?.setAttribute('hidden', '');

			targetPane?.setAttribute(this.ACTIVE_ATTR, '');
			targetPane?.removeAttribute('hidden');

			this.dispatchEvent(new CustomEvent('toggle', { detail: {
				item: currentPane,
				action: 'deactivate',
			}}));
			this.dispatchEvent(new CustomEvent('toggle', { detail: {
				item: targetPane,
				action: 'activate',
			}}));
		});
	}

	mayViewTransition(cb) {
		document.startViewTransition && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
			? document.startViewTransition(cb)
			: cb();
	}
}

customElements.define('ob-tabbed-content', ObTabbedContent);
