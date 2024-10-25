const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment-timezone');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'md-ashif', // replace with your MySQL username
    password: '@ARahman0622', // replace with your MySQL password
    database: 'symphony' // replace with your database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Endpoint to book a car
app.post('/api/bookCar', (req, res) => {
    const { car, fromDate, toDate } = req.body;
    
    // Convert to your timezone
    const from = moment(fromDate).tz('Asia/Kolkata').format(); // e.g., 'Asia/Kolkata'
    const to = moment(toDate).tz('Asia/Kolkata').format();

    const query = 'INSERT INTO bookings (car, from_date, to_date) VALUES (?, ?, ?)';
    db.query(query, [car, from, to], (error, results) => {
        if (error) {
            console.error('Error inserting booking:', error);
            return res.status(500).json({ message: 'Error booking the car.' });
        }
        res.json({ message: 'Booking successful!' });
    });
});

// Endpoint to get all bookings
app.get('/api/bookings', (req, res) => {
    const query = 'SELECT * FROM bookings';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching bookings:', error);
            return res.status(500).json({ message: 'Error fetching bookings.' });
        }

        // Convert to local timezone for display
        const bookings = results.map(booking => ({
            id: booking.id,
            car: booking.car,
            from_date: moment(booking.from_date).tz('Asia/Kolkata').format('YYYY-MM-DD'), // Format as needed
            to_date: moment(booking.to_date).tz('Asia/Kolkata').format('YYYY-MM-DD')
        }));

        res.json(bookings);
    });
});

// Endpoint to delete a booking
app.delete('/api/bookings/:id', (req, res) => {
    const bookingId = req.params.id;
    const query = 'DELETE FROM bookings WHERE id = ?';
    db.query(query, [bookingId], (error, results) => {
        if (error) {
            console.error('Error deleting booking:', error);
            return res.status(500).json({ message: 'Error deleting booking.' });
        }
        res.json({ message: 'Booking deleted successfully!' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
