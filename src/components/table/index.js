import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';

export default function DataTable(props) {
  const {historicData, date, dateArray} = props;

  const columns = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'code', headerName: 'Currency Code', width: 130},
    {field: 'value', headerName: date, width: 160},
  ];
  let tempRows = [...historicData];
  tempRows.forEach((tr, index) => {
    tr.id = index + 1;
  });
  const rows = [...tempRows];
  return (
    <div style={{height: 400}}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {page: 0, pageSize: 5},
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}
