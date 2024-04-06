import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Button from '@mui/material/Button';
import ExchangeTable from '../table/index';

export default function StateTextFields() {
  const [date, setDate] = React.useState(
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [baseCurrency, setBaseCurrency] = React.useState('USD');
  const [currencies, setCurrencies] = React.useState([]);
  const [datesArr, setDatesArr] = React.useState([]);
  const [historicData, setHistoricData] = React.useState([]);
  const [tableCurrency, setTableCurrency] = React.useState([
    'GBP',
    'EUR',
    'JPY',
    'CHF',
    'CAD',
    'AUD',
    'INR',
  ]);
  let apiKey = 'fca_live_3XjcWKrSa2NJhU43oVZgGNqFNr4Fy9hSJmnOUEXd';
  const handleChange = event => {
    setBaseCurrency(event.target.value);
  };

  React.useEffect(() => {
    fetch('https://api.currencyapi.com/v3/currencies?apikey=' + apiKey)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let result = Object.entries(data.data);
        let tempCurrency = [];
        result.forEach(curr => {
          tempCurrency.push(curr[1]);
        });
        setCurrencies(tempCurrency);
      });
  }, []);

  function getCurrencyRange() {
    let tempTablecurrencies = encodeURIComponent(tableCurrency.join(','));
    fetch(
      'https://api.currencyapi.com/v3/historical?apikey=fca_live_3XjcWKrSa2NJhU43oVZgGNqFNr4Fy9hSJmnOUEXd&currencies=' +
        tempTablecurrencies +
        '&base_currency=' +
        baseCurrency +
        '&date=' +
        date,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let result = Object.entries(data.data);
        let temphistoricData = [];
        result.forEach(curr => {
          temphistoricData.push(curr[1]);
        });
        console.log('temphistoricData', temphistoricData);
        setHistoricData(temphistoricData);
      });
  }

  function nextdays(dt) {
    let datesArray = [];
    for (let i = 1; i <= 7; i++) {
      datesArray.push(
        new Date(new Date(dt).getTime() - i * (24 * 60 * 60 * 1000))
          .toISOString()
          .slice(0, 10),
      );
    }
    console.log('datesArray', datesArray);
    setDatesArr(datesArray);
  }

  return (
    <Box>
      <Box
        component="form"
        sx={{
          '& > :not(style)': {m: 1, width: '25ch'},
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '100px',
        }}
        noValidate
        autoComplete="off">
        <Box sx={{minWidth: 120}}>
          <FormControl fullWidth>
            <TextField
              id="outlined-controlled"
              label="Date"
              value={date}
              type="date"
              onChange={event => {
                setDate(event.target.value);
                nextdays(event.target.value);
              }}
            />
          </FormControl>
        </Box>
        <Box sx={{minWidth: 120}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Currency</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={baseCurrency}
              label="Currency"
              onChange={handleChange}>
              {currencies &&
                currencies.length > 0 &&
                currencies.map(cur => {
                  return <MenuItem value={cur.code}>{cur.code}</MenuItem>;
                })}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          onClick={() => {
            getCurrencyRange();
          }}>
          Submit
        </Button>
      </Box>
      <Box>
        <ExchangeTable
          historicData={historicData}
          date={date}
          dateArray={datesArr}></ExchangeTable>
      </Box>
    </Box>
  );
}