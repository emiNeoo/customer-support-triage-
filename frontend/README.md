# Customer Support Triage UI

React + Vite frontend for the existing FastAPI customer support triage backend.

## What it changes

Only adds a separate `frontend/` app. It does not change `main.py`, API routes, Slack, SMTP, Groq, or Google Sheets logic.

## API contract

The UI sends this payload to `POST /api/ticket`:

```json
{
  "name": "Jane Cooper",
  "email": "jane@example.com",
  "message": "I see an unknown transaction on my card."
}
```

It then displays these response fields:

- `validation_status`
- `validation_errors`
- `category_assigned`
- `priority_assigned`
- `route`
- `delivery_status`
- `action_taken`

## Run backend

From the repo root:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend should run at:

```text
http://127.0.0.1:8000
```

## Run frontend

From this `frontend/` folder:

```bash
npm install
npm run dev
```

Frontend should run at:

```text
http://localhost:5173
```

## Why no CORS backend change is needed

During development, `vite.config.js` proxies `/api` requests to `http://127.0.0.1:8000`. The React app calls `/api/ticket`, and Vite forwards it to FastAPI.
