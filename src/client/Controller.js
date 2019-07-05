/* eslint-disable no-undef */
import * as EVENTS from './constants/events';
import * as URL from './constants/url';

class Controller {
  constructor(view) {
    this.view = view;

    this.initializeEvents();

    this.getAll();
  }

  initializeEvents() {
    this.view.on(EVENTS.ADD, this.addRecipe.bind(this));
    this.view.on(EVENTS.DELETE, this.deleteRecipe.bind(this));
    this.view.on(EVENTS.EDIT, this.editRecipe.bind(this));
    this.view.on(EVENTS.ALL, this.getAll.bind(this));
    this.view.on(EVENTS.FAVORITES, this.getFavorites.bind(this));
  }

  async getAll() {
    try {
      const response = await window.fetch(URL.RECIPES);
      const recipes = await response.json();
      this.view.showRecipes(recipes);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getFavorites() {
    try {
      const response = await window.fetch(URL.FAVORITES, {
        mode: 'cors',
      });
      const favorites = await response.json();
      this.view.showRecipes(favorites);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addRecipe(recipe) {
    try {
      const response = await window.fetch(URL.RECIPES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      const { message } = await response.json();
      const newRecipe = { ...recipe, _id: message._id };
      this.view.addRecipe(newRecipe);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteRecipe({ id }) {
    try {
      const response = await window.fetch(`${URL.RECIPES}/${id}`, {
        method: 'DELETE',
      });
      this.view.removeRecipe(id);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async editRecipe(recipe) {
    try {
      const { id, ...recipeBody } = recipe;
      const response = await window.fetch(`${URL.RECIPES}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeBody),
      });
      // Проверка на добавление рецепта в избранное, изменять данные рецепта не нужно
      if (Object.keys(recipeBody).length !== 1) {
        this.view.editRecipe(recipe);
      }
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default Controller;
