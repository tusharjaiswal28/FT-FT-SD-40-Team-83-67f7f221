document.addEventListener('DOMContentLoaded', function() {
    const user = storage.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileType').textContent = user.type === 'employer' ? 'Employer' : 'Candidate';
    document.getElementById('updateName').value = user.name;
    
    // Display stats
    const statsContainer = document.getElementById('userStats');
    if (user.type === 'candidate') {
        const submissions = storage.getJobs().flatMap(j => 
            j.submissions.filter(s => s.userId === user.id)
        );
        statsContainer.innerHTML = `
            <h3>Your Activity</h3>
            <div class="stat-card">
                <span class="stat-number">${submissions.length}</span>
                <span class="stat-label">Challenges Completed</span>
            </div>
        `;
    } else {
        const jobsPosted = storage.getJobs().filter(j => j.postedBy === user.id).length;
        const totalSubmissions = storage.getJobs()
            .filter(j => j.postedBy === user.id)
            .reduce((sum, j) => sum + j.submissions.length, 0);
        
        statsContainer.innerHTML = `
            <h3>Your Stats</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${jobsPosted}</span>
                    <span class="stat-label">Challenges Posted</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${totalSubmissions}</span>
                    <span class="stat-label">Total Submissions</span>
                </div>
            </div>
        `;
    }
    
    // Update profile
    document.getElementById('updateProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const users = storage.getUsers();
        const currentUser = users.find(u => u.id === user.id);
        
        currentUser.name = document.getElementById('updateName').value;
        const newPassword = document.getElementById('updatePassword').value;
        if (newPassword) {
            currentUser.password = newPassword;
        }
        
        storage.saveUsers(users);
        storage.setCurrentUser(currentUser);
        alert('Profile updated successfully!');
        window.location.reload();
    });
});