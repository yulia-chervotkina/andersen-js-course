export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventID, cb) {
    if (!Array.isArray(this.events[eventID])) this.events[eventID] = [];
    this.events[eventID].push(cb);
  }

  emit(eventID, ...args) {
    if (!this.events[eventID]) return;
    this.events[eventID].forEach(cb => cb(...args));
  }
}
