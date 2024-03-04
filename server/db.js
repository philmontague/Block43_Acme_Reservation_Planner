const pg = require('pg')
const { v4: uuidv4 } = require('uuid')

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner_db')

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS reservations; 
        DROP TABLE IF EXISTS customers; 
        DROP TABLE IF EXISTS restaurants; 

        CREATE TABLE customers (
            id UUID PRIMARY KEY, 
            name VARCHAR(100)
        ); 

        CREATE TABLE restaurants (
            id UUID PRIMARY KEY, 
            name VARCHAR(100)
        ); 

        CREATE TABLE reservations (
            id UUID PRIMARY KEY, 
            customer_id UUID REFERENCES customers(id) NOT NULL, 
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL, 
            date DATE, 
            party_count INT
        ); 
    `
    await client.query(SQL) 
}

const createCustomer = async (name) => {
    const SQL = `
        INSERT INTO customers (id, name) VALUES ($1, $2) RETURNING *; 
    `
    const response = await client.query(SQL [uuidv4(), name])
    return response.rows[0]
}

const createRestaurant = async (name) => {
    const SQL = ` 
        INSERT INTO restaurants (id, name) VALUES ($1, $2) RETURNING *; 
    `
    const response = await client.query(SQL [uuidv4(), name])
    return response.rows[0]
}

const fetchCustomers = async () => {
    const SQL = `
        SELECT * FROM customers; 
    `
    const response = await client.query(SQL)
    return response.rows 
}

const fetchRestaurants = async () => {
    const SQL = `
        SELECT * FROM restaurants; 
    `
    const response = await client.query(SQL) 
    return response.rows 
}

const createReservations = async ({ customer_id, restaurant_id, date, party_count }) => {
    const SQL = `
        INSERT INTO reservations (id, customer_id, restaurant_id, date, party_count) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *; 
    `
    const response = await client.query(SQL, [uuidv4(), customer_id, restaurant_id, date, party_count])
    return response.rows[0]
}

const fetchReservations = async () => {
    const SQL = `
        SELECT * FROM reservations; 
    `
    const response = await client.query(SQL) 
    return response.rows 
}

const destroyReservation = async (id) => {
    const SQL = `
        DELETE FROM reservations WHERE id = $1; 
    `
    await client.query(SQL, [id])
}

module.exports = {
    client, 
    createTables, 
    createCustomer, 
    createRestaurant, 
    fetchCustomers, 
    fetchRestaurants, 
    createReservations, 
    destroyReservation,
    fetchReservations
}

