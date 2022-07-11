import {useEffect, useState} from 'react';
import Autosuggest from 'react-autosuggest';

export async function getJsonFromUrl(url) {
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
    return responseJson;
    })
    .catch((error) => {
    console.error(error);
    });   
}

export async function getPossibleAddresses(street = undefined,number = undefined,postcode = undefined,city = undefined) {
    let json = await getJsonFromUrl(`https://circl.be/nieuw/tool/overzicht.php?lijst=projecten&type=json`);
    let possiblePlots = []
    for (let plotData of json) {
        let splitAddress = plotData.adres.toLowerCase().split(" ")
        if ((street == undefined) || splitAddress[0].includes(street.toLowerCase())) {possiblePlots.push(plotData); continue;}
        if ((street == undefined) || splitAddress[0].includes(street.toLowerCase())) {possiblePlots.push(plotData); continue;}
    }
    return possiblePlots
}

/*
export async function getJsonByAddressParameters() {

}
*/

// https://stackoverflow.com/a/34789405
const addresses = require('../data/splitted-addresses.json');

/* --- [code from: https://github.com/moroshko/react-autosuggest#basic-usage --- */
// Teach Autosuggest how to calculate suggestions for any given input value.

// higher order function to make a getSuggested function

// https://stackoverflow.com/a/43046408

const makeGetSuggestions = key => {
    return value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
    
        const suggestions = inputLength === 0 ? [] : addresses.filter(address =>
        address[key].toLowerCase().slice(0, inputLength) === inputValue
        );

        const uniqueSuggestions = [...new Set(suggestions.map(x => x[key]))];

        return uniqueSuggestions.map(x => ({[key]: x}));
    }  
  };

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
//const getStreetNameSuggestionValue = suggestion => suggestion.streetName;
const makeGetSuggestionValue = key => { 
    return suggestion => { 
        return suggestion[key]
    }
};

// Use your imagination to render suggestions.
const makeRenderSuggestion = key => {
    return suggestion => {
        return (<div>
                    {suggestion[key]}
                </div>)
    }
};


/* --- code from: https://github.com/moroshko/react-autosuggest#basic-usage ] --- */


function AddressForm(props){
    let [streetName, setStreetName] = useState("");
    let [houseNumber, setHouseNumber] = useState("");
    let [postalCode, setPostalCode] = useState("");
    let [city, setCity] = useState("");
    let [streetNameSuggestions, setStreetNameSuggestions] = useState([{streetName:""}]);
    let [houseNumberSuggestions, setHouseNumberSuggestions] = useState([{houseNumber:""}]);
    let [postalCodeSuggestions, setpostalCodeSuggestions] = useState([{postalCode:""}]);
    let [citySuggestions, setCitySuggestions] = useState([{city:""}]);
    let suggestions = {
        streetName: [streetNameSuggestions, setStreetNameSuggestions],
        houseNumber: [houseNumberSuggestions, setHouseNumberSuggestions],
        postalCode: [postalCodeSuggestions, setpostalCodeSuggestions],
        city: [citySuggestions, setCitySuggestions]
    };
  


   function handleSubmit(event){
        event.preventDefault();
        console.log("SUBMITTED");
        console.log(event.target.value);
    }

    /* --- [code from: https://github.com/moroshko/react-autosuggest#basic-usage --- */

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = key => {
        return ({value} ) => {
            let [_, setSuggestions] = suggestions[key];
            setSuggestions(makeGetSuggestions(key)(value));
        }
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = key => {
        return () => {
            let [_, setSuggestions] = suggestions[key];
            setSuggestions([{key:""}]);
        }
    };

    // Autosuggest will pass through all these props to the input.
    const streetNameProps = {
        placeholder: 'Type a street name',
        value: streetName,
        onChange: (event,streetNameVal) => {
           // setStreetName(streetNameVal.target.value)}
           setStreetName(streetNameVal.newValue)}
      };
    const houseNumberProps = {
        placeholder: 'Type a house number',
        value: houseNumber,
        onChange: (event,houseNumberVal) => {
            //setHouseNumber(houseNumberVal.target.value)}
            console.log(houseNumberVal)
            setHouseNumber(houseNumberVal.newValue)}
      };
    const postalCodeProps = {
        placeholder: 'Type a postal code',
        value: postalCode,
        onChange: (event,postalCodeVal) => {
            //setPostalCode(postalCodeVal.target.value)}
            setPostalCode(postalCodeVal.newValue)}
      };
    const cityProps = {
        placeholder: 'Type a house number',
        value: city,
        onChange: (cityVal) => {
            //setCity(cityVal.target.value)}
            setCity(cityVal.newValue)}
      };
    /* --- code from: https://github.com/moroshko/react-autosuggest#basic-usage ] --- */

    //          shouldRenderSuggestions={shouldRenderSuggestions}
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="streetName">Street name:</label>
                    <Autosuggest
                        suggestions={streetNameSuggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested("streetName")}
                        onSuggestionsClearRequested={onSuggestionsClearRequested("streetName")}
               
                        getSuggestionValue={makeGetSuggestionValue("streetName")}
                        renderSuggestion={makeRenderSuggestion("streetName")}
                        inputProps={streetNameProps}
                    />
                </div>
                <div className="invisible-div"></div>
                <div>
                    <label htmlFor="houseNumber">House number:</label>
                    <Autosuggest
                        suggestions={houseNumberSuggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested("houseNumber")}
                        onSuggestionsClearRequested={onSuggestionsClearRequested("houseNumber")}
               
                        getSuggestionValue={makeGetSuggestionValue("houseNumber")}
                        renderSuggestion={makeRenderSuggestion("houseNumber")}
                        inputProps={houseNumberProps}
                    />
                </div>
                <div className="invisible-div"></div>
                <div>
                    <label htmlFor="postalCode">Postal code:</label>
                    <Autosuggest
                        suggestions={postalCodeSuggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested("postalCode")}
                        onSuggestionsClearRequested={onSuggestionsClearRequested("postalCode")}
               
                        getSuggestionValue={makeGetSuggestionValue("postalCode")}
                        renderSuggestion={makeRenderSuggestion("postalCode")}
                        inputProps={postalCodeProps}
                    />
                </div>
                <div className="invisible-div"></div>
                <div>
                    <label htmlFor="city">City:</label>
                    <Autosuggest
                        suggestions={citySuggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested("city")}
                        onSuggestionsClearRequested={onSuggestionsClearRequested("city")}
               
                        getSuggestionValue={makeGetSuggestionValue("city")}
                        renderSuggestion={makeRenderSuggestion("city")}
                        inputProps={cityProps}
                    />
                </div>
                <div className="invisible-div"></div>
                <input type="submit" value="Submit" />
            </form>
        </div>

    );
}

export default AddressForm;