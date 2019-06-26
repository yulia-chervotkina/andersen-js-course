import makeRequest from '../makeRequest';

export default function task4() {
  const FIRST_URL = 'http://www.json-generator.com/api/json/get/cfQCylRjuG';
  const SECOND_URL = 'http://www.json-generator.com/api/json/get/cfVGucaXPC';

  makeRequest(FIRST_URL).then(data => {
    const { getUsersData } = data;
    if (getUsersData) {
      makeRequest(SECOND_URL).then(result => console.log(result));
    }
  });
}
