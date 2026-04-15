function extractNewItemsFromHtml(html) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

	const newContainer = doc.querySelector('.archive-posts--clients__items');
	if (!newContainer) {
		throw new Error('No archive container found in response');
	}

	const newItems = Array.from(newContainer.children);
	if (!newItems.length) {
		throw new Error('No new items found');
	}
	return newItems;
}

function insertNewItems(newItems, itemsContainer) {
	newItems.forEach((el) => {
		itemsContainer.appendChild(el);
	});
}

function archiveClientsLoadMore() {
	const container = document.querySelector('.archive-posts--clients');
	const itemsContainer = container?.querySelector('.archive-posts--clients__items');
	const moreWrapper = container?.querySelector('.archive-posts--clients--more');
	const moreLink = moreWrapper?.querySelector('a');

	if (!container || !itemsContainer || !moreWrapper || !moreLink) {
		return;
	}

	let currentPage = parseInt(container.dataset.currentPage || '1', 10);
	const maxPages  = parseInt(container.dataset.maxPages || '1', 10);
	const baseUrl   = container.dataset.baseUrl || window.location.href.split('?')[0];

	const loadNextPage = () => {
		if (currentPage >= maxPages) {
			moreWrapper.remove();
			return;
		}

		const nextPage = currentPage + 1;
		const url = baseUrl.replace(/\/$/, '') + '/page/' + nextPage + '/';

		moreLink.setAttribute('aria-busy', 'true');
		moreLink.classList.add('is-loading');

		fetch(url, {
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
			},
		})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text();
		})
		.then((html) => {
			const newItems = extractNewItemsFromHtml(html);
			insertNewItems(newItems, itemsContainer);

			currentPage = nextPage;
			container.dataset.currentPage = currentPage;
			if (currentPage >= maxPages) {
				moreWrapper.remove();
			}
		})
		.catch((error) => {
			console.error('Error loading more posts:', error);
			moreWrapper.remove();
		})
		.finally(() => {
			moreLink.removeAttribute('aria-busy');
			moreLink.classList.remove('is-loading');
		});
	};

	moreLink.addEventListener('click', (event) => {
		event.preventDefault();
		loadNextPage();
	});
}

archiveClientsLoadMore();
