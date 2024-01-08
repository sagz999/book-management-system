const appContainer = document.getElementById('app');

function renderLoginForm() {
    const loginForm = document.createElement('div');
    loginForm.classList.add('col-md-6', 'mx-auto');

    loginForm.innerHTML = `
        <h2 class="text-center mb-4">Login</h2>
        <form id="loginForm">
            <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" id="username" name="username" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p class="mt-3">Don't have an account? <a href="#" onclick="renderSignupForm()">Sign up</a></p>
        <p id="loginError" class="text-danger"></p>
    `;

    loginForm.querySelector('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Input Validation
        if (!username || !password) {
            document.getElementById('loginError').textContent = 'Please enter both username and password.';
            return;
        }

        try {
            await apiService.login(username, password);
            // If successful, render other components (e.g., book management)
        } catch (error) {
            document.getElementById('loginError').textContent = 'Invalid username or password. Please try again.';
        }
    });

    appContainer.innerHTML = '';
    appContainer.appendChild(loginForm);
}

function renderSignupForm() {
    const signupForm = document.createElement('div');
    signupForm.classList.add('col-md-6', 'mx-auto');

    signupForm.innerHTML = `
        <h2 class="text-center mb-4">Sign up</h2>
        <form id="signupForm">
            <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" id="username" name="username" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Sign up</button>
        </form>
        <p class="mt-3">Already have an account? <a href="#" onclick="renderLoginForm()">Login</a></p>
        <p id="signupError" class="text-danger"></p>
    `;

    signupForm.querySelector('#signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Input Validation
        if (!username || !password) {
            document.getElementById('signupError').textContent = 'Please enter both username and password.';
            return;
        }

        try {
            await apiService.signup(username, password);
            // If successful, render other components (e.g., book management)
        } catch (error) {
            document.getElementById('signupError').textContent = 'Error signing up. Please try again.';
        }
    });

    appContainer.innerHTML = '';
    appContainer.appendChild(signupForm);
}

// Initial rendering of the login form
renderLoginForm();
