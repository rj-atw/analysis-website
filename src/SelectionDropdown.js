import React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';

function SelectionItems(props) {
    return props.fields.map( field => 
      <Dropdown.Item key={field} eventKey={field}>{field}</Dropdown.Item>
    );
}

/* A Dropdown that displays the current selection. 

   The displayname is based on the eventKey of child Dropdown items
*/
function SelectionDropdown(props) {
   return (
    <Dropdown onSelect={(eventKey,e) => props.onSelect(eventKey)}>
      <Dropdown.Toggle>
        {props.currentSelection}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <SelectionItems fields={props.selectionList} />
      </Dropdown.Menu>
    </Dropdown>
   );
}

export default SelectionDropdown;
