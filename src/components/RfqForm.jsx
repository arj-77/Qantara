import { useState } from 'react'
import { initialRfqForm, validateRfqForm } from '../lib/rfq'

export function RfqForm() {
  const [formData, setFormData] = useState(initialRfqForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pulseFields, setPulseFields] = useState([])

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
      setPulseFields([])
      setTimeout(() => {
        setPulseFields(Object.keys(nextErrors))
      }, 0)
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

  function getFieldProps(name) {
    const isInvalid = Boolean(errors[name])
    const shouldPulse = pulseFields.includes(name)

    return {
      'aria-invalid': isInvalid ? 'true' : 'false',
      className: [
        'field-control',
        isInvalid ? 'field-control--invalid' : '',
        shouldPulse ? 'field-control--pulse' : '',
      ]
        .filter(Boolean)
        .join(' '),
    }
  }

  function renderLabel(label, isRequired = false) {
    return (
      <span className="field-label">
        {label}
        {isRequired ? <span className="required-mark" aria-hidden="true"> *</span> : null}
      </span>
    )
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
            {renderLabel('Name', true)}
            <input name="name" value={formData.name} onChange={handleChange} {...getFieldProps('name')} />
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
          </label>
          <label>
            {renderLabel('Company', true)}
            <input name="company" value={formData.company} onChange={handleChange} {...getFieldProps('company')} />
            {errors.company ? <span className="field-error">{errors.company}</span> : null}
          </label>
          <label>
            {renderLabel('Email', true)}
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              {...getFieldProps('email')}
            />
            {errors.email ? <span className="field-error">{errors.email}</span> : null}
          </label>
          <label>
            {renderLabel('Country', true)}
            <input name="country" value={formData.country} onChange={handleChange} {...getFieldProps('country')} />
            {errors.country ? <span className="field-error">{errors.country}</span> : null}
          </label>
          <label>
            {renderLabel('Part Number', true)}
            <input
              name="partNumber"
              value={formData.partNumber}
              onChange={handleChange}
              {...getFieldProps('partNumber')}
            />
            {errors.partNumber ? <span className="field-error">{errors.partNumber}</span> : null}
          </label>
          <label>
            {renderLabel('Manufacturer / OEM')}
            <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} {...getFieldProps('manufacturer')} />
          </label>
          <label>
            {renderLabel('Quantity', true)}
            <input name="quantity" value={formData.quantity} onChange={handleChange} {...getFieldProps('quantity')} />
            {errors.quantity ? <span className="field-error">{errors.quantity}</span> : null}
          </label>
          <label>
            {renderLabel('Required Delivery Location', true)}
            <input
              name="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={handleChange}
              {...getFieldProps('deliveryLocation')}
            />
            {errors.deliveryLocation ? (
              <span className="field-error">{errors.deliveryLocation}</span>
            ) : null}
          </label>
          <label>
            {renderLabel('Urgency', true)}
            <select name="urgency" value={formData.urgency} onChange={handleChange} {...getFieldProps('urgency')}>
              <option value="">Select urgency</option>
              <option value="urgent">Urgent replacement</option>
              <option value="planned">Planned procurement</option>
              <option value="budgetary">Budgetary enquiry</option>
            </select>
            {errors.urgency ? <span className="field-error">{errors.urgency}</span> : null}
          </label>
          <label className="form-grid__full">
            {renderLabel('Additional Notes')}
            <textarea name="notes" rows="5" value={formData.notes} onChange={handleChange} {...getFieldProps('notes')} />
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
        <h2>Commercial contact</h2>
        <div className="contact-card__items">
          <a href="mailto:enquiries@qantara.uk">enquiries@qantara.uk</a>
          <span>United Kingdom</span>
        </div>
        <p>
          Qantara supports buyers with structured sourcing reviews, commercial comparisons, and
          procurement coordination for industrial part requirements.
        </p>
        <div className="contact-card__cta">
          <span className="panel-chip">Response aim</span>
          <p>RFQ submissions are reviewed by Qantara and followed up by email.</p>
        </div>
      </aside>
    </div>
  )
}
