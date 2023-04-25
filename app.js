//Book Class
class Book {
    constructor(title, author, format, location, isbn) {
        this.title = title;
        this.author = author;
        this.format = format;
        this.location = location;
        this.isbn = isbn;
    }
}

//UI Class
class UI {
    static printBooks() {
        const books = Store.getBooks();
    
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.format}</td>
            <td>${book.location}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
    
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
      }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#format').value = '';
        document.querySelector('#location').value = '';
        document.querySelector('#isbn').value = '';
    }

}

//Local storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Display Books
document.addEventListener('DOMContentLoaded', UI.printBooks);

//Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const format = document.querySelector('#format').value;
    const location = document.querySelector('#location').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || format === '' || location === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instatiate book
        const book = new Book(title, author, format, location, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success');

        // Clear fields
        UI.clearFields();
    }

});

//Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)

    Store.removeBook(e.target.parentElement.previousElementSibling.text);

    // Show removal message
    UI.showAlert('Book Removed', 'success');
});

//Book Class: Represents a Book