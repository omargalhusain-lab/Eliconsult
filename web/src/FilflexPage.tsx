import type { CSSProperties } from "react";
import InquiryForm from "./components/InquiryForm";
import Logo from "./components/Logo";
import filflexLoginIcon from "./assets/filflex-login-icon.svg";
import heroDubaiNight from "./assets/site-assets/hero-dubai-night.jpg";

const requestFields = [
  {
    name: "fullName",
    label: "Full Name *",
    placeholder: "Your Full Name",
    required: true,
    span: "full" as const,
  },
  {
    name: "company",
    label: "Company Name *",
    placeholder: "Your Company",
    required: true,
    span: "full" as const,
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
    label: "Phone Number *",
    placeholder: "+971 xx xxx xxx",
    required: true,
    type: "tel",
  },
  {
    name: "business",
    label: "Nature of Business",
    placeholder: "Brokerage, developer, investor...",
    span: "full" as const,
  },
  {
    name: "location",
    label: "Location",
    placeholder: "City, Country",
    span: "full" as const,
  },
];

type AssetStyle = CSSProperties & Record<`--${string}`, string>;

function cssUrl(src: string) {
  return `url("${src}")`;
}

export default function FilflexPage() {
  return (
    <main
      className="access-page"
      style={{ "--access-bg": cssUrl(heroDubaiNight) } as AssetStyle}
    >
      <header className="site-nav access-site-nav" aria-label="FILFLEX navigation">
        <Logo href="../" />
        <nav>
          <a href="../#home">Home</a>
          <a href="../#about">About Us</a>
          <a href="../#services">Services</a>
          <a href="../#contact">Contact Us</a>
        </nav>
        <a className="login-pill" href="#access-form">
          Login to
          <span aria-hidden="true">
            <img src={filflexLoginIcon} alt="" />
          </span>
        </a>
      </header>

      <section className="access-hero">
        <div className="access-card access-card--intro">
          <img
            className="access-card-logo"
            src={filflexLoginIcon}
            alt="FILFLEX"
          />
          <a className="access-card-badge" href="#access-form">
            Search Easier, Close Faster
          </a>
          <p>
            FILFLEX is our proprietary smart property-search engine for
            corporate real estate teams. Submit your details below and our team
            will contact you within 24 hours to set up your access.
          </p>
          <ul>
            <li>Unified developer inventory in one platform</li>
            <li>Advanced filtering by unit type, size, price &amp; more</li>
            <li>Real-time accuracy for confident decisions</li>
            <li>Instant side-by-side unit comparisons</li>
          </ul>
        </div>

        <div className="access-card access-card--form" id="access-form">
          <h1>Request <span>Access</span></h1>
          <p>Fill in your details and we&apos;ll get back to you shortly.</p>
          <InquiryForm
            buttonLabel="Submit Request"
            compact
            fields={requestFields}
            formType="filflex_access"
            successMessage="Request received. Our team will contact you within 24 hours."
          />
          <span className="access-note">
            Our team will contact you within 24 hours to set up your FILFLEX
            access.
          </span>
        </div>
      </section>
    </main>
  );
}
