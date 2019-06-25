export default function getResolvedPromise(value) {
  return new Promise(res => res(value));
}
