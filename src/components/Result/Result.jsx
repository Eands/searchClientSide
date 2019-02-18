import React from 'react';
import ReactPaginate from 'react-paginate';
import './Result.css';

const ResultItem = ({value}) => {
  return (
    <li key={value.index}>
      <h4>
        <a href={value.url}>{value.title}</a>
      </h4>
      <p>{value.description}</p>
    </li>
  );
};

const ResultList = ({items}) => {
  return (
    <ul>
      {items.map((value, index) =>
        <ResultItem key={index} value={value}/>
      )}
    </ul>
  )
};

class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      pageRangeDisplayed: 3,
      marginPagesDisplayed: 3,
      trimResult: [],
    });

    this.handlePageClick = this.handlePageClick.bind(this);
    this.getItems = this.getItems.bind(this);
  }

  getPageCount() {
    return Math.ceil(this.props.results.length / this.state.pageRangeDisplayed);
  }

  getItems(selected) {
    let offset = Math.ceil(selected * this.state.pageRangeDisplayed);
    return this.props.results.slice(offset, this.state.pageRangeDisplayed + offset);
  }

  handlePageClick(data) {
    this.setState({
      trimResult: this.getItems(data.selected),
    })
  }

  componentDidMount() {
    this.setState({
      trimResult: this.getItems(0),
    })
  }

  render() {
    const {
      pageRangeDisplayed,
      marginPagesDisplayed,
      trimResult
    } = this.state;
    const pageCount = this.getPageCount();

    return (
      <div>
        <ResultList items={trimResult}/>
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={pageRangeDisplayed}
          marginPagesDisplayed={marginPagesDisplayed}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          subContainerClassName={'pages pagination'}
          breakClassName={'break-me'}
        />
      </div>
    )
  }
}

export default Result;
