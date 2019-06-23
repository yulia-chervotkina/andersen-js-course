import Ore from './Ore';

class Item extends Ore {
  constructor(name, color) {
    super(name);
    this.forged = true;
    this.color = color;
  }
}

export default Item;
