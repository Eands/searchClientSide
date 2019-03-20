import React from 'react';
import ReactPaginate from 'react-paginate';
import './Result.css';

const ResultItem = ({ value }) => {
  return (
    <li key={value.index}>
      <h4>
        <a href={value.url}>{value.title}</a>
      </h4>
      <p>{value.description}</p>
    </li>
  );
};

const ResultList = ({ items }) => {
  return (
    <ul className={'result-list'}>
      {items.map((value, index) =>
        <ResultItem key={index} value={value} />
      )}
    </ul>
  )
};

class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      pageRangeDisplayed: 8,
      marginPagesDisplayed: 3,
      trimResult: [],
      forcePage: null,
    });

    this.handlePageChange = this.handlePageChange.bind(this);
    this.getItems = this.getItems.bind(this);
  }

  getPageCount() {
    return Math.ceil(this.props.results.length / this.state.pageRangeDisplayed);
  }

  getItems(selected) {
    let offset = Math.ceil(selected * this.state.pageRangeDisplayed);
    return this.props.results.slice(offset, this.state.pageRangeDisplayed + offset);
  }

  handlePageChange(data) {
    this.setState({
      trimResult: this.getItems(data.selected),
    })
  }

  componentDidMount() {
    this.setState({
      trimResult: this.getItems(0),
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.results !== this.props.results) {
      this.setState({
        trimResult: this.getItems(0),
        forcePage: 0
      })
    }
  }

  render() {
    const {
      pageRangeDisplayed,
      marginPagesDisplayed,
      trimResult,
      forcePage
    } = this.state;
    const pageCount = this.getPageCount();

    return (
      <div id="page">
        <div className="post">
          <ResultList items={trimResult} />
          <div id="menu">
            <ReactPaginate
              pageCount={pageCount}
              pageRangeDisplayed={pageRangeDisplayed}
              marginPagesDisplayed={marginPagesDisplayed}
              onPageChange={this.handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
              subContainerClassName={'pages pagination'}
              breakClassName={'break-me'}
              forcePage={forcePage}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Result;
