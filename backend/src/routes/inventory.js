const express = require('express');
const router = express.Router();
const Inventory = require('../db/db');
const { viewInventory, staff_assignments } = require('./offlineRoutes');


router.post('/add', async (req, res) => {

});

router.get('/all', async (req, res) => {
    try {
        const inventory = viewInventory();
        // covert it to array of objects
        const inventoryArray = Object.values(inventory);
        console.log(inventoryArray)
        res.status(200).json(inventoryArray);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get all inventory', error });
    }
});

router.get('/staff', async (req, res) => {
    try {
        const staff = staff_assignments;
        res.status(200).json(staff);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get staff assignments', error });
    }
});

router.get('/opetimize', async (req, res) => {
    try {
        const inventory = viewInventory();
        // covert it to array of objects
        const inventoryArray = Object.values(inventory);
        console.log(inventoryArray)
        res.status(200).json(inventoryArray);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get all inventory', error });
    }
});


module.exports = router;

