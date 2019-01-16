import React from 'react';

const ResultItem = ({value}) => {
  return (
    <div>
      <h4>{value.title}</h4>
      <span>{value.url}</span>
    </div>
  );
}

const ResultList = ({items}) => {
  return(
    <div>
      {items.map((value, index) =>
        <ResultItem key = {index} value = {value}/>
      )}
    </div>
  )
}

class Result extends React.Component {

  render() {
    const {
      results,
    } = this.props;

    return(
      <ResultList items = {results}/>
    )
  }
}

export default Result;
