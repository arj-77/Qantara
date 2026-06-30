export const initialRfqForm = {
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

const fieldLimits = {
  name: 120,
  company: 160,
  email: 160,
  phone: 60,
  country: 120,
  partNumber: 160,
  manufacturer: 160,
  quantity: 60,
  deliveryLocation: 160,
  urgency: 40,
  upload: 280,
  notes: 3000,
}

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

export function validateRfqForm(rawPayload) {
  const formData = normalizeRfqPayload(rawPayload)
  const errors = {}

  if (!formData.name) errors.name = 'Please enter your name.'
  if (!formData.company) errors.company = 'Please enter your company name.'

  if (!formData.email) {
    errors.email = 'Please enter your email address.'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!formData.country) errors.country = 'Please enter your country.'
  if (!formData.partNumber) errors.partNumber = 'Please enter a part number or reference.'
  if (!formData.quantity) errors.quantity = 'Please enter the required quantity.'
  if (!formData.deliveryLocation) {
    errors.deliveryLocation = 'Please enter the required delivery location.'
  }
  if (!formData.urgency) errors.urgency = 'Please select the urgency.'

  return { errors, formData }
}
