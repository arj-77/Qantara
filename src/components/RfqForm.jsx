import { useState } from 'react'
import { initialRfqForm, validateRfqForm } from '../lib/rfq'

export function RfqForm() {
  const [formData, setFormData] = useState(initialRfqForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const { errors: nextErrors, formData: normalizedFormData } = validateRfqForm(formData)
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false)
      return
    }

    setIsSubmitting(true)

    fetch('/api/rfq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizedFormData),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          if (data.fieldErrors) {
            setErrors(data.fieldErrors)
          }

          throw new Error(data.error || 'We could not send your RFQ right now.')
        }

        setSubmitted(true)
        setFormData(initialRfqForm)
      })
      .catch((error) => {
        setSubmitted(false)
        setSubmitError(error instanceof Error ? error.message : 'We could not send your RFQ right now.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div id="rfq-form" className="rfq-layout anchor-target">
      <form className="rfq-form card" noValidate onSubmit={handleSubmit}>
        <div className="stack-sm">
          <p className="eyebrow">Request for Quote</p>
          <h2>Send your sourcing requirement</h2>
          <p>
            Share the part details you have today and Qantara can begin a structured sourcing
            review.
          </p>
        </div>

        <div className="form-grid">
          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} />
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
          </label>
          <label>
            Company
            <input name="company" value={formData.company} onChange={handleChange} />
            {errors.company ? <span className="field-error">{errors.company}</span> : null}
          </label>
          <label>
            Email
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
            {errors.email ? <span className="field-error">{errors.email}</span> : null}
          </label>
          <label>
            Phone
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </label>
          <label>
            Country
            <input name="country" value={formData.country} onChange={handleChange} />
            {errors.country ? <span className="field-error">{errors.country}</span> : null}
          </label>
          <label>
            Part Number
            <input name="partNumber" value={formData.partNumber} onChange={handleChange} />
            {errors.partNumber ? <span className="field-error">{errors.partNumber}</span> : null}
          </label>
          <label>
            Manufacturer / OEM
            <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
          </label>
          <label>
            Quantity
            <input name="quantity" value={formData.quantity} onChange={handleChange} />
            {errors.quantity ? <span className="field-error">{errors.quantity}</span> : null}
          </label>
          <label>
            Required Delivery Location
            <input
              name="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={handleChange}
            />
            {errors.deliveryLocation ? (
              <span className="field-error">{errors.deliveryLocation}</span>
            ) : null}
          </label>
          <label>
            Urgency
            <select name="urgency" value={formData.urgency} onChange={handleChange}>
              <option value="">Select urgency</option>
              <option value="urgent">Urgent replacement</option>
              <option value="planned">Planned procurement</option>
              <option value="budgetary">Budgetary enquiry</option>
            </select>
            {errors.urgency ? <span className="field-error">{errors.urgency}</span> : null}
          </label>
          <label className="form-grid__full">
            Upload Drawing / Specification Placeholder
            <input
              name="upload"
              value={formData.upload}
              onChange={handleChange}
              placeholder="Placeholder only. Add real file upload integration later."
            />
          </label>
          <label className="form-grid__full">
            Additional Notes
            <textarea name="notes" rows="5" value={formData.notes} onChange={handleChange} />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="button button--solid" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit RFQ'}
          </button>
          <p className="form-note">
            Your request is sent securely to the Qantara RFQ inbox through the site backend.
          </p>
        </div>

        {submitError ? (
          <div className="field-error" role="alert">
            {submitError}
          </div>
        ) : null}

        {submitted ? (
          <div className="success-banner" role="status" aria-live="polite">
            Thank you. Your RFQ has been sent successfully and is ready for review.
          </div>
        ) : null}
      </form>

      <aside className="contact-card card">
        <p className="eyebrow">Contact Details</p>
        <h2>Commercial contact placeholder</h2>
        <div className="contact-card__items">
          <a href="mailto:info@qantara.uk">info@qantara.uk</a>
          <a href="tel:+440000000000">+44 0000 000000</a>
          <span>United Kingdom</span>
        </div>
        <p>
          Qantara supports buyers with structured sourcing reviews, commercial comparisons, and
          procurement coordination for industrial part requirements.
        </p>
        <div className="contact-card__cta">
          <span className="panel-chip">Response aim</span>
          <p>Professional acknowledgement and requirement review once email handling is connected.</p>
        </div>
      </aside>
    </div>
  )
}
