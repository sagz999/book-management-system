const appContainer = document.getElementById('app');

async function renderPublishForm() {
    const publishForm = document.createElement('div');
    publishForm.classList.add('col-md-6', 'mx-auto');

    publishForm.innerHTML = `
        <h2 class="text-center mb-4">Publish a New Book</h2>
        <form id="publishForm">
            <div class="mb-3">
                <label for="title" class="form-label">Title:</label>
                <input type="text" id="title" name="title" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="author" class="form-label">Author:</label>
                <input type="text" id="author" name="author" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Publish</button>
        </form>
        <p id="publishError" class="text-danger mt-3"></p>
    `;

    publishForm.querySelector('#publishForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;

        // Input Validation
        if (!title || !author) {
            document.getElementById('publishError').textContent = 'Please enter both title and author.';
            return;
        }

        try {
            const token = getToken(); // Replace with your actual function to get the authentication token
            await apiService.publishBook(title, author, token);
            renderPublishedBooks(); // Update the published book list after publishing
        } catch (error) {
            document.getElementById('publishError').textContent = 'Error publishing the book. Please try again.';
        }
    });

    appContainer.innerHTML = '';
    appContainer.appendChild(publishForm);
}

async function renderSearchForm() {
    const searchForm = document.createElement('div');
    searchForm.classList.add('col-md-6', 'mx-auto');

    searchForm.innerHTML = `
        <h2 class="text-center mb-4">Search Books</h2>
        <form id="searchForm">
            <div class="mb-3">
                <label for="searchQuery" class="form-label">Title:</label>
                <input type="text" id="searchQuery" name="searchQuery" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Search</button>
        </form>
        <p id="searchError" class="text-danger mt-3"></p>
    `;

    searchForm.querySelector('#searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchQuery = document.getElementById('searchQuery').value;

        // Input Validation
        if (!searchQuery) {
            document.getElementById('searchError').textContent = 'Please enter a search query.';
            return;
        }

        try {
            const searchResults = await apiService.searchBooks(searchQuery);
            renderSearchResults(searchResults); // Display search results
        } catch (error) {
            document.getElementById('searchError').textContent = 'Error searching for books. Please try again.';
        }
    });

    appContainer.innerHTML = '';
    appContainer.appendChild(searchForm);
}

async function renderSearchResults(books) {
    const searchResults = document.createElement('div');
    searchResults.classList.add('col-md-6', 'mx-auto');

    searchResults.innerHTML = '<h2 class="text-center mb-4">Search Results</h2>';

    if (books.length === 0) {
        searchResults.innerHTML += '<p class="text-center">No results found.</p>';
    } else {
        books.forEach((book) => {
            searchResults.innerHTML += `<p class="text-center">${book.title} by ${book.author}</p>`;
        });
    }

    appContainer.innerHTML = '';
    appContainer.appendChild(searchResults);
}

async function renderUserBooks() {
    try {
        const token = getToken(); // Replace with your actual function to get the authentication token
        const userBooks = await apiService.getUserBooks(token);
        const userBookList = document.createElement('div');
        userBookList.classList.add('col-md-6', 'mx-auto');

        userBookList.innerHTML = '<h2 class="text-center mb-4">Your Published Books</h2>';

        if (userBooks.length === 0) {
            userBookList.innerHTML += '<p class="text-center">No books published by you.</p>';
        } else {
            userBooks.forEach((book) => {
                userBookList.innerHTML += `
                    <p class="text-center">${book.title} by ${book.author} 
                        <button class="btn btn-danger" onclick="unpublishBook('${book._id}')">Unpublish</button>
                    </p>`;
            });
        }

        appContainer.innerHTML = '';
        appContainer.appendChild(userBookList);
    } catch (error) {
        console.error('Error fetching user-specific books:', error);
        // Handle error, display a message to the user, etc.
    }
}

async function unpublishBook(bookId) {
    try {
        const token = getToken(); // Replace with your actual function to get the authentication token
        await apiService.unpublishBook(bookId, token);
        renderUserBooks(); // Update the user-specific book list after unpublishing
    } catch (error) {
        console.error('Error unpublishing the book:', error);
        // Handle error, display a message to the user, etc.
    }
}

// async function renderPublishedBooks() {
//     try {
//         const publishedBooks = await apiService.getPublishedBooks();
//         const bookList = document.createElement('div');
//         bookList.classList.add('col-md-6', 'mx-auto');

//         bookList.innerHTML = '<h2 class="text-center mb-4">All Published Books</h2>';

//         if (publishedBooks.length === 0) {
//             bookList.innerHTML += '<p class="text-center">No books available.</p>';
//         } else {
//             publishedBooks.forEach((book) => {
//                 bookList.innerHTML += `<p class="text-center">${book.title} by ${book.author}</p>`;
//             });
//         }

//         appContainer.innerHTML = '';
//         appContainer.appendChild(bookList);
//     } catch (error) {
//         console.error('Error fetching published books:', error);
//         // Handle error, display a message to the user, etc.
//     }
// }

let currentPage = 1; // Initial page
const booksPerPage = 5; // Number of books to display per page

async function renderPublishedBooks() {
    try {
        const totalBooks = await apiService.getPublishedBooksCount();
        const totalPages = Math.ceil(totalBooks / booksPerPage);

        const publishedBooks = await apiService.getPublishedBooks(currentPage, booksPerPage);
        const bookList = document.createElement('div');
        bookList.classList.add('col-md-8', 'mx-auto');

        bookList.innerHTML = '<h2 class="text-center mb-4">All Published Books</h2>';

        if (publishedBooks.length === 0) {
            bookList.innerHTML += '<p class="text-center">No books available.</p>';
        } else {
            publishedBooks.forEach((book) => {
                bookList.innerHTML += `<p class="text-center">${book.title} by ${book.author}</p>`;
            });
        }

        // Pagination controls
        bookList.innerHTML += `
            <nav aria-label="Book Pagination" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changePage(${currentPage - 1})" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>`;

        for (let page = 1; page <= totalPages; page++) {
            bookList.innerHTML += `
                <li class="page-item ${page === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${page})">${page}</a>
                </li>`;
        }

        bookList.innerHTML += `
                    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changePage(${currentPage + 1})" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>`;

        appContainer.innerHTML = '';
        appContainer.appendChild(bookList);
    } catch (error) {
        console.error('Error fetching published books:', error);
        // Handle error, display a message to the user, etc.
    }
}

function changePage(newPage) {
    currentPage = newPage;
    renderPublishedBooks();
}

// Initial rendering of published books
// renderPublishedBooks();

// Initial rendering of published and user-specific books
renderPublishedBooks();
renderUserBooks();
