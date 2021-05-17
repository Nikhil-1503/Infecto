import React, { useEffect, useState } from 'react'
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core'
import './App.css'
import Stats from './components/Stats/Stats';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import Graph from './components/Graph/Graph';

import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setCountries] = useState([]); 
  const [country, setCountry] = useState('worldwide'); 
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch('https://corona.lmao.ninja/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    })
  }, [])

  //https://corona.lmao.ninja/v3/covid-19/countries

  useEffect(() => {
    const getData = async () => {
      await fetch('https://corona.lmao.ninja/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((e) => ({
          name: e.country,
          value: e.countryInfo.iso3,
        }))

        const sortedData = [...data];
        //sorting the data by the cases in descending order
        sortedData.sort((a,b) => (a.cases > b.cases) ? -1 : 1) 

        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      })
    }
    getData();
  },[]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url = countryCode === 'worldwide' ? 'https://corona.lmao.ninja/v3/covid-19/all' : `https://corona.lmao.ninja/v3/covid-19/countries/${countryCode}`;
  
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Infecto</h1>
            <FormControl classname="app__form">
              <Select variant="outlined" onChange={onCountryChange} value={country}>
                <MenuItem value='worldwide'>Worldwide</MenuItem>
                {
                  countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))
                }
                
              </Select>
            </FormControl>
        </div>

        <div className="app__stats">
                <Stats title='Covid-19 cases' cases={countryInfo.todayCases} total={countryInfo.cases}/> 
                <Stats title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths}/> 
                <Stats title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered}/> 
        </div>

        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      
      <Card className="app__right">
          <CardContent>
            <h3>Live Cases</h3>
            <Table countries={tableData}/>
            <h4>Worlwide new cases</h4>
            <Graph />
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
