import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={light ? "brand brand--light" : "brand"} href="/">
      <span className="brand-mark" aria-hidden="true">
        <span>e</span>
        <span>c</span>
      </span>
      <span className="brand-text">
        <strong>Eliconsult</strong>
        <small>Real Estate</small>
      </span>
    </Link>
  );
}
