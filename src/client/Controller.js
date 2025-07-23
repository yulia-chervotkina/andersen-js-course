import * as events from './constants/events';

export default class Controller {
  constructor(emitter, view) {
    this.emitter = emitter;
    this.view = view;

    // this.emitter.on(events.ON_RECIPE_INFO_GATHERED, this.create);
    this.emitter.on(events.CLICK_FAVORITE, this.addToFavorites);
    this.emitter.on(events.CLICK_EDIT, this.editRecipe);
    this.emitter.on(events.CLICK_DELETE, this.delete);
    this.emitter.on(events.CLICK_RECIPE, this.getAllRecipies);
    this.emitter.on(events.CLICK_FAVORITES, this.getFavoriteRecipies);
    this.emitter.on(events.ON_EDIT_MODE, this.sendEditedRecipe);
    this.emitter.on(events.CLICK_SUBMIT, this.create);
    this.emitter.on(events.CLICK_FAVORITE_TO_REMOVE, this.removeFromFavorite);
  }

  init = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/recipes');
      if (response.ok) {
        const result = await response.json();
        result.forEach(e => {
          const { _id, isFavorite } = e;
          this.view.printRecipeCard(e, _id, isFavorite);
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
        this.view.removeAllCards();
        result.forEach(e => {
          const { _id, isFavorite } = e;
          this.view.printRecipeCard(e, _id, isFavorite);
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
    console.log('geting fav recipes ...');
    const url = 'http://localhost:3000/api/recipes/favorite';
    console.log('fetching url:', url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        result.forEach(e => {
          const { _id, isFavorite } = e;
          this.view.printRecipeCard(e, _id, isFavorite);
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

  create = async () => {
    const data = this.view.getRecipeInfo();
    if (data) {
      try {
        const response = await fetch('http://localhost:3000/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          const { _id } = result;
          // const parsed = JSON.parse(data);
          this.view.printRecipeCard(data, _id);
        }
      } catch (error) {
        console.log(error);
      }
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  removeFromFavorite = async id => {
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: false }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Успех:', result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // TO-DO rename to getrecipe
  editRecipe = async id => {
    console.log('hello form Controller editRecipe');
    console.log('id received from View:', id);
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
      if (response.ok) {
        const recipeObject = await response.json();
        console.log(recipeObject);
        // const recipeObject = JSON.parse(response);
        this.view.showEditRecipeModal(recipeObject);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // TO-DO rename to editRecipe
  sendEditedRecipe = async (id, obj) => {
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Успех:', result);
        this.view.removeRecipeFromPage(id);
        this.view.printRecipeCard(result);
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
