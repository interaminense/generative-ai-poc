import ClayIcon from "@clayui/icon";

export function Header() {
  return (
    <div className="header">
      <ClayIcon symbol="ac-logo" style={{ marginTop: "-6px" }} />
      <h1 className="d-inline-block ml-2">AC AI Experimental POC 2.0</h1>
    </div>
  );
}
