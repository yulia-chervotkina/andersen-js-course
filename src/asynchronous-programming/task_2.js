export function successCb(str) {
  console.log('Success parse!');
  console.log(str);
}

export function failureCb(err) {
  console.log('Failure parse!');
  console.log(err);
}

export function parseJSON(jsonStr, succCb, failCb) {
  try {
    const result = JSON.parse(jsonStr);
    succCb(result);
  } catch (err) {
    failCb(err);
  }
}
