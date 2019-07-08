// eslint-disable-next-line no-undef
const makeRequest = url => fetch(url).then(frstResponse => frstResponse.json());

export default makeRequest;
