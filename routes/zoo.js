const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: './data/lambda.sqlite3',
	},
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
	db('zoos')
		.then(animals => {
			res.status(200).json(animals);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

module.exports = router;
