import Item from './Item';
import Ore from './Ore';
import { getRandomColor } from '../utilities/utilities';
import { WRONG_INGR } from '../constants/errors';

class Recipe extends Ore {
  constructor(name, requre) {
    super(name);
    this.requre = requre;
    this.itemColor = getRandomColor();
  }

  forgeItem(items) {
    // сверяем ингредиенты с рецептом
    const check = this.requre.reduce(
      (acc, next) => {
        const index = acc.indexOf(next);
        if (index !== -1) {
          acc.splice(index, 1);
        }
        return acc;
      },
      [...items]
    );
    if (check.length === 0) {
      return new Item(this.name, this.itemColor);
    }
    throw new Error(WRONG_INGR);
  }
}

export default Recipe;
