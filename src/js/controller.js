import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    //Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmark view
    bookmarkView.update(model.state.bookmarks);

    // 2) Loading the recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err.message);
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();

    if (!query) return;

    // 2) load search result
    await model.loadSearchResults(query);

    // 3) render seach results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (gotoPage) {
  // 3) Render NEW seach results

  resultsView.render(model.getSearchResultsPage(gotoPage));

  //4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);
  console.log(model.state.recipe);

  // 3) Render the bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlAddBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const init = function () {
  bookmarkView.addHandlreRender(controlAddBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
