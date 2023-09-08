import { useState, useEffect } from "react";
import "./App.css"
import Axios from "axios";
import { mobileValidation } from "./components/reg-ex";

function App() {

  const [ name, setName ] = useState("");
  const [ mobile, setMobile ] = useState("");
  const [ contactList, setContactList ] = useState([]);
  const [ passedID, setPassedID ] = useState("");
  const [ updatedMobile, setUpdatedMobile ] = useState("");
  const [ mobileErr, setMobileErr ] = useState("");

  const data = {
    name: name,
    mobile: mobile
  }


  // GET DATA FROM ULR/SERVER
  useEffect(() => {

    Axios.get("http://localhost:3001/contacts").then((response) => {
      setContactList(response.data);
    })

  }, [ contactList ])


  // SEND DATA TO URL/SERVER
  const addContact = () => {

    if (mobileValidation.test(mobile)) {

      Axios.post("http://localhost:3001/contacts/add", data).then(() => console.log("Data Inserted!"));
      setName("");
      setMobile("");
      setMobileErr("");

    } else {

      setMobileErr("mobileError");
      
    }

  }


  // DELETE DATA
  const deleteItem = (id) => {

    let answer = window.confirm("Delete?");

    if (answer) {      

      Axios.delete(`http://localhost:3001/contacts/delete/${ id }`);
      setContactList(contactList.filter((item) => {
        return item.id !== id;     
      }));

    }

  }



  // UPDATE DATA
  const updateItem = (id) => {

    setPassedID("");

    let answer = window.confirm("Update?");
    
    if (answer) {  

      Axios.put("http://localhost:3001/contacts/update/", {
        id: id,
        mobile: updatedMobile
      })

    }

  }
  

  // ENABLE FIELD TO UPDATE MOBILE
  const enableField = (id) => {    
    setPassedID(id)
  }
  

  return (
    <div className="App">
      <div className="contact-section">
        <h1>Contact Page</h1>
        <form action="#">
          <div className="name-container">
            <label htmlFor="contactName">Name </label>
            <input type="text" id="contactName" value={ name } onChange={ (e) => setName(e.target.value) }/>
          </div>
          <div className="mobile-container">
            <label htmlFor="contactNum">Mobile </label>
            <input type="text" id="contactNum" value={ mobile } onChange={ (e) => setMobile(e.target.value) } />
          </div>
          {
            mobileErr === "mobileError"
            ? <small className="err-display">Enter a valid mobile number</small>
            : null
          }
          <button className="add-btn" onClick={ addContact }>Add Contact</button>        
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          { contactList.slice().reverse().map((item) => {
            return(
              <tr id={ item.id } key={ item.id }>
                <td>{ item.name }</td>
                <td>
                  <input type="text" defaultValue={ item.mobile } onChange={ (e) => setUpdatedMobile(e.target.value) } disabled={ item.id === passedID ? false : true }/>                  
                </td>               

                <td>                
                  { 
                    item.id === passedID
                    ? <button className="btn-save" onClick={ () => updateItem(item.id) }>Update</button>
                    : <button className="btn-edit" onClick={ () => enableField(item.id) }>Edit</button>
                  }
                  <button className="btn-delete" onClick={ () => deleteItem(item.id) } disabled={ item.id === passedID ? true : false }>Delete</button>
                </td>
              </tr>
            )
          }) }
        </tbody>
      </table>
    </div>
  );
}

export default App;
