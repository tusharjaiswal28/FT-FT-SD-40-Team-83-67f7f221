// Initialize sample data if none exists
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
        {
            id: 1,
            name: "Test Employer",
            email: "employer@test.com",
            password: "employer123",
            type: "employer"
        },
        {
            id: 2,
            name: "Test Candidate",
            email: "candidate@test.com",
            password: "candidate123",
            type: "candidate"
        }
    ]));
}

if (!localStorage.getItem('jobs')) {
    localStorage.setItem('jobs', JSON.stringify([
        {
            id: 1,
            title: "Frontend Challenge",
            company: "Tech Corp",
            description: "Build a responsive dashboard using HTML/CSS/JS",
            skills: ["HTML", "CSS", "JavaScript"],
            difficulty: "medium",
            postedBy: 1,
            submissions: []
        },
        {
            id: 2,
            title: "API Design Challenge",
            company: "Dev Solutions",
            description: "Design a REST API for a todo app",
            skills: ["Node.js", "API Design"],
            difficulty: "hard",
            postedBy: 1,
            submissions: []
        }
    ]));
}

// Helper functions
const storage = {
    getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
    getJobs: () => JSON.parse(localStorage.getItem('jobs')) || [],
    getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser')),
    
    saveUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    saveJobs: (jobs) => localStorage.setItem('jobs', JSON.stringify(jobs)),
    setCurrentUser: (user) => localStorage.setItem('currentUser', JSON.stringify(user)),
    
    addUser: (user) => {
        const users = storage.getUsers();
        user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push(user);
        storage.saveUsers(users);
        return user;
    },
    
    addJob: (job) => {
        const jobs = storage.getJobs();
        job.id = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
        jobs.push(job);
        storage.saveJobs(jobs);
        return job;
    },
    
    clearCurrentUser: () => localStorage.removeItem('currentUser')
};

// Add to existing storage.js

storage.getUserById = (id) => storage.getUsers().find(u => u.id === id);

storage.getUserJobs = (userId) => {
    const jobs = storage.getJobs();
    return {
        posted: jobs.filter(j => j.postedBy === userId),
        submissions: jobs.flatMap(j => 
            j.submissions.filter(s => s.userId === userId).map(s => ({
                ...s,
                jobTitle: j.title,
                jobId: j.id
            }))
        )
    };
};

storage.getChallengeById = (id) => storage.getJobs().find(j => j.id === id);