document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const users = storage.getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                storage.setCurrentUser(user);
                
                // Redirect based on user type
                if (user.type === 'employer') {
                    window.location.href = 'post-job.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                document.getElementById('loginError').textContent = 'Invalid email or password';
            }
        });
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const type = document.getElementById('userType').value;
            
            const users = storage.getUsers();
            if (users.some(u => u.email === email)) {
                document.getElementById('signupError').textContent = 'Email already exists';
                return;
            }
            
            const newUser = { name, email, password, type };
            storage.addUser(newUser);
            storage.setCurrentUser(newUser);
            
            window.location.href = type === 'employer' ? 'post-job.html' : 'dashboard.html';
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            storage.clearCurrentUser();
            window.location.href = 'login.html';
        });
    }

    // Show user name in dashboard
    const userName = document.getElementById('userName');
    if (userName) {
        const user = storage.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        userName.textContent = user.name;
        
        // Hide post job button for candidates
        if (user.type === 'candidate') {
            document.getElementById('postJobBtn').style.display = 'none';
        }
    }
});