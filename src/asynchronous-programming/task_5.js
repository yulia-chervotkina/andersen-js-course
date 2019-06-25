import fetch from 'node-fetch';

export default function task5() {
  // Parallel

  const urls = [
    'http://www.json-generator.com/api/json/get/cevhxOsZnS',
    'http://www.json-generator.com/api/json/get/cguaPsRxAi',
    'http://www.json-generator.com/api/json/get/cfDZdmxnDm',
    'http://www.json-generator.com/api/json/get/cfkrfOjrfS',
    'http://www.json-generator.com/api/json/get/ceQMMKpidK',
  ];

  const makeRequest = url => fetch(url).then(frstResponse => frstResponse.json());

  Promise.all(urls.map(makeRequest)).then(dataArray => console.log(dataArray));

  // Sequential

  fetch(urls[0])
    .then(firstResponse => firstResponse.json())
    .then(firstData => {
      fetch(urls[1])
        .then(scndResponse => scndResponse.json())
        .then(scndData => {
          fetch(urls[2])
            .then(thirdResponse => thirdResponse.json())
            .then(thirdData => {
              fetch(urls[3])
                .then(fourthResponse => fourthResponse.json())
                .then(fourthData => {
                  fetch(urls[4])
                    .then(fifthResponse => fifthResponse.json())
                    .then(fifthData => {
                      console.log([firstData, scndData, thirdData, fourthData, fifthData]);
                    });
                });
            });
        });
    });
}
