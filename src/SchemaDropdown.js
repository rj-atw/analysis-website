import React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';

function SchemaItems(props) {
  return props.fields.map( field => 
    <Dropdown.Item key={field.name} eventKey={field.name}>{field.name}</Dropdown.Item>
  );
}

class SchemaDropdown extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      schema: props.schema,
      column: props.schema.fields[0].name
    };
    this.parentCallbackOnChoice = props.onSelect;

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(eventKey, e) {
    this.setState( {column: eventKey});
    this.parentCallbackOnChoice(eventKey);
  }

  render() {
    return (
      <Dropdown onSelect={this.onSelect}>
        <Dropdown.Toggle>
          {this.state.column}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <SchemaItems fields={this.state.schema.fields} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default SchemaDropdown;
