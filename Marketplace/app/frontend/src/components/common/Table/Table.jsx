import React from 'react';
import styles from './Table.module.css';

function Table({ columns = [], data = [], zebra = true, onSort, onRowClick }) {
  return (
    <div className={styles.wrapper}>
      <table className={zebra ? styles.zebra : undefined}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{ width: col.width, flex: col.flex }}
                onClick={() => onSort && onSort(col.key)}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} onClick={()=> onRowClick && onRowClick(row)} style={onRowClick?{cursor:'pointer'}:undefined}>
              {columns.map(col => (
                <td key={col.key}>
                  {typeof col.render === 'function'
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
