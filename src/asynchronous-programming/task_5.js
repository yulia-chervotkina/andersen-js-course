import makeRequest from '../makeRequest';

export default function task5() {
  const URLS = [
    'http://www.json-generator.com/api/json/get/cevhxOsZnS',
    'http://www.json-generator.com/api/json/get/cguaPsRxAi',
    'http://www.json-generator.com/api/json/get/cfDZdmxnDm',
    'http://www.json-generator.com/api/json/get/cfkrfOjrfS',
    'http://www.json-generator.com/api/json/get/ceQMMKpidK',
  ];

  // Parallel

  Promise.all(URLS.map(makeRequest)).then(dataArray => {
    console.log('PARALLEL:');
    console.log(dataArray);
  });

  // Sequential

  const result = URLS.reduce((acc, next) => {
    return acc.then(chainData =>
      makeRequest(next).then(currentData => [...chainData, currentData])
    );
  }, Promise.resolve([]));

  result.then(dataArray => {
    console.log('SEQUENTIAL:');
    console.log(dataArray);
  });
}
