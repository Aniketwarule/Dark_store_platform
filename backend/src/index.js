const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const inventoryRouter = require('./routes/inventory');
const orderRoutes = require('./routes/orderRoutes'); // Add this line for order routes

const app = express();

app.use(express.json());
app.use(cors());

// Existing inventory route
app.use('/inventory', inventoryRouter);
app.use('/gemini', require('./routes/geminiRoute'));
<<<<<<< HEAD

// New orders route
app.use('/api/orders', orderRoutes);
=======
>>>>>>> a63396536a9e71b1f4bf96fca5dd270a5f836f44

app.get('/', (req, res) => {
    res.send('Hii there')
});

// MongoDB connection
mongoose.connect('mongodb+srv://aniketwarule775:CdJ1lRci5YIBItYZ@cluster0.szgy81i.mongodb.net/', {
    dbName: 'dark_store_DB'
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

app.listen(8000, () => {
    console.log('Backend started at 8000')
});