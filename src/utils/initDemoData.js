// Initialize demo users in localStorage
const initializeDemoUsers = () => {
    const demoUsers = [
        {
            id: 'user_demo_student',
            name: 'Demo Student',
            email: 'student@ecell.com',
            password: 'password',
            vcBalance: 5000,
            isAdmin: false,
            createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'user_demo_admin',
            name: 'Admin User',
            email: 'admin@ecell.com',
            password: 'admin123',
            vcBalance: 10000,
            isAdmin: true,
            createdAt: '2024-01-01T00:00:00.000Z'
        }
    ]

    // Only initialize if not already present
    const existingUsers = localStorage.getItem('spp_users')
    if (!existingUsers) {
        localStorage.setItem('spp_users', JSON.stringify(demoUsers))
        console.log('✅ Demo users initialized!')
    }
}

// Run on app load
if (typeof window !== 'undefined') {
    initializeDemoUsers()
}

export { initializeDemoUsers }
