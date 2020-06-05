//
// This file and its contents are supplied under the terms of the
// Common Development and Distribution License ("CDDL"), version 1.0.
// You may only use this file in accordance with the terms of version
// 1.0 of the CDDL.
//
// A full copy of the text of the CDDL should have accompanied this
// source.  A copy of the CDDL is also available via the Internet at
// https://opensource.org/licenses/CDDL-1.0
//


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
