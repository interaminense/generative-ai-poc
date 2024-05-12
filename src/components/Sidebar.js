import React from "react";
import schema from "../utils/schema.json";

export function Sidebar({ table }) {
  return (
    <div className="sidebar sidebar-dark">
      <div className="sidebar-body p-5">
        <h2 className="mb-5">Info for nerds</h2>

        <h4>Google Cloud Project ID</h4>
        <p>{process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID}</p>

        <h4>Project ID</h4>
        <p>{process.env.REACT_APP_PROJECT_ID}</p>

        <h4>Dataset ID</h4>
        <p>{process.env.REACT_APP_DATASET_ID}</p>

        <h4>Table ID</h4>
        <p>{process.env.REACT_APP_TABLE_ID}</p>

        <h4>Table Schema</h4>
        <pre className="bg-primary text-white p-4 rounded">
          {JSON.stringify(schema, null, 2)}
        </pre>
      </div>
    </div>
  );
}
