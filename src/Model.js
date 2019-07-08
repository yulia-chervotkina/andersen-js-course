import { CHANGE } from './constants/events';
import EventEmitter from './EventEmitter';

class Model extends EventEmitter {
  constructor(data = []) {
    super();
    this.data = data;
  }

  addItem(item) {
    this.data.push(item);
    this.emit(CHANGE, this.data);
    return item;
  }

  getItem(id) {
    return this.data.find(item => item.id === Number(id));
  }

  removeItem(id) {
    const index = this.data.findIndex(item => item.id === Number(id));

    if (index > -1) {
      this.data.splice(index, 1);
      this.emit(CHANGE, this.data);
    }
  }
}

export default Model;
