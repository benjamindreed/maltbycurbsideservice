const { useState, useMemo } = React;

function formatPhone(v) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0,3)}) ${d.slice(3)}`;
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
}

function todayISO() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

function SignupForm() {
  const [data, setData] = useState({ name: "", address: "", phone: "", email: "", startDate: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  const minDate = useMemo(todayISO, []);

  function update(k, v) {
    setData(d => ({ ...d, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  }

  function validate() {
    const e = {};
    if (!data.name.trim() || data.name.trim().length < 2) e.name = "Please enter your name";
    if (!data.address.trim() || data.address.trim().length < 6) e.address = "Please enter your street address";
    const digits = data.phone.replace(/\D/g, "");
    if (digits.length !== 10) e.phone = "Enter a 10-digit phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email";
    if (!data.startDate) e.startDate = "Pick a start date";
    return e;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setTouched({ name: true, address: true, phone: true, email: true, startDate: true });
    if (Object.keys(e).length === 0) {
      setSubmitted(true);
      const el = document.getElementById("form-root");
      if (el) {
        const top = window.scrollY + el.getBoundingClientRect().top - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }

  function reset() {
    setSubmitted(false);
    setData({ name: "", address: "", phone: "", email: "", startDate: "" });
    setErrors({});
    setTouched({});
  }

  if (submitted) {
    const prettyDate = new Date(data.startDate + "T12:00:00").toLocaleDateString(undefined, {
      weekday: "long", month: "long", day: "numeric"
    });
    return (
      <div className="success">
        <div className="ring">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3>You're on the list, {data.name.split(" ")[0]}!</h3>
        <p>I'll text you within a day to confirm your pickup day and answer any questions. Your first week is free — no payment needed yet.</p>
        <div className="summary">
          <div><span>Address</span><b>{data.address}</b></div>
          <div><span>Phone</span><b>{data.phone}</b></div>
          <div><span>Email</span><b>{data.email}</b></div>
          <div><span>Start date</span><b>{prettyDate}</b></div>
        </div>
        <button className="btn" onClick={reset} style={{marginTop:"12px"}}>
          Submit another <span className="btn-arrow">↗</span>
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Your name <span className="req">*</span></label>
        <input
          id="name" type="text" autoComplete="name" placeholder="Pat Johnson"
          value={data.name} onChange={e => update("name", e.target.value)}
          className={touched.name && errors.name ? "err" : ""}
        />
        {touched.name && errors.name && <span className="err-msg">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="address">Street address <span className="req">*</span></label>
        <input
          id="address" type="text" autoComplete="street-address" placeholder="123 Cedar Lane, Maltby, WA"
          value={data.address} onChange={e => update("address", e.target.value)}
          className={touched.address && errors.address ? "err" : ""}
        />
        {touched.address && errors.address
          ? <span className="err-msg">{errors.address}</span>
          : <span className="hint">So I know where to bring your bins back to.</span>}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="phone">Phone <span className="req">*</span></label>
          <input
            id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(425) 555-0123"
            value={data.phone} onChange={e => update("phone", formatPhone(e.target.value))}
            className={touched.phone && errors.phone ? "err" : ""}
          />
          {touched.phone && errors.phone && <span className="err-msg">{errors.phone}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email <span className="req">*</span></label>
          <input
            id="email" type="email" autoComplete="email" placeholder="you@email.com"
            value={data.email} onChange={e => update("email", e.target.value)}
            className={touched.email && errors.email ? "err" : ""}
          />
          {touched.email && errors.email && <span className="err-msg">{errors.email}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="startDate">When would you like to start? <span className="req">*</span></label>
        <input
          id="startDate" type="date" min={minDate}
          value={data.startDate} onChange={e => update("startDate", e.target.value)}
          className={touched.startDate && errors.startDate ? "err" : ""}
        />
        {touched.startDate && errors.startDate
          ? <span className="err-msg">{errors.startDate}</span>
          : <span className="hint">Pick any day — I'll align it to your next pickup.</span>}
      </div>

      <div className="submit-row">
        <button className="btn btn-lg" type="submit">
          Sign me up <span className="btn-arrow">↗</span>
        </button>
        <div className="reassure">First week free. No payment today. I'll text you to confirm.</div>
      </div>
    </form>
  );
}

ReactDOM.createRoot(document.getElementById("form-root")).render(<SignupForm />);
