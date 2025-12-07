document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Get registered users to get full user data
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const fullUserData = users.find(u => u.id === currentUser.id);

    if (!fullUserData) {
        // User data not found, logout
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
        return;
    }

    // Populate profile information
    document.getElementById('userName').textContent = fullUserData.name;
    document.getElementById('userEmail').textContent = fullUserData.email;
    document.getElementById('displayName').textContent = fullUserData.name;
    document.getElementById('displayEmail').textContent = fullUserData.email;
    
    // Format member since date
    const registeredDate = new Date(fullUserData.registeredAt);
    const formattedDate = registeredDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('memberSince').textContent = formattedDate;

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberUser');
            showMessage('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    });

    // Edit Profile functionality (placeholder)
    document.getElementById('editProfile').addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Edit profile feature coming soon!', 'info');
    });

    // Change Password functionality (placeholder)
    document.getElementById('changePassword').addEventListener('click', function() {
        showMessage('Change password feature coming soon!', 'info');
    });

    // Notifications functionality (placeholder)
    document.getElementById('notifications').addEventListener('click', function() {
        showMessage('Notification settings coming soon!', 'info');
    });

    // Privacy functionality (placeholder)
    document.getElementById('privacy').addEventListener('click', function() {
        showMessage('Privacy settings coming soon!', 'info');
    });

    // Helper function to show messages
    function showMessage(message, type) {
        const existingMsg = document.querySelector('.profile-message');
        if (existingMsg) existingMsg.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `profile-message ${type}`;
        messageDiv.textContent = message;
        
        let bgColor = '#10b981'; // success
        if (type === 'error') bgColor = '#ef4444';
        if (type === 'info') bgColor = '#3b82f6';
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 4px;
            font-weight: 600;
            z-index: 10000;
            animation: slideDown 0.3s ease;
            background-color: ${bgColor};
            color: white;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
});
