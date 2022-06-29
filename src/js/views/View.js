import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  //To write documentation using JSDOC 3
  /**
   *Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered(eg:recipe)
   * @param {boolean} [render=true] If false,create markup string instead of returning to the dom
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {object}View instance
   * @author Ranjan Lamichhane
   * @todo Finish implementation
   */
  //Object[] means array of object and [] means optional
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); //to create new markup but not render it.We compare it to current HTML then only change text and attributes which have changed from old version to new version
    //Changing string to dom
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);
    // console.log(curElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl)); //It compares both content.It doesnt have to be exact same node.
      //Update changed text
      if (!curEl) return;
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      //We have nodeValue fn which returns null if its not text node and returns textContent if the node contains text.WE need to select the child coz child is what contains the text,element is an element node.not text node

      //Update changed attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value) //WE get value from teh data-update-to.value and set it to curEl
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
    <div class="spinner">
    <svg>
    <use href="${icons}#icon-loader"></use>
    </svg>
    </div>
    `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    //this._errorMessage is set in each view and is different for each.
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
