import { API_URL, KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';
import { RES_PER_PAGE } from './config';
export const state = {
  recipe: {},
  search: {
    query: '', //it mightnt be useful now but when we want to know about analytics of each query it becomes useful
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  shoppingList: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    //state.recipe to align it with functional programming and it is the object we are gonna give to render
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //if recipe.key doesnt exists nothing happens.If it is value,second part is executed and returned.We can spread objects to put the values which would be same like key:recipe.key.We did all this coz every loading recipe doesnt have it key.
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); //coz getJSON is an async fn and returns a promise.
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    //SHOPPING LIST
    if (state.shoppingList.some(item => item.id === id))
      state.recipe.shopped = true;
    else state.recipe.shopped = false;
  } catch (err) {
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search="${query}"&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }), //to add create icon while searching
      };
    });
  } catch (err) {
    throw err;
  }
};
// loadSearchResults('pizza');
export const getSearchResultsPage = function (page = 1) {
  //WE can also do state.search.page=1 after loading search result(in loadSearchResult fn)
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (newServings * ing.quantity) / state.recipe.servings;
    //newQt=oldQt*newServings/oldServings
  });
  state.recipe.servings = newServings;
};
export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Adding bookmarks
  state.bookmarks.push(recipe);
  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipe as not bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(ing => {
        // ingArr = ing[1].replaceAll(' ', '').split(',');
        ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format!Please use the correct format'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const persistShopping = function () {
  localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
};

export const addShopping = function (recipe) {
  //Adding bookmarks
  // console.log('model', recipe);
  state.shoppingList.push(recipe);
  // console.log(state.shoppingList);
  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.shopped = true;
  persistShopping();
};
export const deleteShopping = function (id) {
  const index = state.shoppingList.findIndex(el => el.id === id);
  state.shoppingList.splice(index, 1);
  //Mark current recipe as not bookmark
  if (id === state.recipe.id) state.recipe.shopped = false;
  persistShopping();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  const shoppingStorage = localStorage.getItem('shoppingList');
  if (!storage) return;
  if (!shoppingStorage) return;

  state.bookmarks = JSON.parse(storage);
  state.shoppingList = JSON.parse(shoppingStorage);
  // console.log(state.shoppingList, 'boom');
};
init();
