const express = require('express')
const { client, createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, createReservation, destroyReservation, fetchReservations } = require('./db');


const app = express() 
const PORT = process.env.PORT || 3000 

app.use(express.json())

// Get Customers 
app.get('/api/customers', async (req, res, next) => {
    try {
        const customers = await fetchCustomers() 
        res.json(customers) 
    } catch (err) {
        next(err) 
    }
})

// Get Restaurants 
app.get('/api/restaurants', async (req, res, next) => {
    try {
        const restaurants = await fetchRestaurants() 
        res.json(restaurants)
    } catch (err) {
        next(err)
    }
})

// Post Reservations 
app.post('/api/reservations/:id/reservations', async (req, res, next) => {
    try {
        const { restaurant_id, date, party_count } = req.body 
        const { id } = req.params 
        const reservation = await createReservation({ customer_id, restaurant_id, date, party_count })
        res.status(201).json(reservation) 
    } catch (err) {
        next(err)
    }
})

// Fetch Reservations 
app.get('/api/reservations', async (req, res, next) => {
    try {
        const reservations = await fetchReservations() 
        res.json(reservations) 
    } catch (err) {
        next(err)
    }
})

// Delete Reservation 
app.delete('/api/customers/:customer_id/reservations:/:id', async (req, res, next) => {
    try {
        const { id } = req.params 
        await destroyReservation(id) 
        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.error(err) 
    res.status(500).json({ error: 'Internal Server Error' })
})

const init = async () => {
    try {
        await client.connect() 
        console.log('Connected to the database')
        await createTables() 
        console.log('Tables created')
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
    } catch (err) {
        console.error('Error initializing server:', err)
    }
}

init() 

module.exports = app 