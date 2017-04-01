const app = require('../server');
const dbs = {
	startrek: app.get('starTrekDb'),
	starwars: app.get('starWarsDb'),
};

function parseBody (body) {
  const keys = Object.keys(body);
  const parsed = {columns: '', values: ''};
  keys.forEach((key, index) => {
    parsed.columns += `${key}${index === keys.length - 1 ? '' : ','}`;
    parsed.values += `'${body[key]}'${index === keys.length - 1 ? '' : ','}`;
  });
  return parsed;
};

function parseQuery (queryDict) {
  let paramsArr = Object.keys(queryDict);
  if (paramsArr.length) {
    return paramsArr.reduce((acc, cur, idx, arr) => {
      return `${acc} ${cur}='${queryDict[cur]}'${arr[idx+1] ? ' AND' : ''}`;
    }, 'WHERE');
  } else {
    return '';
  }
}

module.exports = {
	create (request, response) {
	    const parsed = parseBody(request.body);
	    const query = `INSERT INTO ${request.table} (${parsed.columns}) VALUES (${parsed.values}) RETURNING *;`;
	    dbs[request.query.show].run(query, (dbError, dbResponse) => {
	      if (dbError) { response.status(500).send(dbError); }
	      else { response.status(201).send(dbResponse[0]); }
	    });
	  },

	readList (request, response) {
      // const where = parseQuery(request.query);
      // const query = `SELECT * FROM ${request.table} ${where};`;
      const query = `SELECT * FROM ${request.table};`;
      dbs[request.query.show].run(query, (dbError, dbResponse) => {
        if (dbError) { response.status(500).send(dbError); }
        else { response.status(200).send({results: dbResponse}); }
      });
    },

	readOne (request, response) {
		const dbQuery = `select * from ${request.table} where id=${+request.params.id};`;
		dbs[request.query.show].run(dbQuery, (dbError, dbResponse) => {
			if (dbError) {
				console.log(dbError);
				return response.status(500).send('Internal Server Error');
			} else if (!dbResponse.length) {
				return response.status(404).send('Not Found');
			} else {
				return response.status(200).send(dbResponse[0]);
			}
		});
	},

	update (request, response) {
    const parsed = parseBody(request.body);
    const query = `UPDATE ${request.table} SET (${parsed.columns}) = (${parsed.values}) WHERE id=${+request.params.id} RETURNING *;`;
    console.log(query);
    dbs[request.query.show].run(query, (dbError, dbResponse) => {
      if (dbError) { response.status(500).send(dbError); }
      if (!dbResponse || !dbResponse[0]) { response.status(404).send('Not found'); }
      else { response.status(200).send(dbResponse[0]); }
    });
  },

  destroy (request, response) {
    const query = `DELETE FROM ${request.table} WHERE id=${+request.params.id} RETURNING id;`;
    dbs[request.query.show].run(query, (dbError, dbResponse) => {
      if (dbError) { response.status(500).send(dbError); }
      if (!dbResponse[0]) { response.status(404).send('Not found'); }
      else { response.sendStatus(204); }
      // else { response.status(200).send({deleted: dbResponse[0].id}); } // send id back as additional confirmation
    });
  },
};
