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
    return <p className="empty-text">אין ניירות ערך בתיק. הוסף את הנייר הראשון למעלה.</p>
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
      <h2>התיק שלי</h2>
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
                  <td>{formatNumber(h.quantity)}</td>
                  <td>₪{formatNumber(h.purchase_price)}</td>
                  <td>{formatDate(h.purchase_date)}</td>
                  <td className="value-cell">₪{formatNumber(totalHoldingValue)}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(h.id)}
                      title="מחק"
                    >
                      ✕
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
