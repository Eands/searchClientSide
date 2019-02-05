import React, { Component } from 'react';
import Search from './components/Search/Search';
import Result from './components/Result/Result';
import { articles as articleData } from './data/data';
import Fuse from 'fuse.js';
import porterRu from './libs/stemmerRu';
import porterEu from './libs/stemmerEn';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHits: false,
      results: [],
      searchTerm: '',
      searchOptions: {
        findAllMatches: true,
        includeMatches: true,
        shouldSort: true,
        threshold: 0.6,
        distance: 9000,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: [
          'title',
          'description'
        ]
      }
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.filterArticles = this.filterArticles.bind(this);
    this.highlitResults = this.highlitResults.bind(this);
  }

  lastWord(words) {
    var n = words.split(" ");
    return n[n.length - 1];
  }

  filterArticles() {
    let highlitResults = [];

    let time = performance.now();
    let trimmedSearchWords = this.state.searchTerm;
    const fuse = new Fuse(articleData, this.state.searchOptions);
    if (this.lastWord(this.state.searchTerm).search(/[a-zA-Z]/) >= 0) {
      trimmedSearchWords = trimmedSearchWords.substring(0, trimmedSearchWords.indexOf(' ')) + ' ' + porterEu.stemmer(this.lastWord(this.state.searchTerm));
    } else if (this.lastWord(this.state.searchTerm).search(/[а-яА-Я]/) >= 0) {
      trimmedSearchWords = trimmedSearchWords.substring(0, trimmedSearchWords.indexOf(' ')) + ' ' + porterRu.stem(this.lastWord(this.state.searchTerm));
    }
    let result = fuse.search(trimmedSearchWords);

    if (result.length === 0) {
      result.item = [{
        description: 'Nothing found',
      }]
      this.setState({
        results: result,
      })
    } else {
      result.map(item =>
        highlitResults.push(this.highlitResults(item))
      )
      this.setState({
        results: highlitResults,
      })
    }
    //time
    time = performance.now() - time;
    console.log('Время выполнения = ', time);
  }

  highlitResults(resultItem) {
    resultItem.matches.forEach((matchItem) => {
      let text = resultItem.item[matchItem.key];
      let matches = [].concat(matchItem.indices);
      let result = [];
      let pair = matches.shift()
      result[0] = text.substring(0, pair[0]);
      result[1] = <b>{text.substring(pair[0], pair[1])}</b>
      result[2] = text.substring(pair[1], text.length);
      resultItem.item[matchItem.key] = result;
      if (resultItem.children && resultItem.children.length > 0) {
        resultItem.children.forEach((child) => {
          this.highlitResults(child);
        });
      }
    });
    return resultItem;
  }

  onSearchSubmit(event) {
    event.preventDefault();
    this.setState({
      results: []
    })
    if (this.state.searchTerm.length >= 3) {
      this.filterArticles();
    }
  }

  onSearchChange(event) {
    if (event.target.value.length === 0) {
      this.setState({
        results: []
      })
    }
    this.setState({
      searchTerm: event.target.value,
    })
  }

  render() {
    const {
      searchTerm,
      results
    } = this.state;

    return (
      <div className="App">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
          Search
        </Search>
        <Result results={results} />
      </div>
    );
  }
}

export default App;
