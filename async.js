// Task #1
//
// Write sumArray function, that will accept array, success callback,
// failure callback and return nothing. It should summarize all elements
// and pass sum in the success cb.
// if error occurs or elements are not numbers - it should invoke fail cb.

function sumArray(arr, sucCb, failCb) {
  const sum = arr.reduce((acc, val) => acc + val, 0);
  if (Number(sum)) sucCb(sum);
  if (!Number(sum)) failCb(sum);
}
sumArray([1, 2, 3, 4, 5], console.log, console.log);
sumArray([1, 2, {}, 4, 5], console.log, () => console.log("error"));

// Task #2

// Write a function that will make GET request
// to 'https://api.kanye.rest' - if it has a quote,
// make another one. No async/await

function getData() {
  return fetch("https://api.kanye.rest")
    .then((responce) => responce.json())
    .then((data) => console.log(data));
}

getData().then(getData());

// Task #3

// Write a function that will make 5 sequential
// and 5 parallel requests to 'https://api.kanye.rest';

function getDataFromKanye() {
  // 5 parallel requests
  const urls = [
    "https://api.kanye.rest",
    "https://api.kanye.rest",
    "https://api.kanye.rest",
    "https://api.kanye.rest",
    "https://api.kanye.rest",
  ];
  Promise.all(
    urls.map((url) =>
      fetch(url)
        .then((responce) => responce.json())
        .then((data) => console.log(data))
    )
  );

  // 5 sequential requests

  const sequental = async function () {
    const responce = await fetch("https://api.kanye.rest");
    const data = await responce.json();
    console.log(data);
  };

  return sequental()
    .then(sequental())
    .then(sequental())
    .then(sequental())
    .then(sequental());
}

getDataFromKanye();

// Task #4
// Write function that will return rejected promise with
// {reason: 'intentional'} value.

function rejected() {
  return Promise.reject("{reason: 'intentional'}").catch((error) =>
    console.error(error)
  );
}

rejected();

// Task #5
// Create 3 Promises that will resolve to numbers
// and then console log sum of these numbers. Async/await is required.

const firstPromise = new Promise((resolve) => resolve(10));
const secondPromise = new Promise((resolve) => resolve(15));
const thirdPromise = new Promise((resolve) => resolve(25));
const allPromises = Promise.all([firstPromise, secondPromise, thirdPromise]);

async function sumPromises() {
  const promise = await allPromises;
  console.log(promise.reduce((val, acc) => val + acc, 0));
}
sumPromises();

// Task #6
// Write Task #2 with async/await
// Write a function that will make GET request
// to 'https://api.kanye.rest' - if it has a quote, make another one.

async function getKanye() {
  const responce = await fetch("https://api.kanye.rest");
  const data = await responce.json();
  console.log(data);
}

getKanye().then(getKanye());

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
5; //
1; // this setTimeout follows