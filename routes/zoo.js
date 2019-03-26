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

router.post('/', (req, res) => {
	if (!req.body.name) {
		res.status(406).json({ message: 'Please enter a name for the zoo' });
		return;
	}
	db('zoos')
		.insert(req.body)
		.then(ids => {
			const id = ids[0];
			db('zoos')
				.where({ id })
				.first()
				.then(animal => res.status(201).json(animal));
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

module.exports = router;
