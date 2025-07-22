import * as events from './constants/events';

export default class Controller {
  constructor(emitter, view) {
    this.emitter = emitter;
    this.view = view;

    this.emitter.on(events.ON_RECIPE_INFO_GATHERED, this.create);
    this.emitter.on(events.CLICK_FAVORITE, this.addToFavorites);
    this.emitter.on(events.CLICK_EDIT, this.editRecipe);
    this.emitter.on(events.CLICK_DELETE, this.delete);
    this.emitter.on(events.CLICK_RECIPE, this.getAllRecipies);
    this.emitter.on(events.CLICK_FAVORITES, this.getFavoriteRecipies);
  }

  init = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/recipes');
      if (response.ok) {
        const result = await response.json();
        result.forEach(e => {
          const { _id } = e;
          this.view.printRecipeCard(e, _id);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getAllRecipies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/recipes');
      if (response.ok) {
        const result = await response.json();
        result.forEach(e => {
          const { _id } = e;
          this.view.printRecipeCard(e, _id);
        });
        console.log('Успех:', result);
      } else {
        const errorData = await response.json();
        console.log('Ошибка:', response.status, errorData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  getFavoriteRecipies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/recipes/favorite');
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // result.forEach(e => {
        //   const { _id } = e;
        //   this.view.printRecipeCard(e, _id);
        // });
        console.log('Успех:', result);
      } else {
        const errorData = await response.json();
        console.log('Ошибка:', response.status, errorData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  create = async jsonObject => {
    try {
      const response = await fetch('http://localhost:3000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonObject,
      });

      if (response.ok) {
        const result = await response.json();
        const { _id } = result;
        const parsed = JSON.parse(jsonObject);
        this.view.printRecipeCard(parsed, _id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  addToFavorites = async id => {
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: true }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Успех:', result);
        this.view.changeFavIconColor();
        this.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  editRecipe = async id => {
    console.log('hello form Controller editRecipe');
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
      if (response.ok) {
        const recipeObject = JSON.parse(response);
        this.view.showEditRecipeModal(recipeObject);
      }
    } catch (error) {
      console.log(error);
    }
  };

  delete = async id => {
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: 'DELETE',
        body: { _id: id },
      });
      if (response.ok) {
        this.view.removeRecipeFromPage(id);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
