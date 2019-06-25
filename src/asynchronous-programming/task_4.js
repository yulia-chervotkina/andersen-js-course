import fetch from 'node-fetch';

export default function task4() {
  // Не могу понять, какой вариант более читабельный. Вроде второй поаккуратней.

  // fetch('http://www.json-generator.com/api/json/get/cfQCylRjuG').then(response =>
  //   response.json().then(data => {
  //     const { getUsersData } = data;
  //     if (getUsersData) {
  //       fetch('http://www.json-generator.com/api/json/get/cfVGucaXPC').then(newResponse =>
  //         newResponse.json().then(result => console.log(result))
  //       );
  //     }
  //   })
  // );

  const response = fetch('http://www.json-generator.com/api/json/get/cfQCylRjuG').then(
    frstResponse => frstResponse.json()
  );

  response.then(data => {
    const { getUsersData } = data;
    if (getUsersData) {
      const newResponse = fetch('http://www.json-generator.com/api/json/get/cfVGucaXPC').then(
        scndResponse => scndResponse.json()
      );

      newResponse.then(result => console.log(result));
    }
  });
}
