# Qantara

Marketing site for Qantara, built with React and Vite, and deployed on Vercel.

## Local development

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

## RFQ email flow

The RFQ form now posts to the Vercel serverless route at `/api/rfq`, which sends the submission through Resend.

### Required environment variables

Create a local `.env` if you want the values available in development, and add the same variables in your Vercel project settings:

```bash
RESEND_API_KEY=your_resend_api_key
RFQ_FROM_EMAIL=Qantara RFQ <rfq@yourdomain.com>
RFQ_TO_EMAIL=info@qantara.uk
```

Notes:

- `RFQ_FROM_EMAIL` must use a sender address/domain verified in Resend.
- `RFQ_TO_EMAIL` is the inbox that should receive quote requests.
- The current upload field is still a placeholder text field, not a real file upload.

### Vercel setup

1. In Resend, create an API key.
2. Verify the sending domain or sender address you want to use.
3. In Vercel, open your project settings and add `RESEND_API_KEY`, `RFQ_FROM_EMAIL`, and `RFQ_TO_EMAIL`.
4. Redeploy the project.

## Production build

```bash
npm run build
```
