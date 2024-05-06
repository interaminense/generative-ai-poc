import ClayIcon from "@clayui/icon";
import ClayPanel from "@clayui/panel";
import ClayButton from "@clayui/button";

export function Panel({ title, children }) {
  return (
    <>
      <ClayPanel className="panel sheet m-0 p-0" displayTitle={title}>
        <ClayPanel.Body>{children}</ClayPanel.Body>
      </ClayPanel>

      <div className="d-flex justify-content-end mt-3">
        <ClayButton
          aria-label="Download CSV"
          data-tooltip-align="top"
          title="Download CSV"
          size="xs"
          displayType="secondary"
          disabled
          className="ml-2"
        >
          <ClayIcon symbol="download" />
        </ClayButton>
        <ClayButton
          aria-label="Regenerate"
          data-tooltip-align="top"
          title="Regenerate"
          size="xs"
          displayType="secondary"
          disabled
          className="ml-2"
        >
          <ClayIcon symbol="reload" />
        </ClayButton>
        <ClayButton
          aria-label="Report Issue"
          data-tooltip-align="top"
          title="Report Issue"
          size="xs"
          displayType="secondary"
          disabled
          className="ml-2"
        >
          <ClayIcon symbol="thumbs-down" />
        </ClayButton>
      </div>
    </>
  );
}
