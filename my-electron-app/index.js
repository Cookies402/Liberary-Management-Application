const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dimpu92126!!',
    database: 'lma_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Create a table if it doesn't exist (if needed)
function createTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS book_list (
            A_no INT AUTO_INCREMENT PRIMARY KEY,
            Author VARCHAR(255) NOT NULL,
            Title VARCHAR(255) NOT NULL,
            No_of_pages INT,
            Publisher VARCHAR(255),
            Date_of_purchase DATE,
            Cost DECIMAL(10, 2)
        );
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table created or already exists.');
    });
}

app.whenReady().then(() => {
    createTable();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    win.loadFile('index.html');
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC handler to add a new book
ipcMain.handle('add-book', async (event, book) => {
  return new Promise((resolve, reject) => {
      const query = 'INSERT INTO book_list (A_no, Author, Title, No_of_pages, Publisher, Date_of_purchase, Cost) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [book.aNo, book.author, book.title, book.pages, book.publisher, book.purchaseDate, book.cost];

      connection.query(query, values, (err, results) => {
          if (err) {
              console.error('Error adding book:', err);
              reject('Failed to add book.');
          } else {
              console.log('Book added successfully:', results);
              resolve('Book added successfully.');
          }
      });
  });
});

// IPC handler to load a book
ipcMain.handle('load-book', async (event, aNo) => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM book_list WHERE A_no = ?';
      connection.query(query, [aNo], (err, results) => {
          if (err) {
              console.error('Error loading book:', err);
              reject('Failed to load book.');
          } else {
              resolve(results[0]);
          }
      });
  });
});

// IPC handler to edit a book
ipcMain.handle('edit-book', async (event, book) => {
  return new Promise((resolve, reject) => {
      const query = 'UPDATE book_list SET Author = ?, Title = ?, No_of_pages = ?, Publisher = ?, Date_of_purchase = ?, Cost = ? WHERE A_no = ?';
      const values = [book.author, book.title, book.pages, book.publisher, book.purchaseDate, book.cost, book.aNo];

      connection.query(query, values, (err, results) => {
          if (err) {
              console.error('Error editing book:', err);
              reject('Failed to edit book.');
          } else {
              resolve('Book edited successfully.');
          }
      });
  });
});

// IPC handler to fetch books with optional search query
ipcMain.handle('fetch-books', async (event, query) => {
  return new Promise((resolve, reject) => {
      let sqlQuery = 'SELECT * FROM book_list';
      if (query) {
          sqlQuery += ` WHERE A_no LIKE ? OR Author LIKE ? OR Title LIKE ? OR Date_of_purchase LIKE ? OR Cost LIKE ?`;
          query = `%${query}%`;
      }
      connection.query(sqlQuery, [query, query, query, query, query], (err, results) => {
          if (err) {
              console.error('Error fetching books:', err);
              reject(err);
          } else {
              resolve(results);
          }
      });
  });
});

// IPC handler to delete a book
ipcMain.handle('delete-book', async (event, bookId) => {
  return new Promise((resolve, reject) => {
      const query = 'DELETE FROM book_list WHERE A_no = ?';
      connection.query(query, [bookId], (err, results) => {
          if (err) {
              console.error('Error deleting book:', err);
              reject('Failed to delete book.');
          } else {
              resolve('Book deleted successfully.');
          }
      });
  });
});
