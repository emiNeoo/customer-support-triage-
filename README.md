# customer-support-triage-

AI-powered customer support triage system for banking customer support tickets. The system validates incoming tickets, classifies them using AI and rule-based fallback logic, routes them to the correct support destination, sends Slack notifications for technical/high-priority issues, and stores full ticket metadata in Google Sheets.

## HW3 Modifications

For the HW3 requirements, the following file was modified:

* **`main.py`**:
    * Updated `TicketPayload` fields to `name`, `email`, and `message`.
    * Added `validate_input()` to check missing fields and invalid email format.
    * Invalid tickets are not deleted; they are saved with `validation_status = "Invalid"` and `validation_errors`.
    * Updated Groq AI classification to classify banking tickets into `billing`, `fraud`, `loan`, `card_issue`, `technical`, and `general`.
    * Added rule-based fallback logic for reliable fraud and technical issue detection.
    * Added routing rules:
        * `fraud` → fraud/security team
        * `billing` → finance team
        * `loan` → loan department
        * `card_issue` → card support
        * `technical` → technical support
        * `general` → shared inbox
    * Integrated Slack notification for technical support issues.
    * Integrated Google Sheets storage for all ticket records.
    * Added `delivery_status` tracking as `success`, `failed`, or `none`.
    * Stored full metadata in Google Sheets:
      `timestamp`, `name`, `email`, `message`, `validation_status`, `validation_errors`, `category`, `priority`, `route`, `delivery_status`.

## Security Note

The actual `.env` file and `credentials.json` file are not pushed to GitHub for security reasons.  
Use `.env.example` as a template and add local credentials manually.
