function formatCurrency(num) {
  return Number(num).toLocaleString('he-IL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function SummaryCards({ holdings }) {
  const totalValue = holdings.reduce(
    (sum, h) => sum + Number(h.quantity) * Number(h.purchase_price),
    0
  )
  const holdingsCount = holdings.length
  const lastUpdated = holdings.length > 0
    ? new Date(
        Math.max(...holdings.map(h => new Date(h.created_at).getTime()))
      ).toLocaleString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '---'

  return (
    <div className="summary-cards">
      <div className="summary-card summary-card--value">
        <div className="summary-card__header">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
          <span>שווי התיק</span>
        </div>
        <div className="summary-card__value mono">
          ₪{formatCurrency(totalValue)}
        </div>
        <div className="summary-card__badge">
          <span className="badge badge--green">פעיל</span>
        </div>
      </div>

      <div className="summary-card summary-card--count">
        <div className="summary-card__header">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span>ניירות ערך</span>
        </div>
        <div className="summary-card__value mono">
          {holdingsCount}
        </div>
        <div className="summary-card__sub">
          {holdingsCount === 0 ? 'תיק ריק' : `${holdingsCount} פוזיציות פתוחות`}
        </div>
      </div>

      <div className="summary-card summary-card--time">
        <div className="summary-card__header">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>עדכון אחרון</span>
        </div>
        <div className="summary-card__value summary-card__value--small mono">
          {lastUpdated}
        </div>
        <div className="summary-card__sub">
          נתונים בזמן אמת
        </div>
      </div>
    </div>
  )
}
