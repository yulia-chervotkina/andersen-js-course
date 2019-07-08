import rcolor from 'rcolor';
import * as ORES from '../constants/ores';

export function takeItemsFrom(place, selector) {
  const itemsList = place.querySelectorAll(selector);
  return Array.from(itemsList);
}

export function createSlot() {
  const slot = document.createElement('div');
  slot.classList.add('slot');
  slot.setAttribute('free', 'true');
  return slot;
}

export function createDOMFragmentWith(count, cb) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    fragment.appendChild(cb());
  }
  return fragment;
}

export function getRandomColor() {
  const goldenRatio = 0.618033988749895; // ... truncated

  return rcolor({
    hue: (Math.random() + goldenRatio) % 1,
    saturation: 0.25,
    value: 0.8,
  });
}

export function getRandomOre() {
  const random = Math.round(Math.random() * 100);
  if (random <= 30) {
    return ORES.COPPER;
  }
  if (random > 30 && random <= 50) {
    return ORES.BRASS;
  }
  if (random > 50 && random <= 65) {
    return ORES.NICKEL;
  }
  if (random > 65 && random <= 75) {
    return ORES.IRON;
  }
  if (random > 85 && random <= 95) {
    return ORES.SILVER;
  }
  return ORES.GOLD;
}

export function save(data) {
  const string = JSON.stringify(data);

  localStorage.setItem('mine', string);
}

export function load() {
  const string = localStorage.getItem('mine');

  const data = JSON.parse(string);
  return data;
}
