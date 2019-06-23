import * as EVENTS from './constants/events';
import Recipe from './itemTypes/Recipe';
import Ore from './itemTypes/Ore';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.initializeEvents();
    // view.show(model.data);
  }

  initializeEvents() {
    this.view.on(EVENTS.MINE, this.mineOre.bind(this));
    this.view.on(EVENTS.REMOVE, this.removeItem.bind(this));
    this.view.on(EVENTS.FORGE, this.forgeItem.bind(this));
    this.view.on(EVENTS.CREATE, this.createRecipe.bind(this));
  }

  mineOre() {
    const ore = this.model.addItem(Ore.mine());
    this.view.addItem(ore);
  }

  removeItem({ id }) {
    this.model.removeItem(id);
    this.view.removeItem(id);
  }

  forgeItem({ recipeId, itemIds, itemNames }) {
    const recipe = this.model.getItem(recipeId);
    const newItem = recipe.forgeItem(itemNames);

    itemIds.forEach(id => {
      this.removeItem({ id });
    });

    this.model.addItem(newItem);
    this.view.addItem(newItem);
  }

  createRecipe({ recipeName, itemNames, itemIds }) {
    const recipe = new Recipe(recipeName, itemNames);

    itemIds.forEach(id => {
      this.removeItem({ id });
    });

    this.model.addItem(recipe);
    this.view.addItem(recipe);
  }
}

export default Controller;
