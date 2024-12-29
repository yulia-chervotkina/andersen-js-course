/**
 * Реализовать функцию union в этом файле, и экспортировать ее.
 *
 * Функция принимает 2 массива, и возвращает массив объедененных значений,
 * без дублирования
 *
 * console.log(union([5, 1, 2, 3, 3], [4, 3, 2])); -> [5, 1, 2, 3, 4]
 * console.log(union([5, 1, 3, 3, 4], [1, 3, 4])); -> [5, 1, 3, 4]
 */

export const union = (arr1, arr2) => {
  const united = [...arr1, ...arr2];
  const result = [];
  united.forEach(el => {
    if (!result.includes(el)) {
      result.push(el);
    }
  });
  return result;
};

export const union1 = (arr1, arr2) => [...new Set([...arr1, ...arr2])];
