import { useRef, useState } from 'react'
import { initialRfqForm, maxAttachmentSize, validateAttachment, validateRfqForm } from '../lib/rfq'

const attachmentHint = 'PDF, image, document, spreadsheet, or text file up to 2 MB.'

function fileToAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const content = result.split(',')[1]

      if (!content) {
        reject(new Error('The attachment could not be processed. Please try again.'))
        return
      }

      resolve({
        filename: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        content,
      })
    }

    reader.onerror = () => reject(new Error('The attachment could not be processed. Please try again.'))
    reader.readAsDataURL(file)
  })
}

export function RfqForm() {
  const [formData, setFormData] = useState(initialRfqForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pulseFields, setPulseFields] = useState([])
  const [attachment, setAttachment] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

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

  async function handleAttachment(file) {
    if (!file) {
      return
    }

    const sizeError = file.size > maxAttachmentSize ? 'Please upload a file smaller than 2 MB.' : ''
    if (sizeError) {
      setErrors((current) => ({ ...current, attachment: sizeError }))
      setAttachment(null)
      return
    }

    try {
      const nextAttachment = await fileToAttachment(file)
      const attachmentError = validateAttachment(nextAttachment)

      if (attachmentError) {
        setErrors((current) => ({ ...current, attachment: attachmentError }))
        setAttachment(null)
        return
      }

      setAttachment(nextAttachment)
      setErrors((current) => ({ ...current, attachment: '' }))
    } catch (error) {
      setErrors((current) => ({
        ...current,
        attachment:
          error instanceof Error ? error.message : 'The attachment could not be processed. Please try again.',
      }))
      setAttachment(null)
    }
  }

  function handleFileChange(event) {
    const [file] = Array.from(event.target.files || [])
    void handleAttachment(file)
  }

  function handleDragOver(event) {
    event.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave(event) {
    event.preventDefault()
    setDragActive(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragActive(false)
    const [file] = Array.from(event.dataTransfer.files || [])
    void handleAttachment(file)
  }

  function clearAttachment(event) {
    event?.stopPropagation()
    setAttachment(null)
    setErrors((current) => ({ ...current, attachment: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      ...formData,
      attachment,
    }

    const { errors: nextErrors, formData: normalizedFormData } = validateRfqForm(payload)
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
      body: JSON.stringify({
        ...normalizedFormData,
        attachment,
      }),
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
        clearAttachment()
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
        {isRequired ? (
          <span className="required-mark" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </span>
    )
  }

  return (
    <div id="rfq-form" className="rfq-layout anchor-target">
      <form className="rfq-form card" noValidate onSubmit={handleSubmit}>
        <div className="stack-sm">
          <p className="eyebrow">Request a Quote</p>
          <h2>Send your RFQ to the sourcing desk</h2>
          <p>
            Share the technical requirement, reference data, delivery destination, and supporting
            documents so Qantara Trading can begin supplier search and quotation review.
          </p>
        </div>

        <div className="form-grid">
          <label>
            {renderLabel('Company name', true)}
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              {...getFieldProps('companyName')}
            />
            {errors.companyName ? <span className="field-error">{errors.companyName}</span> : null}
          </label>

          <label>
            {renderLabel('Contact name', true)}
            <input
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              {...getFieldProps('contactName')}
            />
            {errors.contactName ? <span className="field-error">{errors.contactName}</span> : null}
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
            {renderLabel('Phone / WhatsApp')}
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              {...getFieldProps('phone')}
            />
            {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
          </label>

          <label className="form-grid__full">
            {renderLabel('Product required', true)}
            <textarea
              name="productRequired"
              rows="3"
              value={formData.productRequired}
              onChange={handleChange}
              {...getFieldProps('productRequired')}
            />
            {errors.productRequired ? <span className="field-error">{errors.productRequired}</span> : null}
          </label>

          <label>
            {renderLabel('Brand / part number')}
            <input
              name="brandPartNumber"
              value={formData.brandPartNumber}
              onChange={handleChange}
              {...getFieldProps('brandPartNumber')}
            />
          </label>

          <label>
            {renderLabel('Quantity', true)}
            <input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              {...getFieldProps('quantity')}
            />
            {errors.quantity ? <span className="field-error">{errors.quantity}</span> : null}
          </label>

          <label>
            {renderLabel('Delivery country', true)}
            <input
              name="deliveryCountry"
              value={formData.deliveryCountry}
              onChange={handleChange}
              {...getFieldProps('deliveryCountry')}
            />
            {errors.deliveryCountry ? <span className="field-error">{errors.deliveryCountry}</span> : null}
          </label>

          <label>
            {renderLabel('Required certificates')}
            <input
              name="requiredCertificates"
              value={formData.requiredCertificates}
              onChange={handleChange}
              {...getFieldProps('requiredCertificates')}
            />
          </label>

          <label>
            {renderLabel('Target delivery date')}
            <input
              name="targetDeliveryDate"
              type="date"
              value={formData.targetDeliveryDate}
              onChange={handleChange}
              {...getFieldProps('targetDeliveryDate')}
            />
            {errors.targetDeliveryDate ? (
              <span className="field-error">{errors.targetDeliveryDate}</span>
            ) : null}
          </label>

          <label className="form-grid__full">
            {renderLabel('Additional notes')}
            <textarea
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
              {...getFieldProps('notes')}
            />
          </label>

          <div className="form-grid__full">
            <span className="field-label">Upload drawings / specifications</span>
            <div
              className={[
                'upload-dropzone',
                dragActive ? 'upload-dropzone--active' : '',
                errors.attachment ? 'upload-dropzone--invalid' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
            >
              <input
                ref={fileInputRef}
                className="upload-dropzone__input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
              />
              <p className="upload-dropzone__title">Drag and drop a file here, or click to upload</p>
              <p className="upload-dropzone__hint">{attachmentHint}</p>
              {attachment ? (
                <div className="upload-dropzone__file">
                  <span>{attachment.filename}</span>
                  <button type="button" className="upload-dropzone__remove" onClick={clearAttachment}>
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
            {errors.attachment ? <span className="field-error">{errors.attachment}</span> : null}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="button button--solid" disabled={isSubmitting}>
            {isSubmitting ? 'Sending RFQ...' : 'Submit an RFQ'}
          </button>
          <p className="form-note">
            Required fields are marked with a red asterisk. RFQs are sent securely through the
            site backend for review by Qantara Trading.
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
        <p className="eyebrow">Commercial contact</p>
        <h2>Structured technical and sourcing support</h2>
        <div className="contact-card__items">
          <a href="mailto:enquiries@qantara.uk">enquiries@qantara.uk</a>
        </div>
        <p>
          Qantara Trading supports industrial buyers with supplier search, technical document
          review, quotation comparison, and export-linked coordination.
        </p>
        <div className="contact-card__cta">
          <span className="panel-chip">Response focus</span>
          <p>Clear quotation handling, documentation visibility, and commercially practical follow-up.</p>
        </div>
      </aside>
    </div>
  )
}
