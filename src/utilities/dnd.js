import { BUSY, WRONG_INV } from '../constants/errors';

export function handleDragStart(e) {
  e.target.classList.add('moving');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', e.target.getAttribute('item-id'));
  e.dataTransfer.setDragImage(e.target, 35, 35);
}

export function handleDragOver(e) {
  e.preventDefault();
}

export function handleDropTrash(e) {
  e.preventDefault();
  e.stopPropagation();

  const itemId = e.dataTransfer.getData('text/plain');

  this.removeItem(itemId);
}
// проверяем подходит ли элемент к инвентарю
function isValidInventory(item, inv) {
  const invId = inv.getAttribute('id');
  return (
    (item.classList.contains('item') &&
      (invId === 'itemInv' || invId === 'forgeInv' || invId === 'newRecipeInv')) ||
    (item.classList.contains('recipe') &&
      (invId === 'recipeInv' || inv.classList.contains('craftZone')))
  );
}

export function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.target.classList.contains('item') || e.target.classList.contains('recipe')) {
    throw new Error(BUSY);
  }
  const itemId = e.dataTransfer.getData('text/plain');
  const item = document.querySelector(`div[item-id='${itemId}']`);
  const place = e.target.parentNode;

  if (!isValidInventory(item, place)) {
    throw new Error(WRONG_INV);
  }
  this.constructor.moveItem(item, place);
}

export function handleDragEnd(e) {
  e.target.classList.remove('moving');
}
