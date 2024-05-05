import { useEffect, useState } from "react";
import ClayButton from "@clayui/button";
import { ENDPOINT } from "../../utils/constants";
import ClayDropDown from "@clayui/drop-down";

export function Setup({ onTableChange }) {
  const [tableList, setTableList] = useState([]);

  function storeTableList(tableList) {
    localStorage.setItem("tableList", JSON.stringify(tableList));
  }

  function getTableListFromStorage() {
    return JSON.parse(localStorage.getItem("tableList"));
  }

  useEffect(() => {
    const tableListFromStorage = getTableListFromStorage();

    if (tableListFromStorage) {
      setTableList(tableListFromStorage);
    } else {
      fetch(`${ENDPOINT}/bigquery-table-list`)
        .then((response) => response.json())
        .then((data) => {
          setTableList(data);
          storeTableList(data.slice(0, 10));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div className="setup py-10">
      <h4>Select a table before starting</h4>

      <ClayDropDown
        trigger={<ClayButton displayType="secondary">select table</ClayButton>}
        closeOnClick
      >
        {tableList.map((table) => (
          <ClayDropDown.Item
            key={table.id}
            value={table.id}
            onClick={() => {
              const selectedTable = tableList.find(({ id }) => table.id === id);

              onTableChange(selectedTable);
            }}
          >
            {table.id}
          </ClayDropDown.Item>
        ))}
      </ClayDropDown>
    </div>
  );
}
