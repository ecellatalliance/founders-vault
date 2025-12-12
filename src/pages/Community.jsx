import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../supabaseClient'

const Community = () => {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAnnouncements(data || [])
            setLoading(false)
        } catch (error) {
            console.error('Error fetching announcements:', error)
            setLoading(false)
        }
    }

    return (
        <Layout>
            <main className="container" style={{ padding: 'var(--space-8) 0', minHeight: 'calc(100vh - 400px)' }}>
                <div className="section-header">
                    <h1 className="section-title">Community Announcements</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Stay updated with the latest news and events</p>
                </div>

                {loading ? (
                    <div className="loading-container" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                        <div className="loading-spinner" style={{ margin: '0 auto var(--space-4)' }}></div>
                        <p>Loading announcements...</p>
                    </div>
                ) : announcements.length > 0 ? (
                    <div id="announcementsContainer">
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className="announcement-card">
                                <div className="announcement-header">
                                    <div>
                                        <h3 className="announcement-title">{announcement.title}</h3>
                                        <div className="announcement-meta">
                                            <span><i className="far fa-calendar"></i> {announcement.date}</span>
                                            <span><i className="far fa-clock"></i> {announcement.time}</span>
                                        </div>
                                    </div>
                                    <span className="announcement-badge">{announcement.category}</span>
                                </div>
                                <div className="announcement-content">
                                    <p>{announcement.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div id="emptyAnnouncements" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                        <i className="fas fa-bullhorn" style={{ fontSize: '4rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', opacity: 0.3 }}></i>
                        <h3>No announcements yet</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Check back later for updates!</p>
                    </div>
                )}
            </main>
        </Layout>
    )
}

export default Community
