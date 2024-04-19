import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Button from '@mui/material/Button';
import ExchangeTable from '../table/index';
import {Padding} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import './index.css';

import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function StateTextFields() {
  const [date, setDate] = React.useState(
    new Date(Date.now()).toISOString().slice(0, 10),
  );

  const [baseCurrency, setBaseCurrency] = React.useState('gbp');
  const [currencies, setCurrencies] = React.useState([]);
  const [datesArr, setDatesArr] = React.useState([]);
  const [historicData, setHistoricData] = React.useState([]);
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const [isTableData, setIsTableData] = React.useState(false);
  const [isTableError, setIsTableError] = React.useState(false);
  const [tableCurrency, setTableCurrency] = React.useState([
    'USD',
    'EUR',
    'JPY',
    'CHF',
    'CAD',
    'AUD',
    'ZAR',
  ]);
  const [initHistoricData, setInitHistoricData] = React.useState([
    {code: 'USD'},
    {code: 'EUR'},
    {code: 'JPY'},
    {code: 'CHF'},
    {code: 'CAD'},
    {code: 'AUD'},
    {code: 'ZAR'},
  ]);
  let apiKey = 'fca_live_3XjcWKrSa2NJhU43oVZgGNqFNr4Fy9hSJmnOUEXd';
  const handleChange = event => {
    setBaseCurrency(event.target.value);
  };
  const handleCheckChange = event => {
    const {
      target: {value},
    } = event;
    console.log('value', value);
    let tempVal = [];
    value.forEach(v => {
      tempVal.push(v.toUpperCase());
    });
    setTableCurrency([...tempVal]);
    let tempHist = [];
    value.forEach(v => {
      tempHist.push({code: v.toUpperCase()});
    });
    setInitHistoricData(tempHist);
  };

  React.useEffect(() => {
    fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json',
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let result = Object.entries(data);
        let tempCurrency = [];
        result.forEach(curr => {
          curr[1] && tempCurrency.push({code: curr[0], value: curr[1]});
        });
        setCurrencies(tempCurrency);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Form submission & api handling
  function getCurrencyRange() {
    setIsTableLoading(true);
    let tempTablecurrencies = encodeURIComponent(tableCurrency.join(','));
    datesArr.forEach((dt, index) => {
      currencyDateRange(dt, index);
    });
  }

  let temphistoricData = [...initHistoricData];
  function currencyDateRange(dt, ind) {
    fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dt}/v1/currencies/${baseCurrency}.json`,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log('tableCurrency', tableCurrency);
        let result = Object.entries(data[baseCurrency]);
        result = result.filter(
          th =>
            tableCurrency.includes(th[0].toUpperCase()) ||
            tableCurrency.includes(th[0]),
        );
        console.log('result---', result);
        result.forEach(curr => {
          if (
            temphistoricData.findIndex(
              th => th.code.toUpperCase() == curr[0].toUpperCase(),
            ) >= 0
          ) {
            let fin = temphistoricData.findIndex(
              th => th.code.toUpperCase() === curr[0].toUpperCase(),
            );
            temphistoricData[fin]['value' + ind] = curr[1];
          }
          // temphistoricData = temphistoricData.forEach((th, index) => {
          //   if (th.code == curr[0].toUpperCase()) {
          //     th['value' + ind] = curr[1];
          //   }
          // });
          //temphistoricData.push({code: curr[0], ['value' + ind]: curr[1]});
        });

        console.log('temphistoricData', temphistoricData);
        setInitHistoricData(temphistoricData);
        setIsTableLoading(false);
        setIsTableData(true);
        setIsTableError(false);
      })
      .catch(error => {
        console.log(error);
        setIsTableLoading(false);
        setIsTableError(true);
      });
  }

  // Fetching 7 days of previous dates
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
  React.useEffect(() => {
    if (date) {
      nextdays(date);
    }
  }, []);

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
          marginBottom: '50px',
        }}
        noValidate
        autoComplete="off">
        <Box sx={{minWidth: 120}}>
          <FormControl fullWidth style={{marginLeft: '-60px'}}>
            <input
              type="date"
              min={new Date(new Date().getTime() - 90 * (24 * 60 * 60 * 1000))
                .toISOString()
                .substring(0, 10)}
              max={new Date().toISOString().substring(0, 10)}
              value={date}
              class="css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input custom-date"
              onChange={event => {
                setDate(event.target.value);
                nextdays(event.target.value);
              }}
            />
            {/* <TextField
              id="outlined-controlled"
              label="Date"
              value={date}
              type="date"
              min={new Date(new Date().getTime() - 90 * (24 * 60 * 60 * 1000))
                .toISOString()
                .substring(0, 10)}
              max={new Date().toISOString().substring(0, 10)}
              onChange={event => {
                setDate(event.target.value);
                nextdays(event.target.value);
              }}
            /> */}
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
                  return <MenuItem value={cur.code}>{cur.value}</MenuItem>;
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

      <Box style={{margin: '10px', marginTop: '60px !important'}}>
        {isTableLoading && <CircularProgress />}

        <div style={{textAlign: 'right'}}>
          <FormControl
            sx={{m: 1, width: 300, textAlign: 'right', marginRight: '100px'}}>
            <InputLabel id="demo-multiple-checkbox-label">
              Add more currencies
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={tableCurrency}
              onChange={handleCheckChange}
              input={<OutlinedInput label="Add more currencies" />}
              renderValue={selected => (
                <span>{tableCurrency.length} currencies selected</span>
              )}
              MenuProps={MenuProps}>
              {currencies.slice(0, 100).map(curr => (
                <MenuItem key={curr.code} value={curr.value}>
                  <Checkbox
                    checked={
                      tableCurrency.includes(curr.code.toUpperCase()) ||
                      tableCurrency.includes(curr.code)
                    }
                  />
                  <ListItemText primary={curr.value} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {!isTableLoading && isTableData && (
          <ExchangeTable
            historicData={initHistoricData}
            date={date}
            dateArray={datesArr}></ExchangeTable>
        )}
        {isTableError && (
          <Alert severity="error">
            Unable to load data right now. Pleae try again after some time.
          </Alert>
        )}
      </Box>
    </Box>
  );
}
