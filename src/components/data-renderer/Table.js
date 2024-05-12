import { useCallback, useState } from "react";
import { Body, Cell, Head, Row, Table as ClayTable } from "@clayui/core";

export function Table({ data }) {
  if (data.length === 0) {
    return null;
  }

  return <TableContent data={data} />;
}

const TableContent = ({ data }) => {
  const [sort, setSort] = useState(null);
  const [items, setItems] = useState(data);

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
      <Head
        items={Object.keys(data[0]).map((key) => ({
          id: key,
          name: key,
        }))}
      >
        {(column) => (
          <Cell key={column.id} sortable>
            {column.name}
          </Cell>
        )}
      </Head>

      <Body defaultItems={items}>
        {(row) => (
          <Row>
            {Object.keys(row).map((column) => {
              return <Cell key={column}>{row[column]}</Cell>;
            })}
          </Row>
        )}
      </Body>
    </ClayTable>
  );
};
