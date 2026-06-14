type LogoProps = {
  href?: string;
  light?: boolean;
};

export default function Logo({ href = "./", light = false }: LogoProps) {
  return (
    <a className={light ? "brand brand--light" : "brand"} href={href}>
      <span className="brand-mark" aria-hidden="true">
        <span>e</span>
        <span>c</span>
      </span>
      <span className="brand-text">
        <strong>Eliconsult</strong>
        <small>Real Estate</small>
      </span>
    </a>
  );
}
