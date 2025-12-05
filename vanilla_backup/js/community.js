// Community Page Logic

const { db } = window.firebaseApp;
const { showLoading, hideLoading, formatDate } = window.utils;

async function initCommunityPage() {
    await loadAnnouncements();
    setupEventListeners();
}

async function loadAnnouncements() {
    const container = document.getElementById('announcementsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const emptyMessage = document.getElementById('emptyAnnouncements');

    showLoading(loadingContainer);

    try {
        const snapshot = await db.collection('announcements')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        hideLoading();

        if (snapshot.empty) {
            emptyMessage.classList.remove('hidden');
            return;
        }

        emptyMessage.classList.add('hidden');
        container.innerHTML = snapshot.docs.map(doc => {
            const announcement = doc.data();
            return `
                <div class="announcement-card">
                    <div class="announcement-header">
                        <div>
                            <h3>${announcement.title}</h3>
                            <div class="announcement-meta">
                                Posted by ${announcement.author} • ${formatDate(announcement.createdAt)}
                            </div>
                        </div>
                    </div>
                    <div class="announcement-content">
                        ${announcement.content}
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading announcements:', error);
        hideLoading();
    }
}

function setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => window.authFunctions.logout());
    }
}

window.initCommunityPage = initCommunityPage;
