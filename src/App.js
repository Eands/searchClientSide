import React, { Component } from 'react';
import Search from './components/Search/Search';
import Result from './components/Result/Result';
import {articles as articleData} from './data/data';
import porterRu from './libs/stemmerRu';
import porterEu from './libs/stemmerEn';
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

    if (this.state.searchTerm.search(/[a-zA-Z]/) >= 0) {
      result = result.filter(item =>
        item.title.toLowerCase().search(porterEu.stemmer(desiredValue)) >= 0 ||
        item.description.toLowerCase().search(porterEu.stemmer(desiredValue)) >= 0
      )
      console.log(porterEu.stemmer(desiredValue));
      if (result.length == 0) {
        result = [{
          description: 'Not found',
        }]
      }
    } else {
      result = result.filter(item =>
        item.title.toLowerCase().search(porterRu.stem(desiredValue)) != -1 ||
        item.description.toLowerCase().search(porterRu.stem(desiredValue)) != -1
      )
      console.log(porterRu.stem(desiredValue));
      if (result.length == 0) {
        result = [{
          description: 'По вашему запросу ничего не найденно',
        }]
      }
    }
    
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
