export function foo(x, cb) {
  if (x > 10) {
    console.log(`x > 10`);
    cb();
  } else if (x <= 10) {
    console.log(`x <= 10`);
  }
}

export const createCb = str => () => console.log(str);
