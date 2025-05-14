export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventID, cb) {
    if (!Array.isArray(this.events[eventID])) this.events[eventID] = [];
    if (!this.events[eventID].includes(cb)) this.events[eventID].push(cb);
  }

  off(eventID, cb) {
    const index = this.events[eventID].indexOf(cb);
    if (index === -1) return;
    this.events[eventID].splice(index, 1);
  }

  emit(eventID, ...args) {
    if (!this.events[eventID]) return;
    this.events[eventID].forEach(cb => cb(...args));
  }
}
