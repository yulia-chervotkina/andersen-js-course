import mongoose from 'mongoose';
import { DATABASE_URL, DB_USER, DB_PASSWORD } from '../config';
import Recipe from './recipe';

// Добавлены опции для сохранения соединения, реконнекта и еще св-во для работы метода findByIdAndUpdate()

mongoose.set('useFindAndModify', false);

const connectDb = () => {
  return mongoose.connect(DATABASE_URL, {
    user: DB_USER,
    pass: DB_PASSWORD,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
  });
};

const models = { Recipe };

export { connectDb };

export default models;
