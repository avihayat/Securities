import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'
import AddHoldingForm from './components/AddHoldingForm'
import HoldingsTable from './components/HoldingsTable'
import './App.css'

export default function App() {
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)

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
    <div className="app">
      <header>
        <h1>ניהול תיק ניירות ערך</h1>
      </header>
      <main>
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
