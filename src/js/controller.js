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

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
//Listening for load and hashchange Event

const controlRecipes = async function () {
  try {
    //Listening for load and hashchange Events
    const id = window.location.hash.slice(1);
    //application logic
    if (!id) return;

    recipeView.renderSpinner(); //view logic

    //0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage()); //It would also work with render.It will work coz once hash changes recipe is rendered and also the entire search results view got rendered again and this time id of the result is the same as curId.But if we click another el,there is flickering as the images are loading again.
    //update method works because there is two updates in the element,preview link is chaning to active of one and one active is changing to preview link only.So,update method works here.
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
    // resultsView.render(model.state.search.results);
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
  recipeView.update(model.state.recipe); //It'll update only text and dom without having to re-render entire view
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
  bookmarksView.addHandlerRender(controlBookmarks); //We rendered bookmark at first.To avoid the error of having unequal elements while updating bookmark.
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
/*
//Lecture:Helper and configuration files
//Many real world applications have two special modules that are independent of the architecture which are for the project configuration and modules for general helper fns which are gonna be useful in our project.Lets start with configuration module.WE create a new file config.js in our folder which contains all variables which is const and should be used across the project.The goal of this file with all these variables is it will allow us to configure projects by simply changing some of the data in the configuration file.We dont want to put all the variables,the only variables we want are the ones responsible for kind of the defining important data about application itself.One example is api url

//Lecture:Event handlers in MVC:The publisher-subscriber pattern
//Lets analyze,we have the hashchange and loadevent  in the controller.However it doesnt make sense,eth related to DOM(view) should be inside of a view.However,the handler fn we use to handle is in the controller module.WE have basically a problem.WE want eventListeners to be in the view but handler fn couldn't be put into view
//Why not we call controlRecipe from view whenever an error occurs?
//Its not possible coz in the way we set up the architechture,the view knows nothing about the controller.So,it doesnt import from the controller(only other way around).Fortunately,there is a soln which is called publisher subscriber design pattern(standard soln for certain problems).
//Code that knows when to react(publisher)=>addHandlerRender().Subscriber  is the code that wants to react=>controlRecipes().And publisher doesnt know that subscriber even exist.
//The soln is we can subscribe to the publisher by passin in the subscriber fn as an argument,as soon as program loads init fn is called which immediately calls addHandlerRender() from the view,and that is legit coz controller does import from view.As we call addHandlerRender we pass in controlRecipe as arg
.
//Implementing Bookmarks
//Adding a handler to recipe,so that user can bookmark the recipe,then that'll re-render our update the recipe with the book mark button .
*/
