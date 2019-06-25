import fetch from 'node-fetch';

const getUsers = url => fetch(url);

export default async function foo(url) {
  try {
    const response = await getUsers(url);
    const [user] = await response.json();
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}
