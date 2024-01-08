const BASE_URL = 'http://localhost:3000'


const apiService = {
    login: async (username, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            console.log("loginApiResult==>",data);

            if (!response.ok) throw new Error(data.message || 'Login failed');

            return data.token; // Assuming the server returns a token

        } catch (error) {
            console.error('Login error:', error.message);
            throw error;
        }
    },

    signup: async (username, password) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Signup failed');
            }

            const data = await response.json();
            return data.token; // Assuming the server returns a token
        } catch (error) {
            console.error('Signup error:', error.message);
            throw error;
        }
    },

    publishBook: async (title, author, token) => {
        try {
            const response = await fetch('/api/books/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, author }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Publishing book failed');
            }

            // Handle successful publishing if needed
        } catch (error) {
            console.error('Publish book error:', error.message);
            throw error;
        }
    },

    searchBooks: async (searchQuery) => {
        try {
            const response = await fetch(`/api/books/search?title=${searchQuery}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Search failed');
            }

            const data = await response.json();
            return data.results; // Assuming the server returns search results
        } catch (error) {
            console.error('Search books error:', error.message);
            throw error;
        }
    },

    unpublishBook: async (bookId, token) => {
        try {
            const response = await fetch(`/api/books/unpublish/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Unpublishing book failed');
            }

            // Handle successful unpublishing if needed
        } catch (error) {
            console.error('Unpublish book error:', error.message);
            throw error;
        }
    },

    getUserBooks: async (token) => {
        try {
            const response = await fetch('/api/books/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Fetching user books failed');
            }

            const data = await response.json();
            return data.books; // Assuming the server returns user-specific books
        } catch (error) {
            console.error('Get user books error:', error.message);
            throw error;
        }
    },

    getPublishedBooks: async () => {
        try {
            const response = await fetch('/api/books/published');

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Fetching published books failed');
            }

            const data = await response.json();
            return data.books; // Assuming the server returns all published books
        } catch (error) {
            console.error('Get published books error:', error.message);
            throw error;
        }
    },

    // Additional API functions as needed...
};

// Example usage of the API service
// apiService.login('user123', 'password123')
//     .then((token) => {
//         console.log('Login successful. Token:', token);
//     })
//     .catch((error) => {
//         console.error('Login failed:', error.message);
//     });
