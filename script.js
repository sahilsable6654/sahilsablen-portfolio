// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    loader.classList.add('hidden');
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);

darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    darkModeToggle.innerHTML = newTheme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Add scroll-based animation for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--card-bg)';
        navbar.style.boxShadow = '0 2px 5px var(--shadow-color)';
    } else {
        navbar.style.background = 'var(--card-bg)';
        navbar.style.boxShadow = 'none';
    }
});

// GitHub Repository Integration
document.querySelectorAll('.github-btn').forEach(button => {
    button.addEventListener('click', async function() {
        const projectCard = this.closest('.project-card');
        const repoInput = projectCard.querySelector('.github-repo-input');
        const statusDiv = projectCard.querySelector('.github-status');
        const url = repoInput.value.trim();

        if (!url) {
            statusDiv.textContent = 'Please enter a GitHub repository URL';
            statusDiv.style.color = '#e74c3c';
            return;
        }

        try {
            // Extract owner and repo name from URL
            const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match) {
                throw new Error('Invalid GitHub URL format');
            }

            const [_, owner, repo] = match;
            
            // Show loading state
            statusDiv.textContent = 'Loading repository data...';
            statusDiv.style.color = '#3498db';

            // Fetch repository data from GitHub API
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            if (!response.ok) {
                throw new Error('Repository not found');
            }

            const data = await response.json();
            
            // Update project card with GitHub data
            projectCard.querySelector('h3').textContent = data.name;
            projectCard.querySelector('p').textContent = data.description || 'No description available';
            
            // Update GitHub stats
            projectCard.querySelector('.star-count').textContent = data.stargazers_count;
            projectCard.querySelector('.fork-count').textContent = data.forks_count;
            
            // Update GitHub source code button
            const sourceCodeBtn = projectCard.querySelector('.github-source-btn');
            sourceCodeBtn.href = data.html_url;
            sourceCodeBtn.style.display = 'flex';
            
            // Update technologies
            const techDiv = projectCard.querySelector('.project-tech');
            techDiv.innerHTML = ''; // Clear existing tech tags
            
            if (data.language) {
                const langSpan = document.createElement('span');
                langSpan.textContent = data.language;
                techDiv.appendChild(langSpan);
            }
            
            // Show success message
            statusDiv.textContent = 'Repository added successfully!';
            statusDiv.style.color = '#2ecc71';
            
            // Clear input
            repoInput.value = '';
            
        } catch (error) {
            // Show error message
            statusDiv.textContent = error.message;
            statusDiv.style.color = '#e74c3c';
            console.error('Error:', error);
        }
    });
});

// Social Media Links
const socialLinks = {
    github: 'https://github.com/sahilsable', // Your GitHub username
    linkedin: 'https://www.linkedin.com/in/sahil-sable', // Your LinkedIn profile URL
    twitter: 'https://twitter.com/sahilsable', // Your Twitter username
    portfolio: 'http://localhost:8000' // Your portfolio URL
};

// Update social media links
document.querySelectorAll('.social-icon').forEach(icon => {
    const platform = icon.querySelector('i').classList[1].split('-')[1];
    if (socialLinks[platform]) {
        icon.href = socialLinks[platform];
        icon.target = '_blank';
    }
});

// Function to share portfolio on LinkedIn
function sharePortfolioOnLinkedIn() {
    const portfolioUrl = encodeURIComponent(socialLinks.portfolio);
    const title = encodeURIComponent("Sahil Sable's Portfolio");
    const summary = encodeURIComponent("Check out my portfolio showcasing my web development projects and skills!");
    const source = encodeURIComponent("Portfolio Website");
    
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${portfolioUrl}&title=${title}&summary=${summary}&source=${source}`;
    
    window.open(linkedInShareUrl, '_blank');
}

// Add LinkedIn share button
const linkedinShareBtn = document.createElement('button');
linkedinShareBtn.className = 'btn primary linkedin-share-btn';
linkedinShareBtn.innerHTML = '<i class="fab fa-linkedin"></i> Share on LinkedIn';
linkedinShareBtn.onclick = sharePortfolioOnLinkedIn;

// Add the share button to the hero section
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    heroContent.appendChild(linkedinShareBtn);
}

// GitHub Authentication
const githubSigninBtn = document.querySelector('.github-signin-btn');
const addGithubProjectBtn = document.querySelector('.add-github-project-btn');
const projectGrid = document.querySelector('.project-grid');

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'; // Replace with your GitHub OAuth App Client ID
const GITHUB_REDIRECT_URI = 'http://localhost:8000'; // Your redirect URI

// Show Add GitHub Project button by default
if (addGithubProjectBtn) {
    addGithubProjectBtn.style.display = 'flex';
}

// Hide Sign in button by default
if (githubSigninBtn) {
    githubSigninBtn.style.display = 'none';
}

githubSigninBtn.addEventListener('click', function() {
    // Redirect to GitHub OAuth page
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo`;
    window.location.href = githubAuthUrl;
});

// Check if user is authenticated
function checkGitHubAuth() {
    const accessToken = localStorage.getItem('github_access_token');
    if (accessToken) {
        githubSigninBtn.style.display = 'none';
        addGithubProjectBtn.style.display = 'flex';
    }
}

// Handle GitHub OAuth callback
function handleGitHubCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        // Exchange code for access token
        fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: 'YOUR_GITHUB_CLIENT_SECRET', // Replace with your GitHub OAuth App Client Secret
                code: code,
                redirect_uri: GITHUB_REDIRECT_URI
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('github_access_token', data.access_token);
                githubSigninBtn.style.display = 'none';
                addGithubProjectBtn.style.display = 'flex';
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Project Addition Functionality
addGithubProjectBtn.addEventListener('click', function() {
    // Create new project card
    const newProjectCard = document.createElement('div');
    newProjectCard.className = 'project-card';
    newProjectCard.setAttribute('data-aos', 'fade-up');
    
    newProjectCard.innerHTML = `
        <div class="project-image">
            <img src="https://via.placeholder.com/300x200" alt="New Project">
            <div class="project-overlay">
                <div class="project-links">
                    <a href="#" class="btn small"><i class="fas fa-link"></i> Live Demo</a>
                    <a href="#" class="btn small github-source-btn" target="_blank"><i class="fab fa-github"></i> Source Code</a>
                    <div class="github-integration">
                        <input type="text" class="github-repo-input" placeholder="Enter GitHub repo URL">
                        <button class="btn small github-btn"><i class="fab fa-github"></i> Add from GitHub</button>
                        <div class="github-status"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="project-info">
            <h3>New Project</h3>
            <p>Add your project description here.</p>
            <div class="project-tech">
                <span>Add</span>
                <span>Technologies</span>
                <span>Here</span>
            </div>
            <div class="github-stats">
                <span class="stars"><i class="fas fa-star"></i> <span class="star-count">0</span></span>
                <span class="forks"><i class="fas fa-code-branch"></i> <span class="fork-count">0</span></span>
            </div>
        </div>
    `;
    
    // Add the new project card to the grid
    projectGrid.appendChild(newProjectCard);
    
    // Initialize AOS for the new card
    AOS.refresh();
    
    // Add event listener for the GitHub button in the new card
    const githubBtn = newProjectCard.querySelector('.github-btn');
    const githubInput = newProjectCard.querySelector('.github-repo-input');
    const statusDiv = newProjectCard.querySelector('.github-status');
    const sourceCodeBtn = newProjectCard.querySelector('.github-source-btn');
    
    githubBtn.addEventListener('click', function() {
        const repoUrl = githubInput.value.trim();
        
        if (!repoUrl) {
            statusDiv.textContent = 'Please enter a GitHub repository URL';
            statusDiv.style.color = 'red';
            return;
        }
        
        // Extract owner and repo name from URL
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            statusDiv.textContent = 'Invalid GitHub repository URL';
            statusDiv.style.color = 'red';
            return;
        }
        
        const [_, owner, repo] = match;
        
        // Fetch repository data
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Repository not found');
                }
                return response.json();
            })
            .then(data => {
                // Update project card with repository data
                const projectTitle = newProjectCard.querySelector('h3');
                const projectDesc = newProjectCard.querySelector('.project-info p');
                const projectTech = newProjectCard.querySelector('.project-tech');
                const starCount = newProjectCard.querySelector('.star-count');
                const forkCount = newProjectCard.querySelector('.fork-count');
                
                projectTitle.textContent = data.name;
                projectDesc.textContent = data.description || 'No description available';
                starCount.textContent = data.stargazers_count;
                forkCount.textContent = data.forks_count;
                
                // Update source code button
                sourceCodeBtn.href = data.html_url;
                
                // Update technologies
                projectTech.innerHTML = `
                    <span>${data.language || 'Unknown'}</span>
                `;
                
                statusDiv.textContent = 'Project added successfully!';
                statusDiv.style.color = 'green';
            })
            .catch(error => {
                statusDiv.textContent = error.message;
                statusDiv.style.color = 'red';
            });
    });
});

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkGitHubAuth();
    handleGitHubCallback();

    // Handle source code input
    document.querySelectorAll('.save-source-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const projectCard = this.closest('.project-card');
            const input = projectCard.querySelector('.source-code-url-input');
            const sourceCodeBtn = projectCard.querySelector('.github-source-btn');
            const url = input.value.trim();

            if (!url) {
                showStatus('Please enter a valid URL', 'error');
                return;
            }

            try {
                // Update the source code button
                sourceCodeBtn.href = url;
                sourceCodeBtn.style.display = 'flex';
                
                // Hide the input section
                input.parentElement.style.display = 'none';
                
                showStatus('Source code link added successfully!', 'success');
            } catch (error) {
                showStatus('Error adding source code link', 'error');
                console.error('Error:', error);
            }
        });
    });

    // Show source code input when clicking the source code button
    document.querySelectorAll('.github-source-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.href || this.href === '#') {
                e.preventDefault();
                const projectCard = this.closest('.project-card');
                const inputSection = projectCard.querySelector('.source-code-input');
                inputSection.style.display = 'flex';
            }
        });
    });

    // Handle Add GitHub Project button
    document.querySelectorAll('.add-github-project-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Create new project card
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-aos', 'fade-up');
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="https://via.placeholder.com/300x200" alt="New Project">
                    <div class="project-overlay">
                        <div class="project-links">
                            <div class="project-link-input">
                                <input type="text" class="project-url-input" placeholder="Enter project URL">
                                <button class="btn small save-link-btn"><i class="fas fa-save"></i> Save Link</button>
                            </div>
                            <a href="#" class="btn small project-demo-link"><i class="fas fa-link"></i> Live Demo</a>
                            <div class="github-project-input">
                                <input type="text" class="github-project-url-input" placeholder="Enter GitHub project URL">
                                <button class="btn small save-github-project-btn"><i class="fab fa-github"></i> Add GitHub Project</button>
                            </div>
                            <a href="#" class="btn small github-source-btn" target="_blank"><i class="fab fa-github"></i> Source Code</a>
                            <button class="btn small edit-project-btn"><i class="fas fa-edit"></i> Edit Project</button>
                        </div>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="editable" contenteditable="true">New Project</h3>
                    <p class="editable" contenteditable="true">Add project description here.</p>
                    <div class="project-tech editable" contenteditable="true">
                        <span>Add</span>
                        <span>Technologies</span>
                        <span>Here</span>
                    </div>
                    <div class="github-stats">
                        <span class="stars"><i class="fas fa-star"></i> <span class="star-count">0</span></span>
                        <span class="forks"><i class="fas fa-code-branch"></i> <span class="fork-count">0</span></span>
                    </div>
                </div>
            `;

            // Add the new project card to the grid
            document.querySelector('.project-grid').appendChild(projectCard);
            
            // Refresh AOS animations for the new element
            AOS.refresh();
            
            // Initialize event listeners for the new project card
            initializeProjectCard(projectCard);
        });
    });

    // Function to initialize event listeners for a project card
    function initializeProjectCard(projectCard) {
        // Handle GitHub project link
        const saveGithubBtn = projectCard.querySelector('.save-github-project-btn');
        saveGithubBtn.addEventListener('click', async function() {
            const input = projectCard.querySelector('.github-project-url-input');
            const sourceCodeBtn = projectCard.querySelector('.github-source-btn');
            const url = input.value.trim();

            if (!url) {
                showStatus('Please enter a valid GitHub project URL', 'error');
                return;
            }

            try {
                // Validate GitHub URL
                if (!url.includes('github.com')) {
                    showStatus('Please enter a valid GitHub URL', 'error');
                    return;
                }

                // Extract owner and repo name from URL
                const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
                if (!match) {
                    showStatus('Invalid GitHub repository URL format', 'error');
                    return;
                }

                const [_, owner, repo] = match;

                // Fetch repository data from GitHub API
                const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
                if (!response.ok) {
                    throw new Error('Repository not found');
                }

                const data = await response.json();

                // Update project card with GitHub data
                projectCard.querySelector('h3').textContent = data.name;
                projectCard.querySelector('p').textContent = data.description || 'No description available';
                
                // Update GitHub stats
                projectCard.querySelector('.star-count').textContent = data.stargazers_count;
                projectCard.querySelector('.fork-count').textContent = data.forks_count;

                // Update the source code button
                sourceCodeBtn.href = data.html_url;
                sourceCodeBtn.classList.add('enabled');
                
                // Hide the input section
                input.parentElement.style.display = 'none';
                
                showStatus('GitHub project added successfully!', 'success');
            } catch (error) {
                showStatus('Error adding GitHub project: ' + error.message, 'error');
                console.error('Error:', error);
            }
        });

        // Handle click on enabled source code button
        const sourceCodeBtn = projectCard.querySelector('.github-source-btn');
        sourceCodeBtn.addEventListener('click', function(e) {
            if (this.classList.contains('enabled')) {
                // If button is enabled, open the link in a new tab
                window.open(this.href, '_blank');
                return;
            }
            
            // If button is not enabled, show input
            e.preventDefault();
            const inputSection = projectCard.querySelector('.github-project-input');
            inputSection.style.display = 'flex';
        });
    }

    // Handle project link button
    document.querySelectorAll('.project-demo-link').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('enabled')) {
                // If button is enabled, open the link in a new tab
                window.open(this.href, '_blank');
                return;
            }
            
            // If button is not enabled, show input
            e.preventDefault();
            const projectCard = this.closest('.project-card');
            const inputSection = projectCard.querySelector('.project-link-input');
            inputSection.style.display = 'flex';
        });
    });

    // Handle save link button
    document.querySelectorAll('.save-link-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const input = projectCard.querySelector('.project-url-input');
            const demoLink = projectCard.querySelector('.project-demo-link');
            const url = input.value.trim();

            if (!url) {
                showStatus('Please enter a valid project URL', 'error');
                return;
            }

            try {
                // Update the demo link button
                demoLink.href = url;
                demoLink.classList.add('enabled');
                
                // Hide the input section
                input.parentElement.style.display = 'none';
                
                showStatus('Project link added successfully!', 'success');
            } catch (error) {
                showStatus('Error adding project link', 'error');
                console.error('Error:', error);
            }
        });
    });
});

// Load saved project links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.project-card').forEach(card => {
        const projectId = card.dataset.projectId;
        const savedData = JSON.parse(localStorage.getItem(`project-${projectId}`) || '{}');
        
        if (savedData.demoUrl) {
            const demoLink = card.querySelector('.project-demo-link');
            demoLink.href = savedData.demoUrl;
        }
    });
}); 
