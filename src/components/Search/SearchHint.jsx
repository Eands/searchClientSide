import React from 'react';

class SearchHint extends React.Component {
  render() {
    const {
      results,
    } = this.props;

    return (
      <div>
        {results.map(item =>
          <span>
            <a href={item.url}>{item.title}</a>
          </span>
        )}
      </div>
    )
  }
}

export default SearchHint;
