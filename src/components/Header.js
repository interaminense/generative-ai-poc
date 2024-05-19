import ClayIcon from "@clayui/icon";
import ClayButton from "@clayui/button";
import { useAppContext } from "../AppContext";

export function Header() {
  const { dispatch } = useAppContext();

  return (
    <div className="header">
      <div>
        <ClayIcon symbol="ac-logo" style={{ marginTop: "-6px" }} />
        <h1 className="d-inline-block ml-2">Generative AI POC</h1>
      </div>

      <ClayButton
        onClick={() => {
          dispatch({
            type: "TOOGLE_SIDEBAR",
            payload: true,
          });
        }}
        aria-label="details"
        borderless
        displayType="secondary"
      >
        <ClayIcon symbol="bars" />
      </ClayButton>
    </div>
  );
}
