// Task #1
//
// Write sumArray function, that will accept array, success callback, failure callback
// and return nothing. It should summarize all elements and pass sum in the success cb.
// if error occurs or elements are not numbers - it should invoke fail cb.
//
// sumArray([1, 2, 3, 4, 5], console.log, console.log)
// 15
//
// sumArray([1, 2, {}, 4, 5], console.log, ()=> console.log('error'))
// error

// Task #2

// Write a function that will make GET request to 'https://api.kanye.rest' - if it has a quote, make another one. No async/await

// Task #3

// Write a function that will make 5 sequential and 5 parallel requests to 'https://api.kanye.rest';

// Task #4
// Write function that will return rejected promise with {reason: 'intentional'} value.

// Task #5
// Create 3 Promises that will resolve to numbers and then console log sum of these numbers. Async/await is required.

// Task #6
// Write Task #2 with async/await

// Task #Hell

// Write output in the console in the right order. You cannot use any source of information at this moment or run this or any other code.
// Output should be printed in column and with your comments why it's at this place of order.

// setTimeout(() => console.log(1), 500);

// console.log(2);

// new Promise((res) => {
//     console.log(3);

//     setTimeout(() => {
//         console.log(4);
//         res();
//     }, 0);
// }).then(() => console.log(5));

// Promise.resolve()
//     .then(() => console.log(6))
//     .then(() => console.log(7));
