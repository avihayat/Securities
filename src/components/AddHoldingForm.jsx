import { useState } from 'react'
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

    setForm(EMPTY_FORM)
    onHoldingAdded()
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>הוספת נייר ערך</h2>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">שם נייר ערך</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder='לדוגמה: טבע'
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
  )
}
