import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Country = ({country}) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get('http://api.apixu.com/v1/current.json?key=f7ba50995825443b937150338191301&q=' + country.capital)
      .then(res => setWeather(res.data));
  }, []);

  const renderWeather = () => {
    if(!weather) return null;
    return (
      <div>
        <h2>Weather in {country.capital}</h2>
        <div>temperature: {weather.current.temp_c} Celsius</div>
        <img src={'http:' + weather.current.condition.icon} alt='weather icon' />
        <div>wind: {weather.current.wind_kph} kph direction {weather.current.wind_dir}</div>
      </div>
    )
  }

  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital: {country.capital}</div>
      <div>population: {country.population}</div>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt='flag' width='400' />
      {renderWeather()}
    </div>);
}

const CountriesList = ({countries, selectCountry}) => {
  if(countries.length === 0) return <div>no matches</div>
  else if(countries.length === 1) return <Country country={countries[0]} />
  else if(countries.length > 10) return <div>too many matches, specify another filter</div>
  else return (
    <div>
      {countries.map(country => <div key={country.name}>{country.name}<button onClick={selectCountry(country.name)}>show</button></div>)}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(res => setCountries(res.data));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const selectCountry = (country) => () => {
    setFilter(country);
  }

  const matches = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      find countries: <input value={filter} onChange={handleFilterChange} />
      <CountriesList countries={matches} selectCountry={selectCountry} />
    </div>
  );
}

export default App;
