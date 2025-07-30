export const root = 'http://localhost:3000/api';
export const recipes = `${root}/recipes`;
export const fav = `${recipes}/favorite`;
export const recipeByID = id => `${recipes}/${id}`;
