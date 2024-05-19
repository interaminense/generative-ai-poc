import React from "react";
import { TABLE } from "../utils/constants";
import ClayIcon from "@clayui/icon";
import ClayButton from "@clayui/button";
import { useAppContext } from "../AppContext";

export function Sidebar() {
  const { dispatch } = useAppContext();

  return (
    <div className="sidebar sidebar-dark p-4">
      <div className="sidebar-header">
        <div className="autofit-row sidebar-section">
          <div className="autofit-col autofit-col-expand">
            <div className="component-title">
              <h3>AI Context</h3>
            </div>
          </div>

          <div className="autofit-col">
            <ClayButton
              onClick={() => {
                dispatch({
                  type: "TOOGLE_SIDEBAR",
                  payload: false,
                });
              }}
              aria-label="Close"
              className="close"
              type="button"
            >
              <ClayIcon symbol="times" />
            </ClayButton>
          </div>
        </div>
      </div>

      <div className="sidebar-body">
        <h4>Google Cloud Project ID</h4>
        <p>{process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID}</p>

        <h4>Project ID</h4>
        <p>{process.env.REACT_APP_PROJECT_ID}</p>

        <h4>Dataset ID</h4>
        <p>{process.env.REACT_APP_DATASET_ID}</p>

        <h4>Table ID</h4>
        <p>{TABLE.id}</p>

        <h4>Table Schema</h4>
        <pre className="bg-primary text-white p-4 rounded table-schema">
          {JSON.stringify(TABLE.schema, null, 2)}
        </pre>
      </div>
    </div>
  );
}
