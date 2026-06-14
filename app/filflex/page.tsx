import Link from "next/link";
import InquiryForm from "../components/InquiryForm";
import Logo from "../components/Logo";

const requestFields = [
  {
    name: "fullName",
    label: "Full Name *",
    placeholder: "Your Full Name",
    required: true,
  },
  {
    name: "company",
    label: "Company Name *",
    placeholder: "Your Company",
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
    label: "Phone Number *",
    placeholder: "+971 xx xxx xxx",
    required: true,
    type: "tel",
  },
  {
    name: "business",
    label: "Nature of Business",
    placeholder: "Brokerage, developer, investor...",
  },
  {
    name: "location",
    label: "Location",
    placeholder: "City, Country",
  },
];

export default function FilflexPage() {
  return (
    <main className="access-page">
      <header className="access-nav">
        <Logo light />
        <Link href="/">Back to Eliconsult</Link>
      </header>

      <section className="access-hero">
        <div className="access-panel access-panel--intro">
          <Logo light />
          <h1>Search Easier, Close Faster</h1>
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

        <div className="access-panel access-panel--form">
          <h2>Request Access</h2>
          <p>Fill in your details and we&apos;ll get back to you shortly.</p>
          <InquiryForm
            buttonLabel="Submit Request"
            compact
            fields={requestFields}
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
