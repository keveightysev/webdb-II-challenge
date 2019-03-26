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
	db('bears')
		.then(bears => {
			res.status(200).json(bears);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.get('/:id', (req, res) => {
	db('bears')
		.where({ id: req.params.id })
		.first()
		.then(bear => {
			if (bear) {
				res.status(200).json(bear);
			} else {
				res.status(404).json({ message: 'No bear with that ID number' });
			}
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.post('/', (req, res) => {
	if (!req.body.name) {
		res.status(406).json({ message: 'Please enter a name for the bear' });
		return;
	}
	db('bears')
		.insert(req.body)
		.then(ids => {
			const id = ids[0];
			db('bears')
				.where({ id })
				.first()
				.then(bear => res.status(201).json(bear));
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.put('/:id', (req, res) => {
	if (!req.body.name) {
		res.status(406).json({ message: 'Please enter a name for the bear' });
		return;
	}
	db('bears')
		.where({ id: req.params.id })
		.update(req.body)
		.then(updates => {
			if (updates > 0) {
				db('bears')
					.where({ id: req.params.id })
					.first()
					.then(bear => {
						res.status(200).json(bear);
					});
			} else {
				res.status(404).json({ message: 'bear with that ID not found' });
			}
		})
		.catch(err => res.status(500).json(err));
});

router.delete('/:id', (req, res) => {
	db('bears')
		.where({ id: req.params.id })
		.del()
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'bear has been deleted' });
			} else {
				res.status(404).json({ message: 'bear with that id not found' });
			}
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

module.exports = router;
