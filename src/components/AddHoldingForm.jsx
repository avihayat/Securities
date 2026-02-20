import { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'

const EMPTY_FORM = {
  name: '',
  quantity: '',
  purchase_price: '',
  purchase_date: new Date().toISOString().split('T')[0],
}

export default function AddHoldingForm({ onHoldingAdded }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(true)
  const formRef = useRef(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.quantity || !form.purchase_price || !form.purchase_date) {
      setError('יש למלא את כל השדות')
      return
    }

    setLoading(true)
    const { error: insertError } = await supabase.from('holdings').insert({
      name: form.name.trim(),
      quantity: Number(form.quantity),
      purchase_price: Number(form.purchase_price),
      purchase_date: form.purchase_date,
    })

    setLoading(false)

    if (insertError) {
      setError('שגיאה בשמירה: ' + insertError.message)
      return
    }

    formRef.current?.classList.add('success-flash')
    setTimeout(() => formRef.current?.classList.remove('success-flash'), 500)

    setForm(EMPTY_FORM)
    onHoldingAdded()
  }

  return (
    <div className="add-form" ref={formRef}>
      <button
        type="button"
        className="form-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="form-toggle__right">
          <span className="form-toggle__icon">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </span>
          <span>הוספת נייר ערך</span>
        </span>
        <svg
          className={`form-toggle__chevron ${isOpen ? 'open' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          width="18"
          height="18"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">שם נייר ערך</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="לדוגמה: טבע"
              />
            </div>
            <div className="form-field">
              <label htmlFor="quantity">כמות</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="any"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="form-field">
              <label htmlFor="purchase_price">מחיר קנייה</label>
              <input
                id="purchase_price"
                name="purchase_price"
                type="number"
                min="0"
                step="any"
                value={form.purchase_price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="form-field">
              <label htmlFor="purchase_date">תאריך קנייה</label>
              <input
                id="purchase_date"
                name="purchase_date"
                type="date"
                value={form.purchase_date}
                onChange={handleChange}
              />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'שומר...' : 'הוסף לתיק'}
          </button>
        </form>
      )}
    </div>
  )
}
