// ============================================================================
// DOM ELEMENTS & UI TOGGLING
// ============================================================================
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const messageBox = document.getElementById('messageBox');

// Switch to Register View
showRegisterBtn.addEventListener('click', () => {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    showRegisterBtn.classList.replace('btn-outline-primary', 'btn-primary');
    showLoginBtn.classList.replace('btn-primary', 'btn-outline-primary');
    messageBox.textContent = ''; // Clear messages
});

// Switch to Login View
showLoginBtn.addEventListener('click', () => {
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
    showLoginBtn.classList.replace('btn-outline-primary', 'btn-primary');
    showRegisterBtn.classList.replace('btn-primary', 'btn-outline-primary');
    messageBox.textContent = ''; // Clear messages
});

// ============================================================================
// LOGIN LOGIC
// ============================================================================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await axios.post('/api/auth/login', { email, password });
        handleSuccessfulAuth(response.data);
    } catch (error) {
        showError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    }
});

// ============================================================================
// REGISTER LOGIC
// ============================================================================
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    try {
        // 1. Create the user
        await axios.post('/api/auth/register', { email, password, role });
        
        showSuccess('Registration successful! Logging you in...');

        // 2. Automatically log them in right after successful registration
        const loginResponse = await axios.post('/api/auth/login', { email, password });
        
        // Slight delay so the user can read the success message
        setTimeout(() => {
            handleSuccessfulAuth(loginResponse.data);
        }, 1000);

    } catch (error) {
        // Handle unique email constraint error from MongoDB
        if (error.response?.data?.error?.includes('duplicate key')) {
            showError('This email is already registered. Please log in.');
        } else {
            showError(error.response?.data?.error || 'Registration failed.');
        }
    }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function handleSuccessfulAuth(data) {
    // Store JWT securely
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    // Redirect based on role
    if (data.role === 'admin') {
        window.location.href = 'protected-demo.html'; // Admin Dashboard
    } else {
        window.location.href = 'calorie-crud.html'; // User Dashboard
    }
}

function showError(msg) {
    messageBox.className = 'text-center mt-3 fw-bold text-danger';
    messageBox.textContent = msg;
}

function showSuccess(msg) {
    messageBox.className = 'text-center mt-3 fw-bold text-success';
    messageBox.textContent = msg;
}