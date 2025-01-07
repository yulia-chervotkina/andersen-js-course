/**
 * Функция может быть вызвана множеством параметров
 * a, b - числа
 * Остальные параметры нужно превратить в массив, чтобы получить количество эл-тов
 * через length
 *
 * Пример вызова
 * console.log(task2Old(1, 2, "test", false, "new", "best") === 12); -> true
 */

export function task2Old(a, b) {
  var data = Array.prototype.slice.call(arguments, 2);
  return (a + b) * data.length;
}

// Напишите реализацию функции task2Old на ES6+ ниже этого комментария.
// При желании, можете использовать стрелочную функцию, вместо обычной

const task2New = (a, b, ...args) => {
  return (a + b) * args.length;
};

console.log(task2New(1, 2, 'test', false, 'new', 'best') === 12);
// принимает в себя множество аргументов, возвращает сумму первых двух аргументов умноженное на кол-во остальных аргументов
