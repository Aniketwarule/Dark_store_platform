const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const inventoryRouter = require('./routes/inventory');

const app = express();

app.use(express.json());
app.use(cors())


app.use('/inventory', inventoryRouter);

app.get('/', (req, res) => {
    res.send('Hii there')
})

mongoose.connect('mongodb+srv://aniketwarule775:CdJ1lRci5YIBItYZ@cluster0.szgy81i.mongodb.net/', {dbName: 'dark_store_DB'});


app.listen(8000, () => {
    console.log('Backend started at 8000')
})
