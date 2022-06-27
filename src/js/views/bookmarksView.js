import View from './View.js';
import previewView from './previewView.js';
// import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet.Find a nice recipe and bookmark it! :) ';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    //Why dont we simply call previewView.generateMarkup instead of putting render to false thats coz we still need it to set the data property of data we passed in so that we can use this keyword in previewView.
    //WE returned the string coz render=false from View to previewView module/So when previewVIew.render is called above,it returns string which is then returned by bookmarksView which was run initially by controller when bookmark was added.
  }
}
export default new BookmarksView();
