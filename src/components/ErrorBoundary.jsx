
import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo)
        this.setState({ errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: '#dc2626' }}>Something went wrong.</h1>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px', textAlign: 'left', background: '#f3f4f6', padding: '10px', borderRadius: '5px' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
                    >
                        Reload Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
