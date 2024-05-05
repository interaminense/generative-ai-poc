import { useCallback, useState } from "react";
import { Text, Body, Cell, Head, Row, Table as ClayTable } from "@clayui/core";

export function Table({ data }) {
  if (data.length === 0) {
    return null;
  }

  return <TableContent data={data} />;
}

function TableContent({ data }) {
  const headers = Object.keys(data[0]);
  const [items, setItems] = useState(data);

  const [sort, setSort] = useState(null);

  const onSortChange = useCallback((sort) => {
    if (sort) {
      setItems((items) =>
        items.sort((a, b) => {
          let cmp = new Intl.Collator("en", { numeric: true }).compare(
            a[sort.column],
            b[sort.column]
          );

          if (sort.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        })
      );
    }

    setSort(sort);
  }, []);

  return (
    <ClayTable onSortChange={onSortChange} sort={sort}>
      <Head items={headers}>
        {(column) => {
          if (column === "_key") {
            return <></>;
          }

          return (
            <Cell key={column} sortable>
              <Text>{column}</Text>
            </Cell>
          );
        }}
      </Head>

      <Body defaultItems={items}>
        {(row) => {
          return (
            <Row>
              {Object.keys(row).map((column) => {
                if (column === "_key") {
                  return <></>;
                }

                return <Cell key={column}>{row[column]}</Cell>;
              })}
            </Row>
          );
        }}
      </Body>
    </ClayTable>
  );
}
