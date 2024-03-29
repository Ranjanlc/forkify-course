import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Listening for load and hashchange Event

const controlRecipes = async function () {
  try {
    //Listening for load and hashchange Events
    const id = window.location.hash.slice(1);
    //application logic
    if (!id) return;

    recipeView.renderSpinner(); //view logic

    //0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //1)Loading recipe
    await model.loadRecipe(id);

    //2)Rendering Recipe
    recipeView.render(model.state.recipe); //It'll accept the data and store it in the object of recipeView.js
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1)Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2)load search results
    await model.loadSearchResults(query);
    //3)Render search results
    resultsView.render(model.getSearchResultsPage());
    //4)Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (page) {
  //Render new results
  resultsView.render(model.getSearchResultsPage(page));
  //REnder new pagination btns
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Updating the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //Adding and removing bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  //upDate recipeView
  recipeView.update(model.state.recipe);
  //Render BOOkmark
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //SHOW loading spinner
    addRecipeView.renderSpinner();
    console.log(newRecipe);
    //Upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();
    //Render bookmark view
    bookmarksView.render(model.state.bookmarks); //not update coz we really want to insert new element.

    //Change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //We can do much more things with history api like going back and forth just like if we were clicking the api
    //Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
