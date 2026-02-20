import { supabase } from '../supabaseClient'

function formatNumber(num) {
  return Number(num).toLocaleString('he-IL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('he-IL')
}

export default function HoldingsTable({ holdings, loading, onDelete }) {
  if (loading) {
    return <p className="loading-text">טוען נתונים...</p>
  }

  if (holdings.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
            <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M6 18h36" stroke="currentColor" strokeWidth="2" />
            <path d="M16 26h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 32h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>אין ניירות ערך בתיק. הוסף את הנייר הראשון למעלה.</p>
        </div>
      </div>
    )
  }

  const totalValue = holdings.reduce(
    (sum, h) => sum + Number(h.quantity) * Number(h.purchase_price),
    0
  )

  async function handleDelete(id) {
    const { error } = await supabase.from('holdings').delete().eq('id', id)
    if (error) {
      alert('שגיאה במחיקה: ' + error.message)
      return
    }
    onDelete()
  }

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <h2>התיק שלי</h2>
        <span className="table-count">{holdings.length} פוזיציות</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>שם נייר ערך</th>
              <th>כמות</th>
              <th>מחיר קנייה</th>
              <th>תאריך קנייה</th>
              <th>שווי כולל</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const totalHoldingValue = Number(h.quantity) * Number(h.purchase_price)
              return (
                <tr key={h.id}>
                  <td className="name-cell">{h.name}</td>
                  <td className="mono-cell">{formatNumber(h.quantity)}</td>
                  <td className="mono-cell">₪{formatNumber(h.purchase_price)}</td>
                  <td className="date-cell">{formatDate(h.purchase_date)}</td>
                  <td className="value-cell">₪{formatNumber(totalHoldingValue)}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(h.id)}
                      title="מחק"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                        <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0 001.493-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A1.75 1.75 0 009.25 1.5h-2.5A1.75 1.75 0 005 3.25zm2.5-.75a.25.25 0 00-.25.25V4h1.5v-.75a.25.25 0 00-.25-.25h-2.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.075l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75 0 01-1.498-.075l.275-5.5A.75.75 0 019.95 6z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="total-label">סה״כ שווי התיק</td>
              <td className="total-value">₪{formatNumber(totalValue)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
