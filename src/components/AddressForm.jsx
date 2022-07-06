import {useState} from 'react';

function AddressForm(props){
    let [streetName, setStreetName] = useState("");
    let [houseNumber, setHouseNumber] = useState("");
    let [postalCode, setPostalCode] = useState("");
    let [city, setCity] = useState("");


   function handleSubmit(event){
        event.preventDefault();
        console.log("SUBMITTED");
        console.log(event.target.value);
    }

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
}

export default AddressForm;