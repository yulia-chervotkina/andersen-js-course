import Musician from './asynchronous-programming/Musician';

// import { foo, createCb } from './asynchronous-programming/task_1';
// import { parseJSON, successCb, failureCb } from './asynchronous-programming/task_2';
// import delay from './asynchronous-programming/task_3';
// import task4 from './asynchronous-programming/task_4';
// import task5 from './asynchronous-programming/task_5';
// import getResolvedPromise from './asynchronous-programming/task_6';
// import foo from './asynchronous-programming/task_7';
// import foo from './asynchronous-programming/task_8';
// import foo from './asynchronous-programming/task_9';

console.log('DRATUTI');

// foo(5, createCb('cb'));
// foo(20, createCb('qwerty'));

// console.log('==================================');

// parseJSON('{"x": 10}', successCb, failureCb);
// parseJSON('{x}', successCb, failureCb);

// console.log('==================================');

// delay(1000).then(value => console.log(`Done with ${value}`));

// console.log('==================================');

// task4();

// console.log('==================================');

// task5();

// console.log('==================================');

// getResolvedPromise(500)
//   .then(value => {
//     if (value > 300) {
//       throw new Error('Ошибка');
//     }
//   })
//   .catch(err => console.log(err))
//   .finally(() => console.log('This is Finally!'));

// console.log('==================================');

// foo();

// console.log('==================================');

// foo('https://jsonplaceholder.typicode.com/users');
// foo('ht://jsonplaceholder.typicode.com/users');

// console.log('==================================');

// foo();

// console.log('==================================');

const musician = new Musician('https://jsonplaceholder.typicode.com/albums');
musician.getAlbums().then(albums => console.log(albums));
