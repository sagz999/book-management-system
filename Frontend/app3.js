const BASE_URL = "http://localhost:3000"; // Replace with your actual backend URL

// Dummy book data (replace with actual fetch from the server)
let books = [];

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
  // clearSearchResult()
}

function displayBookList() {
  // clearSearchResult()
  const bookListContainer = document.getElementById("allBook-tab-pane");
  bookListContainer.innerHTML = "<h4>Book List</h4>";

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
            bookItem.textContent = book.title;
            bookListContainer.appendChild(bookItem);
          });
        } else {
          bookListContainer.innerHTML = "<p>No books found!</p>";
        }
      })
      .catch((error) => {
        console.error("error", error);
        alert("Error while fetching all books");
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
    alert("Please log in to publish your books.");
    return;
  }

  const bookTitle = document.getElementById("bookTitle").value;
  if (bookTitle) {
    // Dummy logic to add a new book to the list
    const newBook = { title: bookTitle };

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
        togglePublishForm();
      })
      .catch((error) => {
        console.log("error==>", JSON.stringify(error));
        //   console.error('Error during signup:', error);
        //   alert(`${error}`);
      });

    // books.push(newBook);
    displayBookList();
  } else {
    alert("Please enter a title for the book.");
  }
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
      console.log(data);
      displayMyBooks();
    })
    .catch((error) => {
      console.error("error", error);
      alert("Error while unpublishing book");
    });
}

function displayMyBooks() {
  // clearSearchResult()
  const bookListContainer = document.getElementById("userBook-tab-pane");
  bookListContainer.innerHTML = "<h4>My Books</h4>";

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
              <span>${book.title}</span>
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
        console.error("error", error);
        alert("Error while fetching user books");
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
      console.log("response", JSON.stringify(data));

      if (data?.results?.[0]?.token) {
        localStorage.setItem("token", data.results[0].token);
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

  fetch(`${BASE_URL}/api/books/user`, {
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

function search() {

  document.getElementById("search-Result").style.display = "block";
  // document.getElementById("loginSignupPage").style.display = "none";

  // document.getElementById("search-Result").style.display = "none";

  const bookListContainer = document.getElementById("search-Result");
  bookListContainer.innerHTML = "<h4>result</h4>";


  const searchKey = document.getElementById("Search-box").value;
  // alert(`${searchKey}`)

  // if (searchKey) {
    if (currentUser) {
      fetch(`${BASE_URL}/api/books/search?title=${searchKey}`, {
        method: "GET",
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("books",data?.results);
          if(data?.results?.length){
  
            data?.results?.forEach((book) => {
              const bookItem = document.createElement("div");
              bookItem.textContent = book.title;
              bookListContainer.appendChild(bookItem);
            });

          }else{
            bookListContainer.innerHTML = "<p>No books found!</p>";
          }
        })
        .catch((error) => {
          console.error("Error during search:", error);
          alert("Error during search");
        });
    } else {
      bookListContainer.innerHTML = "<p>Please log in to see your books.</p>";
    }
  // }else{
  //   clearSearchResult()
  // }
}

// function clearSearchResult(){

//   document.getElementById("searchResult").style.display = "none";

// }
