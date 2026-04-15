document.addEventListener('DOMContentLoaded', () => {
	const aboutBlocks = document.querySelectorAll('.sphc-client-card__about');

	aboutBlocks.forEach((aboutEl) => {
		const btn = aboutEl.querySelector('.sphc-client-card__about-btn');
		const panel = aboutEl.querySelector('.sphc-client-card__about-panel');

		if (!btn || !panel) return;

		btn.addEventListener('click', (event) => {
			event.stopPropagation();

			if (!aboutEl.classList.contains('sphc-client-card__about--open')) {
				aboutEl.classList.add('sphc-client-card__about--open');
				btn.setAttribute('aria-expanded', 'true');
				btn.style.display = 'none';
			}
		});
	});
});
