import fetch from 'node-fetch';

const makeRequest = url => fetch(url).then(frstResponse => frstResponse.json());

export default makeRequest;
