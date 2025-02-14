import './styles/main.css';

// A WEIGHTED RANDOMIZER FOR SELECTING AN ORE

/* 
const oresCollection = [
  { name: 'gold', weight: 1 },
  { name: 'silver', weight: 2 },
  { name: 'copper', weight: 3 },
  { name: 'brass', weight: 4 },
  { name: 'nickel', weight: 5 },
  { name: 'iron', weight: 6 },
];

function getRandomOre() {
  const totalWeight = oresCollection.reduce((sum, ore) => sum + ore.weight, 0);
  let randomNum = Math.random() * totalWeight;

  let selectedOre = null;
  oresCollection.some(ore => {
    randomNum -= ore.weight;
    if (randomNum <= 0) {
      selectedOre = ore.name;
      return true;
    }
    return false;
  });

  return selectedOre;
}

// const randomOre = getRandomOre();
*/
