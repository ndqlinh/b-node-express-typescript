import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res, next) => {
  res.send({ message: 'NodeJS Express Typescript App' })
});

app.listen(3000, () => console.log('Running on port 3000'));
