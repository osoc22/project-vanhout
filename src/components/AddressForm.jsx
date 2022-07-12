import {useEffect, useState} from 'react';
import Autosuggest from 'react-autosuggest';

// https://stackoverflow.com/a/34789405
const addresses = require('../data/splitted-addresses.json');

/* --- [code from: https://github.com/moroshko/react-autosuggest#basic-usage --- */
// Teach Autosuggest how to calculate suggestions for any given input value.

// higher order function to make a getSuggested function

// https://stackoverflow.com/a/43046408

const makeGetSuggestions = (generalSuggestions,key) => {
    return value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
    
        const suggestions = inputLength === 0 ? [] : generalSuggestions.filter(address =>
        address[key].toLowerCase().slice(0, inputLength) === inputValue
        );

        let uniqueSuggestions = [...new Set(suggestions.map(x => x[key]))];
        uniqueSuggestions = uniqueSuggestions.map(x => ({[key]: x}))

        return [suggestions,uniqueSuggestions];
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
    let setProjectId = props.setProjectId;

    let [streetName, setStreetName] = useState("");
    let [streetNumber, setStreetNumber] = useState("");
    let [postalCode, setPostalCode] = useState("");
    let [city, setCity] = useState("");
    // let [generalSuggestions, setGeneralSuggestions] = useState([{streetName: "", streetNumber: "", postalCode: "", city: ""}]);
    let [generalSuggestions, setGeneralSuggestions] = useState(addresses);

    let [streetNameSuggestions, setStreetNameSuggestions] = useState([{streetName:""}]);
    let [streetNumberSuggestions, setStreetNumberSuggestions] = useState([{streetNumber:""}]);
    let [postalCodeSuggestions, setPostalCodeSuggestions] = useState([{postalCode:""}]);
    let [citySuggestions, setCitySuggestions] = useState([{city:""}]);
    let suggestions = {
        streetName: [streetNameSuggestions, setStreetNameSuggestions],
        streetNumber: [streetNumberSuggestions, setStreetNumberSuggestions],
        postalCode: [postalCodeSuggestions, setPostalCodeSuggestions],
        city: [citySuggestions, setCitySuggestions]
    };


    let [showStreetNameSuggestions, setShowStreetNameSuggestions] = useState(false);
    let [showStreetNumberSuggestions, setShowStreetNumberSuggestions] = useState(false);
    let [showPostalCodeSuggestions, setShowPostalCodeSuggestions] = useState(false);
    let [showCitySuggestions, setShowCitySuggestions] = useState(false);

    let showSuggestions = {
        streetName: [showStreetNameSuggestions, setShowStreetNameSuggestions],
        streetNumber: [showStreetNumberSuggestions, setShowStreetNumberSuggestions],
        postalCode: [showPostalCodeSuggestions, setShowPostalCodeSuggestions],
        city: [showCitySuggestions, setShowCitySuggestions]
    }
    

    function updateAllSuggestions(){
        for (const [fieldName, [_, setFieldNameSuggestions]] of Object.entries(suggestions)){
        //for (const [fieldName, fieldNameMethods] of Object.entries(suggestions)){
            //let setFieldNameSuggestions = fieldNameMethods[1];
            let newFieldNameSuggestions = generalSuggestions.map(x => ({[fieldName]: x[fieldName]}));
            setFieldNameSuggestions(newFieldNameSuggestions);
        }
    }

    useEffect(() => {
        updateAllSuggestions()
    }, [generalSuggestions]);


    const initialiseSuggestions = (key) => {
        let [fieldSuggestions, setFieldSuggestions] = suggestions[key];
        // remove duplicates
        let uniqueSuggestions = [... new Set(generalSuggestions.map(x => x[key]))];
        // sort values
        uniqueSuggestions.sort();
        uniqueSuggestions = uniqueSuggestions.map(x => ({[key]:x}));
        setFieldSuggestions(uniqueSuggestions);
    };

    // on page load, initialise all suggestions of all fields with unique values of generalSuggestions
    useEffect(() => {
        for (const [fieldName, _] of Object.entries(suggestions)){
            initialiseSuggestions(fieldName)
        }
    },[]);


   function handleSubmit(event){
        event.preventDefault();
        const projectId = generalSuggestions[0].projectID;
        console.log(projectId);
        setProjectId(projectId);
    }



    /* --- [code from: https://github.com/moroshko/react-autosuggest#basic-usage --- */

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = key => {
        return ({value} ) => {
            let [_, setSuggestions] = suggestions[key];
            let [newSuggestions, newUniqueSuggestions] = makeGetSuggestions(generalSuggestions,key)(value);
            setGeneralSuggestions(newSuggestions);
            setSuggestions(newUniqueSuggestions);
        }
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = key => {
        return () => {
            //let [_, setSuggestions] = suggestions[key];
            //setSuggestions([{key:""}]);
            //setGeneralSuggestions(addresses);
        }
    };


    const onSuggestionSelected = key => {
        return (event,{suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) => {
            let [_, setShowFieldSuggestion] = showSuggestions[key];
            setShowFieldSuggestion(false);
        }
    }

    // Autosuggest will pass through all these props to the input.
    const streetNameProps = {
        placeholder: 'Type a street name',
        value: streetName,
        onChange: (event,streetNameVal) => {
           // setStreetName(streetNameVal.target.value)}
           setStreetName(streetNameVal.newValue);
        },
        onBlur: (event,ignore) => {
            setShowStreetNameSuggestions(false)
        },
        onFocus: (event,ignore) => {
            setShowStreetNameSuggestions(true)
        },
    };
    const streetNumberProps = {
        placeholder: 'Type a street number',
        value: streetNumber,
        onChange: (event,streetNumberVal) => {
            //setstreetNumber(streetNumberVal.target.value)}
            setStreetNumber(streetNumberVal.newValue)
        },
        onBlur: (event,ignore) => {
            setShowStreetNumberSuggestions(false)
        },
        onFocus: (event,ignore) => {
            setShowStreetNumberSuggestions(true)
        }
    };
    const postalCodeProps = {
        placeholder: 'Type a postal code',
        value: postalCode,
        onChange: (event,postalCodeVal) => {
            //setPostalCode(postalCodeVal.target.value)}
            setPostalCode(postalCodeVal.newValue)
        },
        onBlur: (event,ignore) => {
            setShowPostalCodeSuggestions(false)
        },
        onFocus: (event,ignore) => {
            setShowPostalCodeSuggestions(true)
        }
    };
    const cityProps = {
        placeholder: 'Type a house number',
        value: city,
        onChange: (event,cityVal) => {
            //setCity(cityVal.target.value)}
            setCity(cityVal.newValue)
        },
        onBlur: (event,ignore) => {
            setShowCitySuggestions(false)
        },
        onFocus: (event,ignore) => {
            setShowCitySuggestions(true)
        }
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
                        alwaysRenderSuggestions={showStreetNameSuggestions}
                        onSuggestionSelected={onSuggestionSelected("streetName")}
                      
                     
               
                        getSuggestionValue={makeGetSuggestionValue("streetName")}
                        renderSuggestion={makeRenderSuggestion("streetName")}
                        inputProps={streetNameProps}
                    />
                </div>
                <div className="invisible-div"></div>
                <div>
                    <label htmlFor="streetNumber">Street number:</label>
                    <Autosuggest
                        suggestions={streetNumberSuggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested("streetNumber")}
                        onSuggestionsClearRequested={onSuggestionsClearRequested("streetNumber")}
                        alwaysRenderSuggestions={showStreetNumberSuggestions}
                        onSuggestionSelected={onSuggestionSelected("streetNumber")}
               
                        getSuggestionValue={makeGetSuggestionValue("streetNumber")}
                        renderSuggestion={makeRenderSuggestion("streetNumber")}
                        inputProps={streetNumberProps}
                    />
                </div>
                <div className="invisible-div"></div>
                <div>
                    <label htmlFor="postalCode">Postal code:</label>
                    <Autosuggest
                        suggestions={postalCodeSuggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested("postalCode")}
                        onSuggestionsClearRequested={onSuggestionsClearRequested("postalCode")}
                        alwaysRenderSuggestions={showPostalCodeSuggestions}
                        onSuggestionSelected={onSuggestionSelected("postalCode")}
               
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
                        alwaysRenderSuggestions={showCitySuggestions}
                        onSuggestionSelected={onSuggestionSelected("city")}
               
                        getSuggestionValue={makeGetSuggestionValue("city")}
                        renderSuggestion={makeRenderSuggestion("city")}
                        inputProps={cityProps}
                    />
                </div>
                <div className="invisible-div"></div>
                <input type="submit" value="Submit"/>
            </form>
        </div>

    );
}

export default AddressForm;