import React from 'react';

const ResultItem = ({ value }) => {
  return (
    <li>
      <h4>
        <a href={value.item.url}>{value.item.title}</a>
      </h4>
      <p>{value.item.description}</p>
    </li>
  );
}

const ResultList = ({ items }) => {
  return (
    <ul>
      {items.map((value, index) =>
        <ResultItem key={index} value={value} />
      )}
    </ul>
  )
}

class Result extends React.Component {

  render() {
    const {
      results,
    } = this.props;

    return (
      <ResultList items={results} />
    )
  }
}

export default Result;
