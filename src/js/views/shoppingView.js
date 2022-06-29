import View from './View';
import previewView from './previewView';
class ShoppingView extends View {
  _parentElement = document.querySelector('.shopping__list');
  _errorMessage =
    'No items yet. Find a nice recipe and add to shopping list :)';

  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(item => previewView.render(item, false)).join('');
  }
}
export default new ShoppingView();
