// Initialize sample jobs if none exist
if (!localStorage.getItem('jobs')) {
    localStorage.setItem('jobs', JSON.stringify([]));
}

// Job management functions
const jobManager = {
    // Get all jobs (both stored and hardcoded)
    getAllJobs: function() {
        const storedJobs = JSON.parse(localStorage.getItem('jobs')) || [];
        const hardcodedJobs = this.getHardcodedJobs();
        return [...storedJobs, ...hardcodedJobs];
    },

    // Hardcoded sample jobs
    getHardcodedJobs: function() {
        return [
            {
                id: 1001,
                title: "Frontend Dashboard Challenge",
                company: "TechCorp",
                description: "Build a responsive dashboard with HTML, CSS, and JavaScript",
                skills: ["HTML", "CSS", "JavaScript"],
                difficulty: "medium",
                postedBy: 1, // Sample employer ID
                submissions: []
            },
            {
                id: 1002,
                title: "REST API Challenge",
                company: "DevSolutions",
                description: "Design a REST API for a task management system",
                skills: ["Node.js", "API Design", "Express"],
                difficulty: "hard",
                postedBy: 1, // Sample employer ID
                submissions: []
            }
        ];
    },

    // Add a new job
    addJob: function(job) {
        const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        // Generate new ID (max existing ID + 1 or 1 if empty)
        job.id = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
        jobs.push(job);
        localStorage.setItem('jobs', JSON.stringify(jobs));
        return job;
    },

    // Get jobs posted by specific employer
    getJobsByEmployer: function(employerId) {
        const jobs = this.getAllJobs();
        return jobs.filter(job => job.postedBy === employerId);
    },

    // Render jobs to the dashboard
    renderJobs: function() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Get filters
        const skillFilter = document.getElementById('skillFilter')?.value.toLowerCase();
        const difficultyFilter = document.getElementById('difficultyFilter')?.value;

        // Filter jobs
        let jobs = this.getAllJobs();
        
        if (skillFilter) {
            jobs = jobs.filter(job => 
                job.skills.some(skill => 
                    skill.toLowerCase().includes(skillFilter)
                )
            );
        }
        
        if (difficultyFilter) {
            jobs = jobs.filter(job => job.difficulty === difficultyFilter);
        }

        // Render to DOM
        const container = document.getElementById('jobListings');
        if (container) {
            if (jobs.length === 0) {
                container.innerHTML = '<p class="no-jobs">No challenges match your filters</p>';
            } else {
                container.innerHTML = jobs.map(job => this.createJobCard(job)).join('');
            }
        }

        // Always render hardcoded challenges
        this.renderHardcodedChallenges();
    },

    // Create HTML for a job card
    createJobCard: function(job) {
        return `
            <div class="job-card">
                <h3>${job.title}</h3>
                <div class="job-meta">
                    <span class="difficulty ${job.difficulty}">
                        ${job.difficulty.charAt(0).toUpperCase() + job.difficulty.slice(1)}
                    </span>
                    <span>Posted by: ${job.company}</span>
                </div>
                <p>${job.description}</p>
                <div class="job-skills">
                    ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <button class="btn primary start-challenge-btn" 
                        data-challenge-id="${job.id}">
                    Start Challenge
                </button>
            </div>
        `;
    },

    // Render hardcoded challenges
    renderHardcodedChallenges: function() {
        const container = document.querySelector('.hardcoded-challenges .job-listings');
        if (!container) return;

        const hardcodedJobs = this.getHardcodedJobs();
        container.innerHTML = hardcodedJobs.map(job => this.createJobCard(job)).join('');
    },

    // Handle job posting form
    setupPostJobForm: function() {
        const form = document.getElementById('postJobForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user || user.type !== 'employer') {
                alert('Only employers can post challenges');
                return;
            }

            const newJob = {
                title: document.getElementById('jobTitle').value,
                company: user.name,
                description: document.getElementById('jobDescription').value,
                skills: document.getElementById('jobSkills').value
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(skill => skill),
                difficulty: document.getElementById('jobDifficulty').value,
                postedBy: user.id,
                submissions: []
            };

            this.addJob(newJob);
            alert('Challenge posted successfully!');
            window.location.href = 'dashboard.html';
        });
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Render jobs on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        jobManager.renderJobs();
        
        // Add filter event listeners
        document.getElementById('skillFilter')?.addEventListener('change', () => jobManager.renderJobs());
        document.getElementById('difficultyFilter')?.addEventListener('change', () => jobManager.renderJobs());
    }
    
    // Setup job posting form
    if (window.location.pathname.includes('post-job.html')) {
        jobManager.setupPostJobForm();
    }
});