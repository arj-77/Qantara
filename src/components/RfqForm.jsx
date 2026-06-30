import { useState } from 'react'

const initialForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  partNumber: '',
  manufacturer: '',
  quantity: '',
  deliveryLocation: '',
  urgency: '',
  upload: '',
  notes: '',
}

function validate(formData) {
  const errors = {}

  if (!formData.name.trim()) errors.name = 'Please enter your name.'
  if (!formData.company.trim()) errors.company = 'Please enter your company name.'
  if (!formData.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!formData.country.trim()) errors.country = 'Please enter your country.'
  if (!formData.partNumber.trim()) errors.partNumber = 'Please enter a part number or reference.'
  if (!formData.quantity.trim()) errors.quantity = 'Please enter the required quantity.'
  if (!formData.deliveryLocation.trim()) {
    errors.deliveryLocation = 'Please enter the required delivery location.'
  }
  if (!formData.urgency.trim()) errors.urgency = 'Please select the urgency.'

  return errors
}

export function RfqForm() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

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

    const nextErrors = validate(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false)
      return
    }

    setSubmitted(true)
    setFormData(initialForm)
  }

  return (
    <div className="rfq-layout">
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
          <button type="submit" className="button button--solid">
            Submit RFQ
          </button>
          <p className="form-note">
            Front-end submission only. Add email or CRM integration in this component when your
            backend workflow is ready.
          </p>
        </div>

        {submitted ? (
          <div className="success-banner" role="status" aria-live="polite">
            Thank you. Your RFQ has been captured locally and is ready to be connected to email or
            CRM handling.
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
