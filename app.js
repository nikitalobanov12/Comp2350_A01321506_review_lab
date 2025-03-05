require('dotenv').config();
const express = require('express');
const pool = require('./config/db');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes

app.get('/', async (req, res) => {
	try {
		const [restaurants] = await pool.query('SELECT * FROM restaurant');
		res.render('restaurants', { restaurants, total: restaurants.length });
	} catch (err) {
		console.error('Error fetching restaurants:', err.message); // Log detailed error
		res.status(500).send('Database error: ' + err.message); // Show error to client
	}
});
app.post('/add-restaurant', async (req, res) => {
	const { name, description } = req.body;
	await pool.query('INSERT INTO restaurant (name, description) VALUES (?, ?)', [name, description]);
	res.redirect('/');
});

app.get('/delete-restaurant/:id', async (req, res) => {
	const { id } = req.params;
	await pool.query('DELETE FROM review WHERE restaurant_id = ?', [id]);
	await pool.query('DELETE FROM restaurant WHERE restaurant_id = ?', [id]);
	res.redirect('/');
});

app.get('/showReviews', async (req, res) => {
	try {
		const { id } = req.query;
		const parsedId = parseInt(id, 10); // Parse the ID

		if (isNaN(parsedId)) {
			throw new Error('Invalid restaurant ID');
		}

		const [reviews] = await pool.query('SELECT * FROM review WHERE restaurant_id = ?', [parsedId]);
		const [[restaurant]] = await pool.query('SELECT * FROM restaurant WHERE restaurant_id = ?', [parsedId]);

		if (!restaurant) {
			throw new Error('Restaurant not found');
		}

		res.render('reviews', { reviews, restaurant, total: reviews.length });
	} catch (err) {
		console.error('Error fetching reviews:', err.message);
		res.status(500).send('Database error: ' + err.message);
	}
});
app.post('/add-review', async (req, res) => {
	try {
		const { restaurant_id, reviewer_name, details, rating } = req.body;
		const parsedRestaurantId = parseInt(restaurant_id, 10);

		if (isNaN(parsedRestaurantId)) {
			throw new Error('Invalid restaurant ID');
		}

		await pool.query('INSERT INTO review (restaurant_id, reviewer_name, details, rating) VALUES (?, ?, ?, ?)', [parsedRestaurantId, reviewer_name, details, rating]);
		res.redirect(`/showReviews?id=${parsedRestaurantId}`);
	} catch (err) {
		console.error('Error adding review:', err.message);
		res.status(500).send('Failed to add review: ' + err.message);
	}
});

app.get('/delete-review/:id', async (req, res) => {
	const { id } = req.params;
	const [[review]] = await pool.query('SELECT restaurant_id FROM review WHERE review_id = ?', [id]);
	await pool.query('DELETE FROM review WHERE review_id = ?', [id]);
	res.redirect(`/showReviews?id=${review.restaurant_id}`);
});

const PORT = process.env.IS_HOSTED ? process.env.PORT : 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
