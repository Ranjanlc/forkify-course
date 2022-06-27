import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _windowElement = document.querySelector('.add-recipe-window');
  _overlayElement = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addHandlerShowWindow(); //coz controller need not interfere while showing overlay.BUt we import so that our code runs coz controller is middle script.
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlayElement.classList.toggle('hidden');
    this._windowElement.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //coz this keyword points to btnOpen inside event listener
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlayElement.addEventListener(
      'click',
      this.toggleWindow.bind(this)
    );
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; //formdata is pretty modern browser API we can use.WE pass form element inside FormData,in this case this(which points to this._parentElement)
      const data = Object.fromEntries(dataArr); //This method is opposite of entries which is available on entries.It takes array of entries and converts into object
      handler(data);
    });
  }
  _generateMarkup() {}
}
export default new AddRecipeView();
