export const initialRfqForm = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  productRequired: '',
  brandPartNumber: '',
  quantity: '',
  deliveryCountry: '',
  requiredCertificates: '',
  targetDeliveryDate: '',
  notes: '',
}

const fieldLimits = {
  companyName: 160,
  contactName: 120,
  email: 160,
  phone: 80,
  productRequired: 240,
  brandPartNumber: 180,
  quantity: 60,
  deliveryCountry: 120,
  requiredCertificates: 240,
  targetDeliveryDate: 40,
  notes: 3000,
}

const allowedAttachmentTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

export const maxAttachmentSize = 2 * 1024 * 1024

function sanitizeValue(value, maxLength) {
  return String(value ?? '')
    .trim()
    .slice(0, maxLength)
}

export function normalizeRfqPayload(payload) {
  return Object.fromEntries(
    Object.entries(initialRfqForm).map(([key]) => [key, sanitizeValue(payload?.[key], fieldLimits[key])]),
  )
}

export function validateAttachment(attachment) {
  if (!attachment) {
    return ''
  }

  if (!attachment.filename || !attachment.content || !attachment.type) {
    return 'The attachment could not be processed. Please re-upload the file.'
  }

  if (typeof attachment.size !== 'number' || attachment.size <= 0) {
    return 'The attachment could not be processed. Please re-upload the file.'
  }

  if (attachment.size > maxAttachmentSize) {
    return 'Please upload a file smaller than 2 MB.'
  }

  if (!allowedAttachmentTypes.has(attachment.type)) {
    return 'Please upload a PDF, image, document, spreadsheet, or text file.'
  }

  return ''
}

export function validateRfqForm(rawPayload) {
  const formData = normalizeRfqPayload(rawPayload)
  const errors = {}

  if (!formData.companyName) errors.companyName = 'Please enter your company name.'
  if (!formData.contactName) errors.contactName = 'Please enter your contact name.'

  if (!formData.email) {
    errors.email = 'Please enter your email address.'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (formData.phone && formData.phone.length < 6) {
    errors.phone = 'Please enter a valid phone or WhatsApp number.'
  }

  if (!formData.productRequired) {
    errors.productRequired = 'Please describe the product required.'
  }

  if (!formData.quantity) {
    errors.quantity = 'Please enter the required quantity.'
  }

  if (!formData.deliveryCountry) {
    errors.deliveryCountry = 'Please enter the delivery country.'
  }

  if (formData.targetDeliveryDate && Number.isNaN(Date.parse(formData.targetDeliveryDate))) {
    errors.targetDeliveryDate = 'Please enter a valid target delivery date.'
  }

  const attachmentError = validateAttachment(rawPayload?.attachment)
  if (attachmentError) {
    errors.attachment = attachmentError
  }

  return { errors, formData }
}
