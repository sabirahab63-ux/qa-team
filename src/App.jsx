import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const EMAIL = "qanda1team@gmail.com";

// ▼▼▼ EDIT THESE THREE LINES with your real EmailJS values (keep the quotes) ▼▼▼
const EMAILJS_SERVICE_ID = "service_nx2o5hm";
const EMAILJS_TEMPLATE_ID = "template_66jm0ef";
const EMAILJS_PUBLIC_KEY = "ANV76fqUgMemI6ukp";
// ▲▲▲ These three values are safe to be public ▲▲▲

const services = [
  {
    title: "Proposal Writing and Development",
    text: "Crafting compliant, compelling, and competitive proposals in response to RFPs, RFQs, and RFIs.",
  },
  {
    title: "Business Development and Capture",
    text: "Identifying pertinent opportunities, advancing capture activities, shaping pursuit strategies, and positioning clients advantageously for forthcoming procurements.",
  },
  {
    title: "Teaming Partner Identification",
    text: "Identifying and evaluating prospective teaming partners to close capability gaps and fortify proposals.",
  },
  {
    title: "Contract Vehicle Support",
    text: "Guiding clients in identifying and onboarding to relevant government contract vehicles, unlocking access to additional federal and state contracting opportunities.",
  },
  {
    title: "Opportunity Management",
    text: "Supporting opportunity tracking, bid/no-bid assessments, solicitation analysis, compliance reviews, and proposal planning.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Identify",
    text: "Identify and qualify the right opportunities for your organization.",
  },
  {
    number: "02",
    title: "Capture",
    text: "Develop the customer understanding, pursuit strategy, and teaming needed to pursue the opportunity.",
  },
  {
    number: "03",
    title: "Develop",
    text: "Build a clear, compliant, and persuasive proposal response.",
  },
  {
    number: "04",
    title: "Submit",
    text: "Bring everything together for a polished and submission-ready final response.",
  },
];

const team = [
  {
    name: "Ariel",
    role: "Proposal Lead",
    text: "Directs proposal development activities, orchestrates the composition of proposal content, safeguards adherence to every solicitation requirement, and stewards the proposal process with rigor through to submission.",
  },
  {
    name: "Carrie",
    role: "Proposal Lead",
    text: "Guides proposal development efforts, coordinates and refines proposal content, ensures meticulous compliance with solicitation requirements, and governs the development process with discipline from inception to submission.",
  },
  {
    name: "Ira",
    role: "Business Development Manager",
    text: "Leads business development and capture activities, including opportunity identification, client engagement, contract vehicle strategy, and the cultivation of strategic teaming relationships.",
  },
];

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Get in touch" },
];

const tickerItems = [
  "Proposal Writing",
  "Business Development & Capture",
  "Teaming Partner Identification",
  "Contract Vehicle Support",
  "Opportunity Management",
  "RFP",
  "RFQ",
  "RFI",
];

const emptyForm = { name: "", email: "", message: "", website: "" };

const isConfigured =
  !EMAILJS_SERVICE_ID.startsWith("PASTE") &&
  !EMAILJS_TEMPLATE_ID.startsWith("PASTE") &&
  !EMAILJS_PUBLIC_KEY.startsWith("PASTE");

/* Cursor-following glow on cards */
const trackGlow = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

/* Word-by-word headline reveal */
function Words({ text, start = 0 }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="word-wrap">
        <span className="word" style={{ "--i": start + i }}>
          {word}
        </span>
      </span>{" "}
    </span>
  ));
}

/* Animated counter */
function CountUp({ end }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setValue(end);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const startTime = performance.now();
        const duration = 1400;

        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(end * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{value}</span>;
}

/* Theme: light / dark, remembered in the browser */
function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light",
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.classList.add("theme-anim");
    root.setAttribute("data-theme", next);
    setTheme(next);

    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: theme still works for this visit */
    }

    window.setTimeout(() => root.classList.remove("theme-anim"), 500);
  };

  return [theme, toggleTheme];
}

function ThemeToggle({ theme, onToggle }) {
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <svg
        className="icon-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg
        className="icon-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}

function TickerGroup({ hidden = false }) {
  return (
    <div className="marquee-group" aria-hidden={hidden ? "true" : undefined}>
      {tickerItems.map((item) => (
        <span className="marquee-item" key={item}>
          {item}
          <i />
        </span>
      ))}
    </div>
  );
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setScrolled(root.scrollTop > 24);
      setShowTop(root.scrollTop > 700);
      setProgress(max > 0 ? root.scrollTop / max : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot: bots fill this hidden field. Pretend success and stop.
    if (form.website) {
      setStatus({
        type: "success",
        text: "Thank you. Your inquiry has been sent.",
      });
      setForm(emptyForm);
      return;
    }

    if (!isConfigured) {
      setStatus({
        type: "error",
        text: `The form is not connected yet. Please email ${EMAIL}.`,
      });
      return;
    }

    setSending(true);
    setStatus({ type: "", text: "" });

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          reply_to: form.email,
          message: form.message,
          time: new Date().toLocaleString(),
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );

      setStatus({
        type: "success",
        text: "Thank you. Your inquiry has been sent.",
      });
      setForm(emptyForm);
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus({
        type: "error",
        text: `Your message could not be sent right now. Please email ${EMAIL}.`,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={scrolled ? "navbar scrolled" : "navbar"}>
        <div
          className="progress"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />

        <div className="container nav-inner">
          <a href="#home" className="logo">
            <img src="/assets/logo.jpeg" alt="Q and A Team" />
          </a>

          <nav
            id="primary-nav"
            className={menuOpen ? "nav-links open" : "nav-links"}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button
              type="button"
              className="menu-button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="home">
          <div className="orb orb-one" aria-hidden="true" />
          <div className="orb orb-two" aria-hidden="true" />

          <div className="container hero-grid">
            <div className="hero-content">
              <p className="eyebrow reveal">Q AND A TEAM</p>

              <h1>
                <Words text="From first opportunity to final submission," />
                <span className="accent">
                  <Words text="one integrated team." start={6} />
                </span>
              </h1>

              <p className="hero-text reveal" style={{ "--delay": "0.5s" }}>
                Business development, capture management, proposal development,
                teaming, and contract vehicle support designed to help
                organizations pursue government opportunities with clarity and
                confidence.
              </p>

              <div
                className="hero-buttons reveal"
                style={{ "--delay": "0.65s" }}
              >
                <a href="#contact" className="button primary">
                  Discuss your opportunity
                </a>

                <a href="#services" className="button secondary">
                  Explore services
                </a>
              </div>
            </div>

            <div className="hero-card reveal" style={{ "--delay": "0.4s" }}>
              <img src="/assets/logo.jpeg" alt="Q and A Team logo" />

              <div className="hero-card-line"></div>

              <p>
                Integrated support across the opportunity lifecycle — from
                identification through submission.
              </p>
            </div>
          </div>
        </section>

        <div className="marquee" aria-label="Areas of expertise">
          <div className="marquee-track">
            <TickerGroup />
            <TickerGroup hidden />
          </div>
        </div>

        <section className="stats">
          <div className="container stats-grid">
            <div>
              <strong>
                <CountUp end={3} />
              </strong>
              <span className="stats-label">Specialists</span>
            </div>

            <div>
              <strong>
                <CountUp end={5} />
              </strong>
              <span className="stats-label">Key Support Areas</span>
            </div>

            <div>
              <strong>
                <CountUp end={3} />
              </strong>
              <span className="stats-label">Solicitation Types</span>
            </div>

            <div>
              <strong>
                <CountUp end={1} />
              </strong>
              <span className="stats-label">Integrated Lifecycle</span>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container two-column">
            <div className="section-heading reveal">
              <p className="eyebrow">ABOUT US</p>
              <h2>
                Turning opportunities into organized, thoughtful pursuits.
              </h2>
            </div>

            <div className="section-text reveal" style={{ "--delay": "0.15s" }}>
              <p>
                <strong>Q and A Team</strong> provides comprehensive business
                development, capture management, proposal development, teaming,
                and contract vehicle support for government contracting
                opportunities, including <strong>RFPs, RFQs, and RFIs</strong>.
              </p>

              <p>
                Our experienced{" "}
                <strong>
                  Business Development (BD) and Proposal Development (PD)
                </strong>{" "}
                professionals work in close concert throughout the opportunity
                lifecycle: from identifying and qualifying opportunities,
                through capture and teaming, to proposal development and
                submission.
              </p>
            </div>
          </div>
        </section>

        <section className="section light-section" id="services">
          <div className="container">
            <div className="section-heading centered reveal">
              <p className="eyebrow">KEY AREAS OF SUPPORT</p>
              <h2>Support where it matters most.</h2>
              <p>
                Focused expertise across the key stages of the business
                development and proposal lifecycle.
              </p>
            </div>

            <div className="cards-grid">
              {services.map((service, index) => (
                <article
                  className="service-card glow reveal"
                  key={service.title}
                  style={{ "--delay": `${index * 0.1}s` }}
                  onMouseMove={trackGlow}
                >
                  <span className="card-number">0{index + 1}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="process">
          <div className="container">
            <div className="section-heading centered reveal">
              <p className="eyebrow">OUR PROCESS</p>
              <h2>A clear path from opportunity to submission.</h2>
            </div>

            <div className="process-grid">
              {processSteps.map((step, index) => (
                <div
                  className="process-item reveal"
                  key={step.number}
                  style={{ "--delay": `${index * 0.12}s` }}
                >
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section light-section" id="team">
          <div className="container">
            <div className="section-heading centered reveal">
              <p className="eyebrow">THE TEAM</p>
              <h2>Seasoned expertise, united by a singular purpose.</h2>
              <p>
                Experienced Business Development (BD) and Proposal Development
                (PD) professionals, collaborating through every stage of the
                opportunity lifecycle.
              </p>
            </div>

            <div className="team-grid">
              {team.map((member, index) => (
                <article
                  className="team-card glow reveal"
                  key={member.name}
                  style={{ "--delay": `${index * 0.12}s` }}
                  onMouseMove={trackGlow}
                >
                  <div className="team-avatar" aria-hidden="true">
                    <span>{member.name.charAt(0)}</span>
                  </div>

                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-text">{member.text}</p>
                </article>
              ))}
            </div>

            <p className="team-closing reveal">
              Together, Q and A Team provides an integrated approach to{" "}
              <strong>
                business development, capture, contract vehicle access, teaming,
                and proposal development
              </strong>
              , helping clients strengthen their government contracting pipeline
              and pursue federal and state opportunities with conviction.
            </p>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-content reveal">
              <p className="eyebrow">GET IN TOUCH</p>

              <h2>Let’s discuss your next opportunity.</h2>

              <p>
                Whether you’re pursuing an RFP, RFQ, or RFI, we’d be glad to
                learn more about your opportunity and discuss how our team can
                support you.
              </p>

              <a className="email-link" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>

            <form
              className="contact-form reveal"
              style={{ "--delay": "0.15s" }}
              onSubmit={handleSubmit}
            >
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                How can we help?
                <textarea
                  name="message"
                  rows="6"
                  value={form.message}
                  onChange={handleChange}
                  maxLength={5000}
                  required
                ></textarea>
              </label>

              {/* Honeypot field: hidden from people, filled by spam bots */}
              <div className="hp-field" aria-hidden="true">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="button primary"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send inquiry"}
              </button>

              <p
                className={`form-status ${status.type}`}
                role="status"
                aria-live="polite"
              >
                {status.text}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} Q and A Team. All rights reserved.</p>

          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </footer>

      <a
        href="#home"
        className={showTop ? "to-top show" : "to-top"}
        aria-label="Back to top"
      >
        ↑
      </a>
    </>
  );
}

export default App;
