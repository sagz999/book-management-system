const BASE_URL = "http://localhost:3000"; // Replace with your actual backend URL

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  showLoginForm();
});

function showLoginForm() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    currentUser = user
    showLandingPage();
  } else {
    document.getElementById("loginSignupPage").style.display = "block";
    document.getElementById("landingPage").style.display = "none";
  }
}

function showLandingPage() {
  document.getElementById("loginSignupPage").style.display = "none";
  document.getElementById("landingPage").style.display = "block";
  document.getElementById("usernameSpan").textContent = currentUser;
  displayBookList();
}

function unpublishBook(bookId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to publish your books.");
    return;
  }

  fetch(`${BASE_URL}/api/books/unpublish/${bookId}`, {
    method: "PUT",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayMyBooks();
    })
    .catch((error) => {
      console.error("error", error);
      alert("Error while unpublishing book");
    });
}

function displayBookList() {
  document.getElementById("PublishError").textContent = "";
  hidePublishForm();

  const bookListContainer = document.getElementById("bookList");
  bookListContainer.innerHTML = "<h2>All Books</h2>";

  if (currentUser) {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/books/published`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.results?.length) {
          data?.results?.forEach((book) => {
            const bookItem = document.createElement("div");
            bookItem.className =
              "d-flex justify-content-between align-items-center mb-2";
            bookItem.innerHTML = `<span>${book.title}  by ${book.author}</span>`;
            bookListContainer.appendChild(bookItem);
          });
        } else {
          bookListContainer.innerHTML = "<p>No books found!</p>";
        }
      })
      .catch((error) => {
        console.log("error==>", JSON.stringify(error));

        //   console.error('Error during login:', error);
        //   alert(`${error}`);
      });
  } else {
    bookListContainer.innerHTML = "<p>Please log in to see the book list.</p>";
  }
}

function togglePublishForm() {
  const publishForm = document.getElementById("publishBookForm");
  if (publishForm.style.display === "none") {
    publishForm.style.display = "block";
  } else {
    publishForm.style.display = "none";
  }
}

function hidePublishForm() {
  const publishForm = document.getElementById("publishBookForm");
  publishForm.style.display = "none";
}

function publishBook() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to see your books.");
    return;
  }

  const bookTitle = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  // Dummy logic to add a new book to the list
  if (bookTitle && author) {
    const newBook = { title: bookTitle, author };

    fetch(`${BASE_URL}/api/books/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(newBook),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("PublishError").textContent = "";

        hidePublishForm();
        displayBookList();
      })
      .catch((error) => {
        console.log("error==>", JSON.stringify(error));
        //   console.error('Error during signup:', error);
        //   alert(`${error}`);
      });
    displayBookList();
  } else {
    document.getElementById("PublishError").textContent =
      "Title and author must constain atleast 1 character";
  }
}

function displayMyBooks() {
  hidePublishForm();

  const bookListContainer = document.getElementById("bookList");
  bookListContainer.innerHTML = "<h2>My Books</h2>";

  if (currentUser) {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/books/user`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.results?.length) {
          data?.results?.forEach((book) => {
            const bookItem = document.createElement("div");
            bookItem.className =
              "d-flex justify-content-between align-items-center mb-2";
            bookItem.innerHTML = `
              <span>${book.title}  by ${book.author}</span>
              <div>
                <button class="btn btn-danger btn-sm" onclick="unpublishBook('${book._id.toString()}')">Unpublish</button>
              </div>`;

            bookListContainer.appendChild(bookItem);
          });
        } else {
          bookListContainer.innerHTML =
            "<p>You have not published any books yet.</p>";
        }
      })
      .catch((error) => {
        console.log("error==>", JSON.stringify(error));

        //   console.error('Error during login:', error);
        //   alert(`${error}`);
      });
  } else {
    bookListContainer.innerHTML = "<p>Please log in to see your books.</p>";
  }
}

function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.results?.[0]?.token) {
        localStorage.setItem("token", data.results[0].token);
        localStorage.setItem("user",username);
        currentUser = username;
        showLandingPage();
      }

      if (data?.errors?.length) {
        data?.errors?.forEach((err) => {
          alert(`${err.instancePath ?? ""}:${err.message}`);
        });
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert("Error during login");
    });
}

function signup() {
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.results[0]?.token) {
        localStorage.setItem("token", data.results[0].token);
        currentUser = username;
        showLandingPage();
      } else {
        alert("Invalid username or password");
      }
    })
    .catch((error) => {
      //   console.error('Error during signup:', error);
      alert("Invalid Credentials");
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  currentUser = null;
  showLoginForm();
}

function searchBooks() {
  hidePublishForm();

  const searchKey = document.getElementById("search-box").value;
  const bookListContainer = document.getElementById("bookList");
  bookListContainer.innerHTML = "<h2>Search result</h2>";
  const token = localStorage.getItem("token");

  if (currentUser) {
    fetch(`${BASE_URL}/api/books/search?title=${searchKey}`, {
      method: "GET",
      headers: { Authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data?.results?.length) {
          data?.results?.forEach((book) => {
            const bookItem = document.createElement("div");
            bookItem.className =
              "d-flex justify-content-between align-items-center mb-2";
            bookItem.innerHTML = `<span>${book.title}  by ${book.author}</span>`;
            bookListContainer.appendChild(bookItem);
          });
        } else {
          bookListContainer.innerHTML = "<p>No books found!</p>";
        }
      })
      .catch((error) => {
        bookListContainer.innerHTML = "<p>No books found!</p>";
        console.error("Error during search:", error);
        // alert("Error during search");
      });
  } else {
    bookListContainer.innerHTML = "<p>Please log in to see your books.</p>";
  }
  // }else{
  //   clearSearchResult()
  // }
}
