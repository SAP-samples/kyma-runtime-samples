const cds = require('@sap/cds');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { getPostgresConfig } = require('./lib/postgres-config');

// Helper function to parse CSV files
function parseCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const row = {};
      headers.forEach((header, index) => {
        let value = values[index];
        
        // Handle quoted values and remove quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Convert empty strings to null
        if (value === '') {
          value = null;
        }
        
        row[header] = value;
      });
      return row;
    });
  } catch (error) {
    console.warn(`⚠️  Could not read CSV file ${filePath}:`, error.message);
    return [];
  }
}

async function initializeDatabase() {
  try {
    console.log('🚀 Starting PostgreSQL database initialization...');
    
    // Direct PostgreSQL connection for initial setup
    const client = new Client(getPostgresConfig());

    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if tables already exist
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'sap_%'
    `);

    if (tableCheck.rows.length > 0) {
      console.log('ℹ️  Database already initialized, checking schema migration...');
      
      // Check if old schema exists and needs migration
      const oldAuthorColumn = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'sap_capire_bookstore_authors' 
        AND column_name = 'birth_date'
      `);
      
      const oldBookColumn = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'sap_capire_bookstore_books' 
        AND column_name = 'author'
      `);
      
      if (oldAuthorColumn.rows.length > 0 || oldBookColumn.rows.length > 0) {
        console.log('🔄 Migrating old schema to new schema...');
        
        // Drop old tables to recreate with new structure
        await client.query('DROP TABLE IF EXISTS sap_capire_bookstore_books CASCADE');
        await client.query('DROP TABLE IF EXISTS sap_capire_bookstore_authors CASCADE');
        
        console.log('🏗️  Creating new database schema...');
        await createTables();
      } else {
        console.log('✅ Schema is up to date');
      }
    } else {
      console.log('🏗️  Creating database schema...');
      await createTables();
    }

    async function createTables() {
      
      // Create Authors table first (referenced by Books)
      await client.query(`
        CREATE TABLE IF NOT EXISTS sap_capire_bookstore_authors (
          id VARCHAR(36) PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by VARCHAR(255),
          modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          modified_by VARCHAR(255),
          name VARCHAR(255),
          date_of_birth DATE,
          nationality VARCHAR(255),
          biography TEXT
        )
      `);

      // Create Books table
      await client.query(`
        CREATE TABLE IF NOT EXISTS sap_capire_bookstore_books (
          id VARCHAR(36) PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by VARCHAR(255),
          modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          modified_by VARCHAR(255),
          title VARCHAR(255),
          author_id VARCHAR(36),
          genre VARCHAR(255),
          price DECIMAL(10, 2),
          currency_code VARCHAR(3) DEFAULT 'USD',
          stock INTEGER DEFAULT 0,
          description TEXT,
          publisher VARCHAR(255),
          published_at DATE,
          isbn VARCHAR(13),
          FOREIGN KEY (author_id) REFERENCES sap_capire_bookstore_authors(id)
        )
      `);

      // Create Currencies table
      await client.query(`
        CREATE TABLE IF NOT EXISTS sap_common_currencies (
          code VARCHAR(3) PRIMARY KEY,
          symbol VARCHAR(5),
          minor_unit INTEGER,
          name VARCHAR(255),
          descr VARCHAR(255)
        )
      `);

      console.log('✅ Database schema created');
    }

    // Load sample data from CSV files
    console.log('📊 Loading sample data from CSV files...');
    
    // Load currencies from CSV
    const currenciesPath = path.join(__dirname, 'db/data/sap.common-Currencies.csv');
    const currenciesData = parseCSV(currenciesPath);
    
    console.log(`💰 Found ${currenciesData.length} currencies in CSV`);
    for (const currency of currenciesData) {
      await client.query(`
        INSERT INTO sap_common_currencies (code, symbol, minor_unit, name, descr)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (code) DO NOTHING
      `, [currency.code, currency.symbol, parseInt(currency.minorUnit), currency.name, currency.descr]);
    }

    // Load authors from CSV first (due to foreign key constraint)
    const authorsPath = path.join(__dirname, 'db/data/sap.capire.bookstore-Authors.csv');
    const authorsData = parseCSV(authorsPath);
    
    console.log(`✍️  Found ${authorsData.length} authors in CSV`);
    for (const author of authorsData) {
      await client.query(`
        INSERT INTO sap_capire_bookstore_authors 
        (id, name, date_of_birth, nationality, biography, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [
        author.ID, 
        author.name, 
        author.dateOfBirth, 
        author.nationality, 
        author.biography, 
        author.createdBy || 'system'
      ]);
    }

    // Load books from CSV
    const booksPath = path.join(__dirname, 'db/data/sap.capire.bookstore-Books.csv');
    const booksData = parseCSV(booksPath);
    
    console.log(`📚 Found ${booksData.length} books in CSV`);
    for (const book of booksData) {
      await client.query(`
        INSERT INTO sap_capire_bookstore_books 
        (id, title, author_id, genre, price, currency_code, stock, description, publisher, published_at, isbn, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING
      `, [
        book.ID, 
        book.title, 
        book.author_ID, 
        book.genre, 
        parseFloat(book.price), 
        book.currency_code,
        parseInt(book.stock), 
        book.description, 
        book.publisher, 
        book.publishedAt, 
        book.isbn, 
        book.createdBy || 'system'
      ]);
    }

    await client.end();
    
    // Test CDS connection
    console.log('� Testing CDS connection...');
    const db = await cds.connect.to('db');
    const bookCount = await db.run('SELECT COUNT(*) as count FROM sap_capire_bookstore_books');
    console.log(`✅ Database initialization completed! Found ${bookCount[0].count} books.`);
    await db.disconnect();
    
    console.log('🎉 Database ready!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();