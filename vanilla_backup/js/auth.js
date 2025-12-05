// ============================================
// AUTHENTICATION - e-store
// ============================================

// ============================================
// User Management
// ============================================

const Auth = {
  // Get current user
  getCurrentUser() {
    return Storage.get(CONFIG.STORAGE_KEYS.USER);
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  // Login user
  async login(email, password) {
    try {
      const users = await fetchUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Remove password before storing
        const { password: _, ...userWithoutPassword } = user;
        Storage.set(CONFIG.STORAGE_KEYS.USER, userWithoutPassword);

        showToast('success', 'Welcome Back!', `Logged in as ${user.name}`);
        updateUIForUser();
        return { success: true, user: userWithoutPassword };
      } else {
        showToast('error', 'Login Failed', 'Invalid email or password');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('error', 'Login Failed', 'An error occurred. Please try again.');
      return { success: false, error: error.message };
    }
  },

  // Register new user
  async register(userData) {
    try {
      // In a real app, this would make an API call
      // For demo, we'll just store in localStorage
      const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
        role: 'student',
        vcBalance: CONFIG.DEFAULTS.INITIAL_VC_BALANCE,
        joinDate: new Date().toISOString()
      };

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = newUser;
      Storage.set(CONFIG.STORAGE_KEYS.USER, userWithoutPassword);

      showToast('success', 'Welcome!', `Account created successfully. You've received ${CONFIG.DEFAULTS.INITIAL_VC_BALANCE} VC points!`);
      updateUIForUser();
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Registration error:', error);
      showToast('error', 'Registration Failed', 'An error occurred. Please try again.');
      return { success: false, error: error.message };
    }
  },

  // Logout user
  logout() {
    Storage.remove(CONFIG.STORAGE_KEYS.USER);
    showToast('info', 'Logged Out', 'You have been logged out successfully.');
    updateUIForUser();

    // Redirect to home if on protected page
    const protectedPages = ['dashboard.html', 'admin.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  },

  // Update user data
  updateUser(updates) {
    const user = this.getCurrentUser();
    if (user) {
      const updatedUser = { ...user, ...updates };
      Storage.set(CONFIG.STORAGE_KEYS.USER, updatedUser);
      updateUIForUser();
      return updatedUser;
    }
    return null;
  },

  // Add VC points
  addVCPoints(amount) {
    const user = this.getCurrentUser();
    if (user) {
      user.vcBalance = (user.vcBalance || 0) + amount;
      Storage.set(CONFIG.STORAGE_KEYS.USER, user);
      updateVCBalance();
      return user.vcBalance;
    }
    return 0;
  },

  // Deduct VC points
  deductVCPoints(amount) {
    const user = this.getCurrentUser();
    if (user && user.vcBalance >= amount) {
      user.vcBalance -= amount;
      Storage.set(CONFIG.STORAGE_KEYS.USER, user);
      updateVCBalance();
      return user.vcBalance;
    }
    return null;
  }
};

// ============================================
// UI Updates for Authentication
// ============================================

function updateUIForUser() {
  const user = Auth.getCurrentUser();
  const userBtn = document.getElementById('userBtn');
  const userLabel = document.getElementById('userLabel');

  if (userBtn) {
    if (user) {
      userBtn.onclick = () => {
        showUserMenu();
      };
      if (userLabel) {
        userLabel.textContent = user.name.split(' ')[0];
      }
    } else {
      userBtn.onclick = () => {
        window.location.href = 'login.html';
      };
      if (userLabel) {
        userLabel.textContent = 'Login';
      }
    }
  }

  updateVCBalance();
}

// ============================================
// User Menu
// ============================================

function showUserMenu() {
  const user = Auth.getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">My Account</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div style="text-align: center; margin-bottom: var(--space-6);">
          <div style="width: 80px; height: 80px; margin: 0 auto var(--space-4); background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dark) 100%); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: var(--text-3xl); color: var(--primary-navy);">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <h4 style="margin-bottom: var(--space-2);">${user.name}</h4>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-2);">${user.email}</p>
          <div class="badge badge-primary">${user.role}</div>
        </div>
        
        <div style="background-color: var(--bg-secondary); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-secondary);">VC Balance</span>
            <span style="font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--accent-gold);">
              ${user.vcBalance.toLocaleString('en-IN')} VC
            </span>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <button class="btn btn-outline" onclick="window.location.href='dashboard.html'">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
          </button>
          
          ${user.role === 'admin' ? `
            <button class="btn btn-outline" onclick="window.location.href='admin.html'">
              <i class="fas fa-cog"></i>
              Admin Panel
            </button>
          ` : ''}
          
          <button class="btn btn-outline" onclick="window.location.href='wishlist.html'">
            <i class="fas fa-heart"></i>
            Wishlist
          </button>
          
          <button class="btn btn-outline" onclick="window.location.href='cart.html'">
            <i class="fas fa-shopping-cart"></i>
            Cart
          </button>
          
          <button class="btn btn-secondary" onclick="Auth.logout(); this.closest('.modal-overlay').remove();">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// ============================================
// Login Modal
// ============================================

function showLoginModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Login</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form id="loginForm" onsubmit="handleLogin(event)">
          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; margin-bottom: var(--space-2); font-weight: var(--font-medium);">Email</label>
            <input type="email" class="input" name="email" placeholder="student@college.edu" required>
          </div>
          
          <div style="margin-bottom: var(--space-6);">
            <label style="display: block; margin-bottom: var(--space-2); font-weight: var(--font-medium);">Password</label>
            <input type="password" class="input" name="password" placeholder="Enter your password" required>
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-3);">
            <i class="fas fa-sign-in-alt"></i>
            Login
          </button>
          
          <p style="text-align: center; color: var(--text-secondary); font-size: var(--text-sm);">
            Demo: student@college.edu / student123
          </p>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('password');

  const result = await Auth.login(email, password);

  if (result.success) {
    form.closest('.modal-overlay').remove();
  }
}

// ============================================
// E-Cell Info Modal
// ============================================

function showECellInfo() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">About E-Cell</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div style="text-align: center; margin-bottom: var(--space-6);">
          <div style="font-size: 4rem; margin-bottom: var(--space-4);">🚀</div>
          <h4 style="margin-bottom: var(--space-4);">Entrepreneurship Cell</h4>
        </div>
        
        <p style="margin-bottom: var(--space-4); line-height: 1.8;">
          The Entrepreneurship Cell (E-Cell) is a student-run organization dedicated to fostering 
          innovation and entrepreneurship among students. We provide a platform for aspiring 
          entrepreneurs to learn, network, and grow.
        </p>
        
        <h5 style="margin-bottom: var(--space-3);">Our Mission</h5>
        <p style="margin-bottom: var(--space-4); line-height: 1.8;">
          To create an ecosystem that nurtures entrepreneurial talent and helps students turn 
          their innovative ideas into successful ventures.
        </p>
        
        <h5 style="margin-bottom: var(--space-3);">E-cell Store Initiative</h5>
        <p style="margin-bottom: var(--space-6); line-height: 1.8;">
          E-cell Store is our e-commerce platform offering exclusive deals for students and 
          showcasing products from student-led startups. Every purchase supports the student 
          entrepreneurship ecosystem.
        </p>
        
        <div style="display: flex; gap: var(--space-3);">
          <a href="https://linkedin.com" target="_blank" class="btn btn-outline" style="flex: 1;">
            <i class="fab fa-linkedin"></i>
            LinkedIn
          </a>
          <a href="https://instagram.com" target="_blank" class="btn btn-outline" style="flex: 1;">
            <i class="fab fa-instagram"></i>
            Instagram
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// ============================================
// Protected Page Check
// ============================================

function requireAuth() {
  if (!Auth.isLoggedIn()) {
    showToast('warning', 'Login Required', 'Please login to access this page.');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!Auth.isAdmin()) {
    showToast('error', 'Access Denied', 'You need admin privileges to access this page.');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    return false;
  }
  return true;
}

// ============================================
// Initialize Authentication
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  updateUIForUser();
});
