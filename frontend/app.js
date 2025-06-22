// Configuration
const API_BASE_URL = "http://localhost:3001/api";

// DOM Elements
const checkStatusBtn = document.getElementById("checkStatus");
const statusResult = document.getElementById("statusResult");
const loadUsersBtn = document.getElementById("loadUsers");
const usersResult = document.getElementById("usersResult");
const addUserBtn = document.getElementById("addUser");
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const backendStatus = document.getElementById("backendStatus");

// Utility Functions
function showLoading(element) {
  element.innerHTML = '<div class="loading">Loading...</div>';
}

function showResult(element, content, isSuccess = true) {
  element.className = `result ${isSuccess ? "success" : "error"}`;
  element.innerHTML = content;
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

// API Functions
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Event Handlers
async function checkBackendStatus() {
  showLoading(statusResult);

  try {
    const data = await fetchAPI("/health");
    const content = `
            <h4>✅ Backend is healthy!</h4>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Timestamp:</strong> ${formatTimestamp(
              data.timestamp
            )}</p>
        `;
    showResult(statusResult, content, true);
    backendStatus.textContent = "Connected";
    backendStatus.style.color = "#27ae60";
  } catch (error) {
    const content = `
            <h4>❌ Backend connection failed</h4>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Make sure the backend container is running on port 3001</p>
        `;
    showResult(statusResult, content, false);
    backendStatus.textContent = "Disconnected";
    backendStatus.style.color = "#e74c3c";
  }
}

async function loadUsers() {
  showLoading(usersResult);

  try {
    const data = await fetchAPI("/users");

    if (data.users && data.users.length > 0) {
      const userCards = data.users
        .map(
          (user) => `
                <div class="user-card">
                    <h4>${user.name}</h4>
                    <p>Email: ${user.email}</p>
                    <p>ID: ${user.id}</p>
                </div>
            `
        )
        .join("");

      const content = `
                <h4>👥 Users loaded successfully (${data.count} total)</h4>
                ${userCards}
            `;
      showResult(usersResult, content, true);
    } else {
      showResult(usersResult, "<h4>No users found</h4>", true);
    }
  } catch (error) {
    const content = `
            <h4>❌ Failed to load users</h4>
            <p><strong>Error:</strong> ${error.message}</p>
        `;
    showResult(usersResult, content, false);
  }
}

async function addUser() {
  const name = userNameInput.value.trim();
  const email = userEmailInput.value.trim();

  if (!name || !email) {
    showResult(
      usersResult,
      "<h4>⚠️ Please fill in both name and email</h4>",
      false
    );
    return;
  }

  showLoading(usersResult);

  try {
    const newUser = await fetchAPI("/users", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    });

    const content = `
            <h4>✅ User added successfully!</h4>
            <div class="user-card">
                <h4>${newUser.name}</h4>
                <p>Email: ${newUser.email}</p>
                <p>ID: ${newUser.id}</p>
            </div>
        `;
    showResult(usersResult, content, true);

    // Clear form
    userNameInput.value = "";
    userEmailInput.value = "";
  } catch (error) {
    const content = `
            <h4>❌ Failed to add user</h4>
            <p><strong>Error:</strong> ${error.message}</p>
        `;
    showResult(usersResult, content, false);
  }
}

// Event Listeners
checkStatusBtn.addEventListener("click", checkBackendStatus);
loadUsersBtn.addEventListener("click", loadUsers);
addUserBtn.addEventListener("click", addUser);

// Allow Enter key to submit form
userEmailInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addUser();
  }
});

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Frontend application loaded successfully!");

  // Auto-check backend status on load
  setTimeout(checkBackendStatus, 1000);
});
