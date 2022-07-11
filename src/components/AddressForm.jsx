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
const makeGetSuggestions = key => {
    return value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
    
        const suggestions = inputLength === 0 ? [] : addresses.filter(address =>
        address[key].toLowerCase().slice(0, inputLength) === inputValue
        );

        console.log(suggestions);

        return suggestions;
    }  
  };

const getSuggestions = makeGetSuggestions("streetName");

/*
const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    const suggestions = inputLength === 0 ? [] : addresses.filter(address =>
      address["streetName"].toLowerCase().slice(0, inputLength) === inputValue
    );

    console.log(suggestions);

    return suggestions;
  };
  */


// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.streetName;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.streetName}
  </div>
);

/* --- code from: https://github.com/moroshko/react-autosuggest#basic-usage ] --- */


function AddressForm(props){
    let [streetName, setStreetName] = useState("");
    let [houseNumber, setHouseNumber] = useState("");
    let [postalCode, setPostalCode] = useState("");
    let [city, setCity] = useState("");
    let [suggestions, setSuggestions] = useState([{streetName:""}]);


   function handleSubmit(event){
        event.preventDefault();
        console.log("SUBMITTED");
        console.log(event.target.value);
    }

    useEffect(()=>{console.log(suggestions)},[suggestions])

    /* --- [code from: https://github.com/moroshko/react-autosuggest#basic-usage --- */

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = ( {value} ) => {
        //setSuggestions(getSuggestions(value.target.value))
        setSuggestions(getSuggestions(value))
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        //setSuggestions([])
    };

    /*
    const shouldRenderSuggestions = (value, reason) => {
        return String(value).trim().length > 2;
      }
      */

    // Autosuggest will pass through all these props to the input.
    const streetNameProps = {
        placeholder: 'Type a street name',
        value:streetName,
        onChange: (streetNameVal) => {
            setStreetName(streetNameVal.target.value)}
      };
    /* --- code from: https://github.com/moroshko/react-autosuggest#basic-usage ] --- */

    //          shouldRenderSuggestions={shouldRenderSuggestions}
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="streetName">Street name:</label>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
               
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={streetNameProps}
                    />
                </div>
                <div class="invisible-div"></div>
                <div>
                    <label htmlFor="houseNumber">House number:</label>
                    <input type="number" id="houseNumber" name="houseNumber"
                        onChange={(e) => setHouseNumber(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="postalCode">Postal code:</label>
                    <input type="number" id="postalCode" name="postalCode"
                        onChange={(e) => setPostalCode(e.target.value)}  />
                </div>
                <div>
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city"
                        onChange={(e) => setCity(e.target.value)} />
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>

    );

    /*
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="streetName">Street name:</label>
                    <input type="text" id="streetName" name="streetName"
                        onChange={(e) => setStreetName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="houseNumber">House number:</label>
                    <input type="number" id="houseNumber" name="houseNumber"
                        onChange={(e) => setHouseNumber(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="postalCode">Postal code:</label>
                    <input type="number" id="postalCode" name="postalCode"
                        onChange={(e) => setPostalCode(e.target.value)}  />
                </div>
                <div>
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city"
                        onChange={(e) => setCity(e.target.value)} />
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>

    );
    */
}

export default AddressForm;