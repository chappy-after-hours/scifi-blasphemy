const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');

const port = 3000;
const app = express();

const starTrekDb = massive.connectSync({
    connectionString: 'postgres://startrekapi:makeitso@localhost/startrekapi',
});
app.set('starTrekDb', starTrekDb);
const starWarsDb = massive.connectSync({
    connectionString: 'postgres://starwarsapi:hope@localhost/starwarsapi',
});
app.set('starWarsDb', starWarsDb);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use('/api', (request, response, next) => {
    const regexResult = request.originalUrl.match(/^\/api\/([a-z]+)\/?/);
    if (regexResult && regexResult[1]) {
      request.table = regexResult[1];
      next();
    } else {
      response.sendStatus(400);
    }
});
module.exports = app;

const restCtrl = require('./controllers/restCtrl');
const endpoints = [
    'people',
    'ships',
    'species',
];
endpoints.forEach(endpoint => {
    app.get(`/api/${endpoint}`, restCtrl.readList);
    app.get(`/api/${endpoint}/:id`, restCtrl.readOne);
    app.post(`/api/${endpoint}`, restCtrl.create);
    app.put(`/api/${endpoint}/:id`, restCtrl.update);
    app.patch(`/api/${endpoint}/:id`, restCtrl.update);
    app.delete(`/api/${endpoint}/:id`, restCtrl.destroy);
});

app.listen(port, () => console.log(`ruining sci-fi on port ${port}`));
