import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      if (!goToPage) return;
      console.log(goToPage);
      handler(goToPage);
      //       this._data.page = goToPage;
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    //Page 1 and there are other pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    if (curPage === 1 && numPages > 1) {
      return `
      <button class="btn--inline pagination__btn--prev">
          <span>Total page:${numPages}</span>
    </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
             <svg class="search__icon">
                 <use href="${icons}#icon-arrow-right"></use>
              </svg>
        </button>
      `;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
      
      <button data-goto="${
        curPage - 1
      }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
      </button>
      <button class="btn--inline pagination__btn--prev">
          <span>Total page:${numPages}</span>
    </button>
      `;
    }
    //Pages in front and back too.
    if (curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--prev">
          <span>Total page:${numPages}</span>
    </button>
        <button data-goto="${
          curPage + 1
        }"class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    //Page 1 and no other pages
    return `
    <button class="btn--inline ">
          <span>Total page:${numPages}</span>
    </button>
    `;
  }
}
export default new PaginationView();
