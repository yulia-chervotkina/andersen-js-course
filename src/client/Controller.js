import * as events from './constants/events';

export default class Controller {
  constructor(emitter, view) {
    this.emitter = emitter;
    this.view = view;

    this.emitter.on(events.ON_RECIPE_INFO_GATHERED, this.create);
    this.emitter.on(events.CLICK_FAVORITE, this.addToFavorites);
    this.emitter.on(events.CLICK_EDIT, this.editRecipe);
    this.emitter.on(events.CLICK_DELETE, this.delete);
  }

  create = async recipe => {
    console.log('hello from controller create');
    try {
      const response = await fetch('http://localhost:8080/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: recipe,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Успех:', result);
        this.reset();
      } else {
        const errorData = await response.json();
        console.log('Ошибка:', response.status, errorData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  addToFavorites = async recipe => {
    try {
      // TO-DO correct address - need to pass some identifier of a recipe
      const response = await fetch('http://localhost:3000/api/recipes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: recipe({ isFavorite: true }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Успех:', result);
        this.reset();
      } else {
        const errorData = await response.json();
        console.log('Ошибка:', response.status, errorData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  editRecipe = async recipe => {
    let recipeObject;
    try {
      const response = await fetch('URL', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: recipe,
      });
      if (response.ok) {
        recipeObject = JSON.parse(response);
        this.view.showEditRecipeModal(recipeObject);
      }
    } catch (error) {
      console.log(error);
    }
  };

  delete = async recipe => {
    try {
      const response = await fetch('URL', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: recipe,
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Успех:', result);
        this.view.removeRecipeFromPage(recipe);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
