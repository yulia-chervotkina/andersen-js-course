const getResponse = response => response.json();
const printData = data => console.log(data);
const fetchFunc = url => {
  fetch(url)
    .then(getResponse)
    .then(printData);
};

// Task #1
//
// Write sumArray function, that will accept array, success callback,
// failure callback and return nothing. It should summarize all elements
// and pass sum in the success cb.
// if error occurs or elements are not numbers - it should invoke fail cb.

function sumArray(arr, sucCb, failCb) {
  if (!Array.isArray(arr)) return failCb();
  const isNumber = arr.every(el => typeof el === 'number');
  if (!isNumber) return failCb();
  if (isNumber) {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    sucCb(sum);
  }
}

// Task #2

// Write a function that will make GET request
// to 'https://api.kanye.rest' - if it has a quote,
// make another one. No async/await

function getData() {
  fetch('https://api.kanye.rest')
    .then(response => {
      if (!response.ok) throw response;
      fetchFunc('https://api.kanye.rest');
    })
    .catch(err => {
      console.error('Error fatal', err);
    });
}

// Task #3

// Write a function that will make 5 sequential
// and 5 parallel requests to 'https://api.kanye.rest';

function getDataFromKanye() {
  // 5 parallel requests
  const urls = [
    'https://api.kanye.rest',
    'https://api.kanye.rest',
    'https://api.kanye.rest',
    'https://api.kanye.rest',
    'https://api.kanye.rest',
  ];
  Promise.all(urls.map(url => fetchFunc(url)));

  // 5 sequential requests

  const sequental = async function(urls) {
    const arrayOfPromises = urls.map(url => fetch(url));
    for await (let response of arrayOfPromises) {
      const data = await response.json();
    }
  };
  return sequental(urls);
}

// Task #4
// Write function that will return rejected promise with
// {reason: 'intentional'} value.

function rejected() {
  return Promise.reject({ reason: 'intentional' });
}

// Task #5
// Create 3 Promises that will resolve to numbers
// and then console log sum of these numbers. Async/await is required.

async function sumPromises() {
  const promise1 = Promise.resolve(10);
  const promise2 = Promise.resolve(15);
  const promise3 = Promise.resolve(25);
  const promise = await Promise.all([promise1, promise2, promise3]);
  console.log(promise.reduce((val, acc) => val + acc, 0));
}

// Task #6
// Write Task #2 with async/await
// Write a function that will make GET request
// to 'https://api.kanye.rest' - if it has a quote, make another one.

async function getKanye() {
  try {
    const response1 = await fetch('https://api.kanye.rest');
    if (response1.ok) {
      const response2 = await fetch('https://api.kanye.rest');
      const data2 = await response2.json();
      printData(data2);
    }
  } catch (err) {
    console.error('no Kanye for you today go read Dostoyevsky', err);
  }
}

// Task #Hell

// Write output in the console in the right order.
// You cannot use any source of information at this moment
// or run this or any other code.
// Output should be printed in column and with your comments
// why it's at this place of order.

// setTimeout(() => console.log(1), 500);

// console.log(2);

// new Promise((res) => {
//   console.log(3);

//   setTimeout(() => {
//     console.log(4);
//     res();
//   }, 0);
// }).then(() => console.log(5));

// Promise.resolve()
//   .then(() => console.log(6))
//   .then(() => console.log(7));

// CONSOLE OUTPUT

// setTimeout(() => console.log(1), 500) will be 'noted'
// but not executed yet since it's an async code

2; // syncronous code first
3; // syncronous code again

// setTimeout inside the new Promise will be kept for later as well,
// together with it's async then()

6; // Promise.resolve is next in line with the two then() pieces of code
7; // that will print one after the other

// Now, since there's nothing in the callstack,it's time for the code we saved for later

4; // this setTimeout goes first because it's waiting time is 0
5; // since it's chained to the setTimeout and is supposed to print after setTimeout finishes
1; // this setTimeout follows
