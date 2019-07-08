const asyncBar = async () => 'Some string!';

export default async function foo() {
  const result = await asyncBar();
  console.log(result);
}
