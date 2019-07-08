import { getRandomOre } from '../utilities/utilities';

class Ore {
  constructor(name) {
    this.name = name;
    this.id = Date.now();
  }

  static mine() {
    const name = getRandomOre();
    return new Ore(name);
  }
}

export default Ore;
