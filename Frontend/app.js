const BASE_URL = "http://localhost:3000"; // Replace with your actual backend URL


// Dummy book data (replace with actual fetch from the server)
let books = [
  { title: "Book 1", userId: "user" },
  { title: "Book 2", userId: "user" },
  { title: "Book 3", userId: "otherUser" },
  // Add more books as needed
];

// Dummy user data (replace with actual user authentication logic)
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  showLoginForm();
});

function showLoginForm() {
  document.getElementById("loginSignupPage").style.display = "block";
  document.getElementById("landingPage").style.display = "none";
}

function showLandingPage() {
  document.getElementById("loginSignupPage").style.display = "none";
  document.getElementById("landingPage").style.display = "block";
  document.getElementById("usernameSpan").textContent = currentUser;
  displayBookList();
}

function displayBookList() {
  const bookListContainer = document.getElementById("bookList");
  bookListContainer.innerHTML = "<h2>Book List</h2>";

  if (currentUser) {
    books.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.textContent = book.title;
      bookListContainer.appendChild(bookItem);
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

function publishBook() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to see your books.");
    return;
  }

  const bookTitle = document.getElementById("bookTitle").value;
  if (bookTitle) {
    // Dummy logic to add a new book to the list
    const newBook = { title: bookTitle, user: currentUser };

    fetch(`${BASE_URL}/private/api/books/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(newBook),
    })
      .then((response) => response.json())
      .then((data) => {
        togglePublishForm();
      })
      .catch((error) => {
        console.log("error==>", JSON.stringify(error));
        //   console.error('Error during signup:', error);
        //   alert(`${error}`);
      });

    books.push(newBook);
    displayBookList();
  } else {
    alert("Please enter a title for the book.");
  }
}

function displayMyBooks() {
  const myBooks = books.filter((book) => book.userId === currentUser);
  const bookListContainer = document.getElementById("bookList");
  bookListContainer.innerHTML = "<h2>My Books</h2>";

  if (currentUser) {
    if (myBooks.length > 0) {
      myBooks.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.textContent = book.title;
        bookListContainer.appendChild(bookItem);
      });
    } else {
      bookListContainer.innerHTML =
        "<p>You have not published any books yet.</p>";
    }
  } else {
    bookListContainer.innerHTML = "<p>Please log in to see your books.</p>";
  }
}


function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  fetch(`${BASE_URL}/public/api/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("response", JSON.stringify(data));
      if (data?.results[0]?.token) {
        localStorage.setItem("token", data.results[0].token);
        currentUser = username;
        showLandingPage();
      } else {
        alert("Invalid username or password");
      }
      // console.error(data);
      // alert(`${data}`);
    })
    .catch((error) => {
      console.log("error==>", JSON.stringify(error));

      //   console.error('Error during login:', error);
      //   alert(`${error}`);
    });
}

function signup() {
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  fetch(`${BASE_URL}/public/api/auth/signup`, {
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
      console.log("error==>", JSON.stringify(error));
      //   console.error('Error during signup:', error);
      //   alert(`${error}`);
    });
}

function logout() {
  localStorage.removeItem("token");
  currentUser = null;
  showLoginForm();
}

function fetchMyBooks() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to see your books.");
    return;
  }

  fetch(`${BASE_URL}/private/api/books/user`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the fetched data (list of user's books) as needed
      console.log("My Books:", data);
    })
    .catch((error) => {
      console.error("Error fetching user books:", error);
      alert("Error fetching user books. Please try again.");
    });
}
