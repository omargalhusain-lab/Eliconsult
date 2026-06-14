import Link from "next/link";
import InquiryForm from "./components/InquiryForm";
import Logo from "./components/Logo";

const stats = [
  ["500+", "Corporate Partners"],
  ["10K+", "Units Listed"],
  ["50+", "Developer Partners"],
  ["98%", "Client Satisfaction"],
];

const pillars = [
  {
    title: "Strategic Advisory",
    text: "Expert guidance for corporate real estate decisions across the UAE market.",
    icon: "building",
  },
  {
    title: "Market Intelligence",
    text: "Data-driven insights to power confident property investment strategies.",
    icon: "chart",
  },
  {
    title: "B2B Partnerships",
    text: "Tailored solutions for developers, brokerages, and institutional clients.",
    icon: "network",
  },
  {
    title: "Trust & Integrity",
    text: "Transparent consultancy built on measurable value and lasting relationships.",
    icon: "shield",
  },
];

const values = [
  {
    title: "Integrity",
    text: "We uphold the highest standards of honesty and transparency in every engagement.",
    icon: "shield",
  },
  {
    title: "Data-Driven",
    text: "Every recommendation is backed by thorough market analysis and accurate intelligence.",
    icon: "analytics",
  },
  {
    title: "Partnership",
    text: "We build lasting relationships based on mutual trust, respect, and shared success.",
    icon: "handshake",
  },
  {
    title: "Innovation",
    text: "We leverage technology like FILFLEX to bring efficiency and clarity to real estate.",
    icon: "spark",
  },
];

const contactFields = [
  {
    name: "fullName",
    label: "Full Name *",
    placeholder: "Your Full Name",
    required: true,
  },
  {
    name: "email",
    label: "Email Address *",
    placeholder: "your@email.com",
    required: true,
    type: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "+971 xx xxx xxx",
    type: "tel",
  },
  {
    name: "subject",
    label: "Subject",
    placeholder: "How Can We Help ?",
  },
];

const serviceItems = [
  "Strategic positioning and competitive analysis",
  "Tailored messaging for corporate audiences",
  "Market intelligence and developer insights integration",
  "FILFLEX-powered property discovery for corporate teams",
  "Partnership strengthening and sales team support",
];

const trainingItems = [
  "Comprehensive modules on master communities and developer portfolios",
  "Project specifications, unit mixes, and payment plans",
  "Sales-focused and strategic positioning presentations",
  "Staff onboarding and internal knowledge enhancement",
  "Real-time unit access via FILFLEX during sessions",
];

const filflexItems = [
  "Unified developer inventory - access property data from multiple developers in one place",
  "Advanced filtering - search by unit type, size, layout, price, and availability",
  "Instant side-by-side comparisons for faster decision-making",
  "Real-time updated data for maximum accuracy",
  "Reduced manual search time and eliminated developer back-and-forth",
];

function Icon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      {name === "building" ? (
        <>
          <path {...common} d="M8 26V8l8-3 8 3v18" />
          <path {...common} d="M5 26h22M12 12h2M18 12h2M12 17h2M18 17h2M15 26v-5h2v5" />
        </>
      ) : null}
      {name === "chart" ? (
        <>
          <path {...common} d="M6 24h20M9 20v-6M16 20V8M23 20v-9" />
          <path {...common} d="m8 13 5-4 4 3 6-6" />
        </>
      ) : null}
      {name === "network" ? (
        <>
          <circle {...common} cx="16" cy="9" r="4" />
          <circle {...common} cx="9" cy="22" r="4" />
          <circle {...common} cx="23" cy="22" r="4" />
          <path {...common} d="m14 13-3 5M18 13l3 5M13 22h6" />
        </>
      ) : null}
      {name === "shield" ? (
        <>
          <path {...common} d="M16 4 7 8v7c0 6 4 10 9 13 5-3 9-7 9-13V8l-9-4Z" />
          <path {...common} d="m12 16 3 3 6-7" />
        </>
      ) : null}
      {name === "analytics" ? (
        <>
          <path {...common} d="M8 22 14 12l4 5 6-9" />
          <path {...common} d="M8 22h16M8 22v-4M14 22v-7M20 22v-5M24 22V8" />
        </>
      ) : null}
      {name === "handshake" ? (
        <>
          <path {...common} d="M7 17 13 11l5 5 2-2 5 5-5 5-4-4-3 3-6-6Z" />
          <path {...common} d="m13 11 3-3 4 4M12 18l4 4M16 16l5 5" />
        </>
      ) : null}
      {name === "spark" ? (
        <>
          <path {...common} d="M16 4v8M16 20v8M4 16h8M20 16h8" />
          <path {...common} d="m8 8 5 5M19 19l5 5M24 8l-5 5M13 19l-5 5" />
        </>
      ) : null}
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <header className="site-nav" aria-label="Primary navigation">
          <Logo />
          <nav>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact Us</a>
          </nav>
          <Link className="login-pill" href="/filflex">
            Login to
            <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <div className="hero-image" />
        <div className="hero-copy">
          <h1>Empowering Smart Real Estate Decisions, B2B Real Estate Consultancy</h1>
          <p>
            Strategic advisory, market intelligence, and tailored solutions for
            corporate clients, developers, and institutional partners.
          </p>
        </div>
      </section>

      <section className="stats-band" aria-label="Eliconsult impact statistics">
        {stats.map(([value, label]) => (
          <div className="stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section section--light" id="about">
        <div className="section-heading">
          <p>Why Eliconsult</p>
          <h2>Corporate Real Estate, Redefined</h2>
        </div>
        <div className="card-grid">
          {pillars.map((pillar) => (
            <article className="info-card" key={pillar.title}>
              <div className="icon-disc">
                <Icon name={pillar.icon} />
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-bg" />
        <div className="story-content">
          <div className="story-copy">
            <p className="section-label">Our Story</p>
            <h2>Specialized B2B Real Estate Consultancy</h2>
            <p>
              Eliconsult is a specialized B2B real estate consultancy supporting
              corporate clients, developers, investment firms, and institutional
              partners across the region. Based in Dubai, we provide strategic
              advisory services, market intelligence, and tailored solutions
              designed to help businesses make informed, data-driven real estate
              decisions.
            </p>
            <p>
              To enhance efficiency for our partners, we developed FILFLEX, a
              smart digital portal that streamlines the process of locating
              specific units across all major developers. FILFLEX enables
              corporate teams to filter, compare, and access property data
              instantly, improving accuracy, speed, and operational productivity.
            </p>
            <p>
              Our expertise spans residential and commercial project analysis,
              developer coordination, portfolio evaluation, and corporate
              acquisition strategies. We work exclusively with businesses,
              offering structured insights and professional guidance that align
              with organizational goals and long-term investment strategies.
            </p>
            <p>
              At Eliconsult, we believe that real estate advisory should be
              transparent, analytical, and results-driven. Our commitment is to
              build strong, lasting partnerships based on trust, expertise, and
              measurable value.
            </p>
          </div>
          <div className="statement-stack">
            <article>
              <div className="icon-disc">
                <Icon name="analytics" />
              </div>
              <div>
                <h3>Vision Statement</h3>
                <p>
                  To become the region&apos;s most trusted real estate consultancy by
                  delivering transparent guidance, data-driven insights, and
                  exceptional value that empowers clients to make confident
                  property decisions.
                </p>
              </div>
            </article>
            <article>
              <div className="icon-disc">
                <Icon name="handshake" />
              </div>
              <div>
                <h3>Mission Statement</h3>
                <p>
                  Our mission is to simplify real estate for investors,
                  homeowners, and developers by providing expert advisory
                  services, accurate market intelligence, and personalized
                  solutions. We are committed to integrity, professionalism, and
                  long-term client success in every transaction.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="section-heading section-heading--dark">
          <p>What Drives Us</p>
          <h2>Our Core Values</h2>
          <span>
            The principles that guide every partnership, decision, and
            recommendation we make.
          </span>
        </div>
        <div className="card-grid">
          {values.map((value) => (
            <article className="info-card info-card--dark" key={value.title}>
              <div className="icon-disc icon-disc--solid">
                <Icon name={value.icon} />
              </div>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--light services" id="services">
        <div className="section-heading">
          <p>What We Offer</p>
          <h2>Our Services</h2>
        </div>

        <article className="service-row">
          <img
            alt="Corporate real estate strategy meeting overlooking Dubai"
            src="/site-assets/marketing-meeting.png"
          />
          <div>
            <h3>Real Estate Marketing</h3>
            <p>
              Eliconsult specializes in B2B real estate marketing designed
              exclusively for corporate clients, developers, investment firms,
              and institutional partners. Our approach focuses on delivering
              structured, data-driven marketing solutions that support
              large-scale decision-making and enhance the visibility of real
              estate projects across the professional ecosystem.
            </p>
            <ul>
              {serviceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="service-row service-row--reverse">
          <div>
            <h3>UAE Project Training &amp; Presentation</h3>
            <p>
              Eliconsult provides specialized UAE Project Training and
              Presentation services designed exclusively for corporate teams,
              brokerages, investment firms, and real estate professionals. Our
              training programs deliver structured, developer-aligned knowledge
              that empowers organizations to confidently present, promote, and
              sell major UAE real estate projects.
            </p>
            <ul>
              {trainingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <img
            alt="Corporate team reviewing a real estate development model"
            src="/site-assets/training-model.jpg"
          />
        </article>

        <article className="service-row filflex-row">
          <div className="filflex-card">
            <Logo />
            <Link href="/filflex">Search Easier, Close Faster</Link>
          </div>
          <div>
            <h3>FILFLEX: Smart Property-Search Engine</h3>
            <p>
              FILFLEX is a proprietary digital platform developed by Eliconsult
              to streamline and accelerate property discovery for corporate
              clients. Built specifically for B2B use, FILFLEX centralizes
              inventory from all major developers, allowing businesses to locate
              specific units with unmatched speed and accuracy.
            </p>
            <ul>
              {filflexItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-heading">
          <p>Reach Out</p>
          <h2>Let&apos;s Start a Conversation</h2>
          <span>
            Whether you&apos;re looking for strategic advisory, market intelligence,
            or want to explore FILFLEX, our team is ready to assist.
          </span>
        </div>
        <InquiryForm
          buttonLabel="Submit Request"
          fields={contactFields}
          messageField={{
            name: "message",
            label: "Message *",
            placeholder: "Tell us about your requirements...",
            required: true,
          }}
          successMessage="Thank you. Your request is ready for the Eliconsult team."
        />
      </section>

      <section className="technology-cta">
        <div>
          <p>Powered By Technology</p>
          <h2>Discover FILFLEX</h2>
          <span>
            Our proprietary smart property-search engine that centralizes
            developer inventory and enables instant unit discovery for corporate
            teams.
          </span>
          <Link href="/filflex">Login to FILFLEX</Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>
              Specialized B2B real estate consultancy delivering strategic
              advisory services and market intelligence across the region.
            </p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact Us</a>
          </div>
          <div>
            <h3>Services</h3>
            <a href="#services">Real Estate Marketing</a>
            <a href="#services">UAE Project Training</a>
            <Link href="/filflex">FILFLEX Platform</Link>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:info@eliconsult.com">info@eliconsult.com</a>
            <a href="tel:+97140000000">+971 4 000 0000</a>
            <span>Dubai, United Arab Emirates</span>
          </div>
        </div>
        <div className="footer-credit">Created by Marketing Solutions</div>
      </footer>
    </main>
  );
}
