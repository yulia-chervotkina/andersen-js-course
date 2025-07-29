import * as events from './constants/events';
import * as urls from './constants/urls';
import fetchData from './utilities';

export default class Controller {
  constructor(emitter, view) {
    this.emitter = emitter;
    this.view = view;

    this.headers = {
      'Content-Type': 'application/json',
    };
    this.emitter.on(events.ADD_TO_FAV, this.addToFavorites);
    this.emitter.on(events.EDIT, this.fetchRecipeByID);
    this.emitter.on(events.DELETE, this.delete);
    this.emitter.on(events.GET_MAIN_PAGE, this.getAllRecipies);
    this.emitter.on(events.GET_ALL_FAV_RECIPES, this.getFavoriteRecipies);
    this.emitter.on(events.UPDATE_RECIPE, this.sendEditedRecipe);
    this.emitter.on(events.SUBMIT, this.create);
    this.emitter.on(events.REMOVE_FROM_FAV, this.removeFromFavorite);
  }

  init = () => fetchData(urls.recipes).then(data => this.printRecipeCard(data));

  getAllRecipies = async () => {
    this.view.removeAllCards();
    this.printRecipeCard(await fetchData(urls.recipes));
  };

  getFavoriteRecipies = () => fetchData(urls.fav).then(this.printRecipeCard);

  printRecipeCard = result => result.forEach(e => this.view.printRecipeCard(e));

  create = async () => {
    const userRecipeData = this.view.getRecipeInfo();
    if (userRecipeData) {
      const options = {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(userRecipeData),
      };
      const data = await fetchData(urls.recipes, options);
      this.view.printRecipeCard(data);
    }
  };

  addToFavorites = async id => {
    const options = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ isFavorite: true }),
    };
    await fetchData(urls.recipeByID(id), options);
  };

  removeFromFavorite = async id => {
    const options = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ isFavorite: false }),
    };
    await fetchData(urls.recipeByID(id), options);
  };

  fetchRecipeByID = id => fetchData(urls.recipeByID(id)).then(this.view.showEditRecipeModal);

  sendEditedRecipe = async (id, obj) => {
    const options = {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(obj),
    };
    this.view.printRecipeCard(await fetchData(urls.recipeByID(id), options));
    this.view.removeRecipeFromPage(id);
  };

  delete = async id => {
    const options = {
      method: 'DELETE',
      body: { _id: id },
    };
    await fetch(urls.recipeByID(id), options);
    this.view.removeRecipeFromPage(id);
  };
}
