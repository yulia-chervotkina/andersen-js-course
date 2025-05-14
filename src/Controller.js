/* eslint-disable no-plusplus */
import Ore from './Ore';

export default class Controller {
  constructor(model, view, emitter) {
    this.model = model;
    this.view = view;
    this.EventEmitter = emitter;
    this.oresCollection = [
      new Ore('gold', 1),
      new Ore('silver', 2),
      new Ore('copper', 3),
      new Ore('brass', 4),
      new Ore('nickel', 5),
      new Ore('iron', 6),
    ];
    // ///////////// EVENT EMITTER ///////////////
    this.EventEmitter.on('click:mine', this.mine.bind(this));
    this.EventEmitter.on('onDrop', this.onDrop.bind(this));
  }

  getRandomOre() {
    const totalWeight = this.oresCollection.reduce((sum, ore) => sum + ore.weight, 0);
    let randomNum = Math.random() * totalWeight;
    return this.oresCollection.find(ore => {
      randomNum -= ore.weight;
      return randomNum <= 0;
    });
  }

  mine() {
    const index = this.model.findFirstEmptySlotIndex();

    if (index === -1) {
      this.view.showInventoryFullMessage();
      return;
    }

    const newOre = this.getRandomOre();
    this.model.inventorySlots[index].content = newOre;
    this.model.inventorySlots[index].isFilled = true;
    this.view.displayOre(newOre, index);
  }

  onDrop(index) {
    this.model.clearSlot(index);
  }
}
