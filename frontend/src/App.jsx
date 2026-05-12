import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageSquareText,
  RefreshCcw,
  Route,
  ShieldAlert,
  Sparkles,
  UserRound,
  WalletCards,
  Zap
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const initialForm = {
  name: '',
  email: '',
  message: ''
};

const examples = [
  {
    label: 'Fraud',
    icon: ShieldAlert,
    message: 'I see an unknown transaction on my card and I think my account may be hacked.'
  },
  {
    label: 'Technical',
    icon: Zap,
    message: 'The mobile app keeps crashing and I cannot login after the latest update.'
  },
  {
    label: 'Billing',
    icon: WalletCards,
    message: 'I was charged twice for my last payment and need help with billing.'
  },
  {
    label: 'General',
    icon: MessageSquareText,
    message: 'I need help understanding how to update my contact information.'
  }
];

const responseFields = [
  ['validation_status', 'Validation'],
  ['category_assigned', 'Category'],
  ['priority_assigned', 'Priority'],
  ['route', 'Route'],
  ['delivery_status', 'Delivery']
];

function getBadgeClass(value = '') {
  const safe = String(value).toLowerCase();

  if (safe.includes('valid') && !safe.includes('invalid')) return 'badge badgeSuccess';
  if (safe.includes('invalid') || safe.includes('failed')) return 'badge badgeDanger';
  if (safe.includes('high') || safe.includes('fraud')) return 'badge badgeDanger';
  if (safe.includes('medium') || safe.includes('technical')) return 'badge badgeWarning';
  if (safe.includes('success')) return 'badge badgeSuccess';
  if (safe.includes('none')) return 'badge badgeMuted';

  return 'badge';
}

function prettify(value) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'None';
  if (value === null || value === undefined || value === '') return '—';
  return String(value).replaceAll('_', ' ');
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState(null);

  const characterCount = form.message.trim().length;

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.email.trim() && form.message.trim() && !isSubmitting;
  }, [form, isSubmitting]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function applyExample(example) {
    setForm((current) => ({
      ...current,
      message: example.message
    }));
    setResult(null);
    setError('');
  }

  function resetForm() {
    setForm(initialForm);
    setResult(null);
    setError('');
    setLastSubmittedAt(null);
  }

  async function submitTicket(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim()
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.detail || `Request failed with status ${response.status}`);
      }

      setResult(data);
      setLastSubmittedAt(new Date());
    } catch (requestError) {
      setError(requestError.message || 'Ticket could not be submitted.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="appShell">
      <section className="heroPanel">
        <div className="heroCopy">
          <div className="eyebrow">
            <Sparkles size={16} />
            AI Support Triage Console
          </div>
          <h1>Customer Support Ticket Routing</h1>
          <p>
            Submit a customer message, send it to the existing FastAPI endpoint, and view validation,
            classification, priority, route and delivery status in a clean operator dashboard.
          </p>
        </div>
      </section>

      <section className="gridLayout">
        <form className="ticketCard" onSubmit={submitTicket}>
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">New Ticket</p>
              <h2>Create support request</h2>
            </div>
            <button className="ghostButton" type="button" onClick={resetForm}>
              <RefreshCcw size={16} />
              Reset
            </button>
          </div>

          <div className="inputGrid">
            <label className="fieldGroup">
              <span>
                <UserRound size={16} />
                Customer name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Jane Cooper"
                autoComplete="name"
              />
            </label>

            <label className="fieldGroup">
              <span>
                <Mail size={16} />
                Email address
              </span>
              <input
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder="jane@example.com"
                autoComplete="email"
                inputMode="email"
              />
            </label>
          </div>

          <label className="fieldGroup messageField">
            <span>
              <MessageSquareText size={16} />
              Customer message
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              placeholder="Describe the customer support issue..."
              rows={8}
            />
            <small>{characterCount} characters</small>
          </label>

          <div className="exampleRow">
            {examples.map((example) => {
              const ExampleIcon = example.icon;
              return (
                <button key={example.label} type="button" onClick={() => applyExample(example)}>
                  <ExampleIcon size={15} />
                  {example.label}
                </button>
              );
            })}
          </div>

          <button className="submitButton" type="submit" disabled={!canSubmit}>
            {isSubmitting ? (
              <>
                <Loader2 className="spin" size={18} />
                Sending ticket
              </>
            ) : (
              <>
                Submit ticket
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <aside className="resultPanel">
          <div className="cardHeader compactHeader">
            <div>
              <p className="sectionLabel">Live Response</p>
              <h2>Triage result</h2>
            </div>
            <Clock size={18} />
          </div>

          {!result && !error && (
            <div className="emptyState">
              <div className="emptyIcon">
                <Route size={30} />
              </div>
              <h3>No ticket submitted yet</h3>
              <p>The API response will appear here after the form is submitted.</p>
            </div>
          )}

          {error && (
            <div className="errorState">
              <AlertCircle size={24} />
              <div>
                <h3>Connection error</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="resultContent">
              <div
                className={`successBanner ${String(result.delivery_status).toLowerCase() === 'failed' ? 'dangerBanner' : ''}`}
              >
                {String(result.delivery_status).toLowerCase() === 'failed' ? (
                  <AlertCircle size={22} />
                ) : (
                  <CheckCircle2 size={22} />
                )}
                <div>
                  <strong>{prettify(result.action_taken)}</strong>
                  {lastSubmittedAt && <span>{lastSubmittedAt.toLocaleString()}</span>}
                </div>
              </div>

              <div className="resultGrid">
                {responseFields.map(([key, label]) => (
                  <div className="resultItem" key={key}>
                    <span>{label}</span>
                    <strong className={getBadgeClass(result[key])}>{prettify(result[key])}</strong>
                  </div>
                ))}
              </div>

              <div className="validationBox">
                <span>Validation errors</span>
                <strong>{prettify(result.validation_errors)}</strong>
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
