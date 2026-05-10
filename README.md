# customer-support-triage-
AI-powered customer support triage system that categorizes and routes incoming tickets to specific channels (Slack/Email) using FastAPI.

## HW3 Modifications
For the HW3 requirements, the following file was modified:

*   **`main.py`**:
    *   Updated `TicketPayload` fields to `name, email, message` (keeping the existing JSON input format).
    *   Added `validate_input()` to check for missing fields and invalid emails, returning `validation_errors`. Invalid tickets bypass AI and route with `validation_status = "Invalid"`.
    *   Updated the Groq AI classification to categorize tickets into `billing, fraud, loan, card_issue, technical, general` and priorities into `low, medium, high`.
    *   Added a strong rule-based fraud fallback right before AI classification to catch specific banking risk keywords (e.g., stolen, hacked, duplicate charge).
    *   Updated the routing rules to map tickets to specific departments (`fraud/security team`, `finance team`, `loan department`, `card support`, `technical support`, `shared inbox`).
    *   Added tracking for `delivery_status` ("success", "failed", or "none") based on the simulated delivery actions.
    *   Added comprehensive metadata logging containing all Google Sheets required fields (timestamp, name, email, message, validation_status, validation_errors, category, priority, route, delivery_status).

**Note:** The actual Google Sheets connection is simulated to avoid crashing without credentials. The required `credentials.json` file handles service account authentication and must **never** be pushed to source control for security.
