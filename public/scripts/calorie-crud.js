// ============================================================================
// INITIALIZATION & SECURITY CHECK
// ============================================================================
const token = localStorage.getItem('token');

// If no token exists, immediately redirect to login.
if (!token) {
    window.location.href = 'auth.html';
}

// Axios Interceptor / Global Default:
// Automatically attach the JWT token to the headers of EVERY request sent by Axios.
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Fetches food data from the backend and triggers a UI update.
 * Includes a Cache-Buster to prevent ghost data on reloads and edits.
 */
async function fetchFoods(searchQuery = '') {
    try {
        // CACHE BUSTER: Generate a unique timestamp for this exact millisecond
        const timestamp = new Date().getTime();
        
        // Build the URL. We attach the timestamp at the end so the browser never caches it.
        const url = searchQuery 
            ? `/api/foods?search=${encodeURIComponent(searchQuery)}&_t=${timestamp}` 
            : `/api/foods?_t=${timestamp}`;
        
        const response = await axios.get(url);
        renderTable(response.data); // Pass the data array to the rendering function
    } catch (err) {
        console.error('Fetch Error:', err);
        // Auto-logout the user if the token has expired
        if(err.response && err.response.status === 401) {
            logout();
        }
    }
}

/**
 * Parses the food array and updates the HTML DOM.
 */
function renderTable(foods) {
    const tbody = document.getElementById('foodTableBody');
    const totalCalsElement = document.getElementById('totalCals');
    let totalCals = 0;
    tbody.innerHTML = ''; 

    foods.forEach(food => {
        totalCals += food.calories; 
        
        const row = `
            <tr>
                <td class="fw-bold">${food.name}</td>
                <td><span class="badge bg-secondary">${food.calories} kcal</span></td>
                <td>${food.category}</td>
                <td>${new Date(food.date).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" 
                        onclick="openEditModal('${food._id}', '${food.name}', ${food.calories}, '${food.category}')">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteFood('${food._id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    document.getElementById('totalCals').innerText = totalCals.toLocaleString();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Form submission for adding a new food entry
document.getElementById('foodForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
        name: document.getElementById('foodName').value,
        calories: Number(document.getElementById('calories').value),
        category: document.getElementById('category').value
    };

    try {
        await axios.post('/api/foods', payload);
        document.getElementById('foodForm').reset();
        fetchFoods(); 
    } catch (err) {
        alert('Failed to add entry. Please check your inputs.');
    }
});

// Live search listener
document.getElementById('searchInput').addEventListener('input', (e) => {
    fetchFoods(e.target.value);
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function deleteFood(id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
        await axios.delete(`/api/foods/${id}`);
        fetchFoods(); 
    } catch (err) {
        console.error('Delete Error:', err);
        alert('Failed to delete entry.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'auth.html';
}

// ============================================================================
// EDIT MODAL LOGIC
// ============================================================================

let editModal;
document.addEventListener("DOMContentLoaded", () => {
    editModal = new bootstrap.Modal(document.getElementById('editModal'));
});

function openEditModal(id, name, calories, category) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editCalories').value = calories;
    document.getElementById('editCategory').value = category;
    editModal.show();
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const payload = {
        name: document.getElementById('editName').value,
        calories: Number(document.getElementById('editCalories').value),
        category: document.getElementById('editCategory').value
    };

    try {
        await axios.put(`/api/foods/${id}`, payload);
        editModal.hide(); 
        fetchFoods();     
    } catch (err) {
        alert('Failed to update entry.');
    }
});

// ============================================================================
// KICKSTART
// ============================================================================
fetchFoods();