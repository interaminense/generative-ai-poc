import ClayDropDown from "@clayui/drop-down";
import ClayButton from "@clayui/button";
import React from "react";
const { useEffect, useState } = require("react");

export function Sidebar({ onChange }) {
  const [tableList, setTableList] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/bigquery-table-list")
      .then((response) => response.json())
      .then((data) => {
        setTableList(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div
      className="sidebar sidebar-dark"
      style={{ width: 500, position: "fixed", height: "100%" }}
    >
      <div className="sidebar-body p-5">
        <h4>Google Cloud Project ID</h4>
        <p>{process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID}</p>

        <h4>Project ID</h4>
        <p>{process.env.REACT_APP_PROJECT_ID}</p>

        <h4>Dataset ID</h4>
        <p>{process.env.REACT_APP_DATASET_ID}</p>

        <ClayDropDown
          trigger={
            <ClayButton displayType="secondary">select table</ClayButton>
          }
          closeOnClick
        >
          {tableList.map((table) => (
            <ClayDropDown.Item
              key={table.id}
              value={table.id}
              onClick={() => {
                setSelectedTable(tableList.find(({ id }) => table.id === id));
                onChange(table.id);
              }}
            >
              {table.id}
            </ClayDropDown.Item>
          ))}
        </ClayDropDown>

        {selectedTable && (
          <div className="mt-4">
            <h4>{"Table ID"}</h4>
            <p>{selectedTable.id}</p>
            <h4>{"Table Schema"}</h4>

            <pre className="bg-info text-white p-4 rounded">
              {JSON.stringify(selectedTable.schema, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
