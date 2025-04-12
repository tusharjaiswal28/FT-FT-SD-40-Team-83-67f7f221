document.addEventListener('DOMContentLoaded', function() {
    // Get challenge ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = parseInt(urlParams.get('id'));
    
    // Get current user
    const user = storage.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Find challenge in hardcoded or stored challenges
    let challenge = storage.getChallengeById(challengeId) || 
        getHardcodedChallengeById(challengeId);
    
    if (!challenge) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Display challenge details
    renderChallengeDetails(challenge);
    
    // Tab functionality
    setupWorkspaceTabs();
    
    // Code editor functionality
    setupCodeEditor();
    
    // Form submission
    document.getElementById('submitSolutionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitSolution(challenge, user);
    });
    
    // Helper functions
    function getHardcodedChallengeById(id) {
        const hardcoded = [
            {
                id: 1001,
                title: "Frontend Developer Challenge",
                company: "TechCorp",
                description: "Build a responsive dashboard with HTML, CSS, and JavaScript",
                skills: ["HTML", "CSS", "JavaScript"],
                difficulty: "medium",
                instructions: `
                    <h3>Challenge Requirements:</h3>
                    <ol>
                        <li>Create a responsive dashboard with at least 3 sections</li>
                        <li>Include a navigation menu</li>
                        <li>Make it mobile-friendly</li>
                        <li>Add interactive elements using JavaScript</li>
                    </ol>
                    <h3>Evaluation Criteria:</h3>
                    <ul>
                        <li>Code quality and organization</li>
                        <li>Responsiveness</li>
                        <li>Visual design</li>
                        <li>Functionality</li>
                    </ul>
                `,
                starterCode: {
                    html: `<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <style>
        /* Add your CSS here */
    </style>
</head>
<body>
    <!-- Add your HTML here -->
    <script>
        // Add your JavaScript here
    </script>
</body>
</html>`,
                    css: `/* Add your styles here */`,
                    javascript: `// Add your interactivity here`
                }
            },
            // Add more hardcoded challenges as needed
        ];
        return hardcoded.find(c => c.id === id);
    }
    
    function renderChallengeDetails(challenge) {
        const container = document.getElementById('challengeDetails');
        container.innerHTML = `
            <h2>${challenge.title}</h2>
            <div class="challenge-meta">
                <span class="difficulty ${challenge.difficulty}">
                    ${challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
                <span>Posted by: ${challenge.company}</span>
            </div>
            <div class="challenge-description">
                <p>${challenge.description}</p>
            </div>
            <div class="job-skills">
                ${challenge.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        `;
        
        // Load instructions
        document.getElementById('instructions').innerHTML = challenge.instructions || `
            <p>No additional instructions provided.</p>
        `;
    }
    
    function setupWorkspaceTabs() {
        const tabs = document.querySelectorAll('.workspace-tabs .tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding content
                document.querySelectorAll('.workspace-tab').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
    }
    
    function setupCodeEditor() {
        const languageSelect = document.getElementById('languageSelect');
        const codeInput = document.getElementById('codeInput');
        const runBtn = document.getElementById('runCode');
        const previewFrame = document.getElementById('codePreview');
        
        // Load starter code
        const challenge = getHardcodedChallengeById(challengeId);
        if (challenge?.starterCode) {
            codeInput.value = challenge.starterCode.html || '';
        }
        
        // Run code button
        runBtn.addEventListener('click', function() {
            const code = codeInput.value;
            previewFrame.srcdoc = code;
            
            // Switch to preview tab
            document.querySelector('.workspace-tabs .tab-btn[data-tab="preview"]').click();
        });
        
        // Language selection
        languageSelect.addEventListener('change', function() {
            const language = this.value;
            if (challenge?.starterCode?.[language]) {
                codeInput.value = challenge.starterCode[language];
            } else {
                codeInput.value = `// Add your ${language.toUpperCase()} code here`;
            }
        });
    }
    
    function submitSolution(challenge, user) {
        const solution = {
            userId: user.id,
            userName: user.name,
            link: document.getElementById('solutionLink').value,
            notes: document.getElementById('solutionNotes').value,
            submittedAt: new Date().toISOString()
        };
        
        // Add to existing challenge if it's in storage
        const existingChallenge = storage.getChallengeById(challenge.id);
        if (existingChallenge) {
            existingChallenge.submissions.push(solution);
            storage.saveJobs(storage.getJobs());
        }
        
        alert('Solution submitted successfully!');
        window.location.href = 'dashboard.html';
    }
});