const cds = require('@sap/cds');
const { Client } = require('pg');
const { getPostgresConfig } = require('./lib/postgres-config');

// Add a custom endpoint to demonstrate PostgreSQL connectivity
cds.on('served', () => {
  const app = cds.app;
  const path = require('path');
  
  // Add JSON parsing middleware for custom endpoints
  app.use('/api', require('express').json());
  
  // Serve static frontend
  app.use('/app', require('express').static(path.join(__dirname, 'app')));
  
  // Redirect root to app
  app.get('/', (req, res) => {
    res.redirect('/app');
  });
  
  // Custom endpoint that bypasses CAP ORM and uses direct PostgreSQL
  app.get('/api/test-postgres', async (req, res) => {
    const client = new Client(getPostgresConfig());
    
    try {
      await client.connect();
      console.log('✅ Direct PostgreSQL connection successful');
      
      const result = await client.query(`
        SELECT 
          b.title, 
          a.name as author, 
          b.price, 
          b.currency_code 
        FROM sap_capire_bookstore_books b
        LEFT JOIN sap_capire_bookstore_authors a ON b.author_id = a.id
        LIMIT 3
      `);
      
      await client.end();
      
      res.json({
        success: true,
        message: "🎯 PostgreSQL + Kyma Integration Working!",
        books: result.rows,
        connection_info: {
          host: process.env.POSTGRES_HOST || 'localhost',
          database: process.env.POSTGRES_DB || 'capdb',
          ssl_mode: process.env.NODE_ENV === 'production' ? "required" : "disabled"
        }
      });
      
    } catch (error) {
      if (client) await client.end();
      console.error('❌ PostgreSQL connection failed:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Custom endpoint to get all books (bypassing CAP timeout issues)
  app.get('/api/books', async (req, res) => {
    const client = new Client(getPostgresConfig());
    
    try {
      await client.connect();
      
      const result = await client.query(`
        SELECT 
          b.id,
          b.title, 
          a.name as author, 
          b.price, 
          b.currency_code,
          b.genre,
          b.stock,
          b.description,
          b.publisher,
          b.published_at,
          b.isbn,
          b.created_at
        FROM sap_capire_bookstore_books b
        LEFT JOIN sap_capire_bookstore_authors a ON b.author_id = a.id
        ORDER BY b.created_at DESC
      `);
      
      await client.end();
      
      res.json({
        success: true,
        books: result.rows
      });
    } catch (error) {
      console.error('❌ Database query error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Custom endpoint to get authors (bypassing CAP timeout issues)
  app.get('/api/authors', async (req, res) => {
    const client = new Client(getPostgresConfig());
    
    try {
      await client.connect();
      
      const result = await client.query(`
        SELECT id, name, date_of_birth, nationality, biography, created_at
        FROM sap_capire_bookstore_authors 
        ORDER BY name
      `);
      
      await client.end();
      
      res.json({
        success: true,
        authors: result.rows
      });
      
    } catch (error) {
      if (client) await client.end();
      console.error('❌ Failed to load authors:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Custom endpoint to add authors (bypassing CAP timeout issues)  
  app.post('/api/authors', async (req, res) => {
    const client = new Client(getPostgresConfig());    try {
      await client.connect();
      
      const { name, biography, dateOfBirth } = req.body;
      const authorId = require('crypto').randomUUID();
      
      const result = await client.query(`
        INSERT INTO sap_capire_bookstore_authors 
        (id, name, date_of_birth, biography, created_by, created_at, modified_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        authorId,
        name,
        dateOfBirth || null,
        biography || null,
        'user',
        new Date(),
        new Date()
      ]);
      
      await client.end();
      
      res.json({
        success: true,
        message: "✅ Author added successfully!",
        author: result.rows[0]
      });
      
    } catch (error) {
      if (client) await client.end();
      console.error('❌ Failed to add author:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Custom endpoint to add books (bypassing CAP timeout issues)
  app.post('/api/books', async (req, res) => {
    const client = new Client(getPostgresConfig());
    
    try {
      await client.connect();
      
      const { title, author_ID, genre, price, currency_code, stock, description, publisher, isbn, publishedAt } = req.body;
      const bookId = require('crypto').randomUUID();
      
      const result = await client.query(`
        INSERT INTO sap_capire_bookstore_books 
        (id, title, author_id, genre, price, currency_code, stock, description, publisher, published_at, isbn, created_by, created_at, modified_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
        bookId,
        title,
        author_ID,
        genre,
        parseFloat(price),
        currency_code || 'USD',
        parseInt(stock) || 0,
        description || null,
        publisher || null,
        publishedAt || new Date(),
        isbn || null,
        'user',
        new Date(),
        new Date()
      ]);
      
      await client.end();
      
      res.json({
        success: true,
        message: "✅ Book added successfully!",
        book: result.rows[0]
      });
      
    } catch (error) {
      if (client) await client.end();
      console.error('❌ Failed to add book:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});

// Start the CAP server
module.exports = cds.server;