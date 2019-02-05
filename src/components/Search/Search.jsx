import React from 'react';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.searchInput = React.createRef();
  }

  componentDidMount() {
    this.searchInput.current.focus();
  }

  render() {
    const {
      value,
      onSubmit,
      onChange,
      children,
    } = this.props;

    return (
      <div>
        <form onSubmit={onSubmit}>
          {children}
          <input
            type='text'
            value={value}
            onChange={onChange}
            ref={this.searchInput}
          />
          <button type='submit'>
            {children}
          </button>
        </form>
      </div>
    )
  }
}

export default Search;
