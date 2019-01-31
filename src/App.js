import React, {Component} from 'react';
import Search from './components/Search/Search';
import Result from './components/Result/Result';
import {articles as articleData} from './data/data';
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
        threshold: 0.8,
        distance: 100,
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
  }

  filterArticles() {
    const matchString = this.state.searchTerm;
    const fuse = new Fuse(articleData, this.state.searchOptions);
    let tmpString = [];

    matchString.split(/\s+/).map(word => {
      if (word.search(/[a-zA-Z]/) >= 0) {
        tmpString.push(porterEu.stemmer(word));
      } else if (word.search(/[а-яА-Я]/) >= 0) {
        tmpString.push(porterRu.stem(word));
      } else {
        tmpString.push(word);
      }
    });
    let trimmedMathString = tmpString.join(' ');
    //let regString = new RegExp(tmpString.join('[^]*'), 'g');
    let result = fuse.search(trimmedMathString);
    /*result = result.filter(item =>
      item.title.toLowerCase().search(regString) >= 0 ||
      item.description.toLowerCase().search(regString) >= 0
    );*/
    if (result.length === 0) {
      result = [{
        description: 'Nothing found',
      }]
    }

    this.setState({
      results: result,
    })
  }

  onSearchSubmit(event) {
    event.preventDefault();
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
        <Result results={results}/>
      </div>
    );
  }
}

export default App;
