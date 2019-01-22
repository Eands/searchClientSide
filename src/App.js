import React, { Component } from 'react';
import Search from './components/Search/Search';
import Result from './components/Result/Result';
import {articles as articleData} from './data/data';
import PorterRu from './libs/stemmerRu';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      results: [],
      searchTerm: '',
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.filterArticles = this.filterArticles.bind(this);
  }

  filterArticles(desiredValue) {
    let result = articleData;
    result = result.filter(item => {
      return (
        item.title.toLowerCase().search(PorterRu.stem(desiredValue)) != -1 ||
        item.description.toLowerCase().search(PorterRu.stem(desiredValue)) != -1
      )
    })
    this.setState({
      results: result,
    })
  }

  onSearchSubmit(event) {
    event.preventDefault();
    if (this.state.searchTerm.length >= 3) {
      this.filterArticles(this.state.searchTerm);
    }
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value,
    })
  }

  render() {
    const {
      searchTerm,
      results
    } = this.state

    return (
      <div className="App">
        <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
        >
            Search
        </Search>
        <Result results={results}/>
      </div>
    );
  }
}

export default App;
