import {useEffect, useState} from 'react';
import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';

export default function DataTable(props) {
  const {historicData, date, dateArray} = props;
  const [columns, setColumns] = useState([
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'code', headerName: 'Currency Code', width: 130},
    {field: 'value', headerName: date, width: 160},
  ]);

  let tempRows = [...historicData];
  // tempRows.forEach((tr, index) => {
  //   tr.id = index + 1;
  //   columns.forEach((val, colindex) => {
  //     let valueindex = 'value' + colindex;
  //     tr[valueindex] = tr.value;
  //   });
  // });
  const rows = [...historicData];
  rows.forEach((hi, ind) => {
    hi.id = ind + 1;
  });
  useEffect(() => {
    let tempCols = [
      {field: 'id', headerName: 'ID', width: 70},
      {field: 'code', headerName: 'Currency Code', width: 130},
      {field: 'value0', headerName: date, width: 160},
    ];
    dateArray.forEach((da, index) => {
      tempCols.push({field: 'value' + index, headerName: da, width: 160});
    });
    console.log(tempCols);
    setColumns(tempCols);
  }, [dateArray]);
  useEffect(() => {
    console.log('historicData', historicData);
  }, [historicData]);
  return (
    <div style={{height: 'auto'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {page: 0, pageSize: 10},
          },
        }}
        pageSizeOptions={[100, 100]}
      />
    </div>
  );
}
