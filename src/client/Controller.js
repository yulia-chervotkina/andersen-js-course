import * as events from './constants/events';
import * as urls from './constants/urls';

export default class Controller {
  constructor(emitter, view) {
    this.emitter = emitter;
    this.view = view;

    this.emitter.on(events.CLICK_FAVORITE, this.addToFavorites);
    this.emitter.on(events.CLICK_EDIT, this.fetchRecipeByID);
    this.emitter.on(events.CLICK_DELETE, this.delete);
    this.emitter.on(events.CLICK_RECIPE, this.getAllRecipies);
    this.emitter.on(events.CLICK_FAVORITES, this.getFavoriteRecipies);
    this.emitter.on(events.ON_EDIT_MODE, this.sendEditedRecipe);
    this.emitter.on(events.CLICK_SUBMIT, this.create);
    this.emitter.on(events.CLICK_FAVORITE_TO_REMOVE, this.removeFromFavorite);
  }

  fetchData = async (url, method) => {
    try {
      const response = await fetch(url, method);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  init = async () => this.printRecipeCard(await this.fetchData(urls.rootURL));

  getAllRecipies = async () => {
    this.view.removeAllCards();
    this.printRecipeCard(await this.fetchData(urls.rootURL));
  };

  getFavoriteRecipies = async () => this.printRecipeCard(await this.fetchData(urls.favURL));

  printRecipeCard = result => {
    result.forEach(e => {
      const { _id, isFavorite } = e;
      this.view.printRecipeCard(e, _id, isFavorite);
    });
  };

  create = async () => {
    const userRecipeData = this.view.getRecipeInfo();
    if (userRecipeData) {
      const method = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userRecipeData),
      };
      const data = await this.fetchData(urls.rootURL, method);
      const { _id } = data;
      this.view.printRecipeCard(userRecipeData, _id);
    }
  };

  addToFavorites = async id => {
    const method = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isFavorite: true }),
    };
    await this.fetchData(urls.buildURL(id), method);
  };

  removeFromFavorite = async id => {
    const method = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isFavorite: false }),
    };
    await this.fetchData(urls.buildURL(id), method);
  };

  fetchRecipeByID = async id =>
    this.view.showEditRecipeModal(await this.fetchData(urls.buildURL(id)));

  sendEditedRecipe = async (id, obj) => {
    const method = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    };
    this.view.printRecipeCard(await this.fetchData(urls.buildURL(id), method));
    this.view.removeRecipeFromPage(id);
  };

  delete = async id => {
    const method = {
      method: 'DELETE',
      body: { _id: id },
    };
    await fetch(urls.buildURL(id), method);
    this.view.removeRecipeFromPage(id);
  };
}
