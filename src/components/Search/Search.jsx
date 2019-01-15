import React from 'react';
import PropTypes from "prop-types";

class Search extends React.Component {
  render() {
    const {
      value,
      onSubmit,
      onChange,
      children
    } = this.props;

    Search.propTypes = {
      value: PropTypes.string,
      onSubmit: PropTypes.func,
      onChange: PropTypes.func,
      children: PropTypes.node,
    }

    return (
      <from onSubmit={onSubmit}>
        {children}
        <input
          type='text'
          value={value}
          onChange={onChange}
        />
        <button type='submit'>
          {children}
        </button>
      </from>
    )
  }
}

export default Search;
