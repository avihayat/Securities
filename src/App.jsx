import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'
import Sidebar from './components/Sidebar'
import SummaryCards from './components/SummaryCards'
import AddHoldingForm from './components/AddHoldingForm'
import HoldingsTable from './components/HoldingsTable'
import './App.css'

export default function App() {
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchHoldings = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('holdings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching holdings:', error)
    } else {
      setHoldings(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchHoldings()
  }, [fetchHoldings])

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar />

      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          {sidebarOpen
            ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          }
        </svg>
      </button>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar__right">
            <h1 className="top-bar__title">ניהול תיק ניירות ערך</h1>
            <span className="top-bar__subtitle">סקירה כללית ומעקב אחזקות</span>
          </div>
          <div className="top-bar__left">
            <span className="live-dot"></span>
            <span className="top-bar__live">LIVE</span>
          </div>
        </header>

        <SummaryCards holdings={holdings} />
        <AddHoldingForm onHoldingAdded={fetchHoldings} />
        <HoldingsTable
          holdings={holdings}
          loading={loading}
          onDelete={fetchHoldings}
        />
      </main>
    </div>
  )
}
