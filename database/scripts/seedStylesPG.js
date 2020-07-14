const path = require('path');
const pg = require('../pgconnection.js');

const createStyles = () => {
  const query = `CREATE TABLE styles (
    style_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    original_price INT NOT NULL,
    sale_price INT NOT NULL,
    default_style INT NOT NULL
  )`;

  return pg.query('DROP TABLE IF EXISTS styles')
  .then(() => pg.query(query))
}

const seedStylesDb = () => {
  if (process.env.NODE_ENV === 'dev') {
    return;
  }
  const pathToCSV = 'home/bitnami/seed_files/features.csv';
  // const pathToCSV = process.env.NODE_ENV === 'prod' ? 'home/bitnami/seed_files/styles.csv' : path.resolve(__dirname, '/media/dk/UBUNTU 20_0/SDC_CSV/styles.csv');

  const delimiter = ',';
  const sqlString = `COPY styles(style_id, product_id, name, original-price, sale_price, default_style) FROM '${pathToCSV}' DELIMITER '${delimiter}' CSV HEADER`;
  return pg.query(sqlString);
};

const indexStyleId = () => {
  const sqlString = 'CREATE INDEX idx_styleId ON styles(product_id)';

  return pg.query(sqlString);
}

createStyles()
  .then(() => console.log('Created styles table, now importing data'))
  .then(seedStylesDb)
  .then(() => console.log('Imported all records, now creating index on product_id'))
  .then(indexStyleId)
  .catch(console.log)