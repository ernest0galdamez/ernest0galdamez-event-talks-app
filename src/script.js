document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('category-search');
    const scheduleItems = document.querySelectorAll('.schedule-item[data-categories]');

    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase().trim();

        scheduleItems.forEach(item => {
            const categories = item.getAttribute('data-categories').toLowerCase();
            if (categories.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
