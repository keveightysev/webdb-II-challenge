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
		.then(zoos => {
			res.status(200).json(zoos);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.get('/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.first()
		.then(zoo => {
			if (zoo) {
				res.status(200).json(zoo);
			} else {
				res.status(404).json({ message: 'No Zoo with that ID number' });
			}
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
				.then(zoo => res.status(201).json(zoo));
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.put('/:id', (req, res) => {
	if (!req.body.name) {
		res.status(406).json({ message: 'Please enter a name for the zoo' });
		return;
	}
	db('zoos')
		.where({ id: req.params.id })
		.update(req.body)
		.then(updates => {
			if (updates > 0) {
				db('zoos')
					.where({ id: req.params.id })
					.first()
					.then(zoo => {
						res.status(200).json(zoo);
					});
			} else {
				res.status(404).json({ message: 'Zoo with that ID not found' });
			}
		})
		.catch(err => res.status(500).json(err));
});

router.delete('/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.del()
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'Zoo has been deleted' });
			} else {
				res.status(404).json({ message: 'Zoo with that id not found' });
			}
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

module.exports = router;
