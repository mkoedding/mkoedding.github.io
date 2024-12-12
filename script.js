document.getElementById('filter').addEventListener('change', function() {
    const year = this.value;
    const papers = document.querySelectorAll('.paper');

    papers.forEach(paper => {
        if (year === 'all' || paper.getAttribute('data-year') === year) {
            paper.style.display = 'block';
        } else {
            paper.style.display = 'none';
        }
    });
});

document.getElementById('filter2').addEventListener('change', function() {
    const year = this.value;
    const papers = document.querySelectorAll('.project');

    papers.forEach(paper => {
        if (year === 'all' || paper.getAttribute('data-year') === year) {
            paper.style.display = 'block';
        } else {
            paper.style.display = 'none';
        }
    });
});
