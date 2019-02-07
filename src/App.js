import React, {Component} from 'react';
import Search from './components/Search/Search';
import Result from './components/Result/Result';
import {articles as articleData} from './data/data';
import Fuse from 'fuse.js';
import porterRu from './libs/stemmerRu';
import porterEu from './libs/stemmerEn';
import './App.css';

const highlight = (resultSearch, className) => {
  const set = (obj, path, value) => {
    const pathValue = path.split('.');
    let i;
    for (i = 0; i < pathValue.length - 1; i++) {
      obj = obj[pathValue[i]];
    }
    obj[pathValue[i]] = value;
  };
  const generateHighlightedText = (inputText, regions) => {
    let content = [];
    let startIndex = 0;
    regions.forEach(region => {
      const lastIndex = region[1] + 1;
      content.push(
        inputText.substring(startIndex, region[0]),
        <b className={className}>
          {inputText.substring(region[0], lastIndex)}
        </b>
      );
      startIndex = lastIndex;
    });
    content.push(inputText.substring(startIndex));
    return content;
  };
  return resultSearch
    .filter(({matches}) => matches && matches.length)
    .map(({item, matches}) => {
      const highlightedItem = {...item};
      matches.forEach((match) => {
        set(highlightedItem, match.key, generateHighlightedText(match.value, match.indices));
      });
      return highlightedItem;
    });
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHits: false,
      results: [],
      searchTerm: '',
      searchOptions: {
        location: 0,
        includeMatches: true,
        shouldSort: true,
        threshold: 0.6,
        distance: 10000,
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
    this.highlightResults = this.highlightResults.bind(this);
  }

  lastWord(words) {
    let n = words.split(" ");
    return n[n.length - 1];
  }

  stemWord(words) {
    const lastSpaceIndex = words.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      let withoutLastWord = words.substring(0, lastSpaceIndex);
      if (this.lastWord(this.state.searchTerm).search(/[a-zA-Z]/) >= 0) {
        words = withoutLastWord + ' ' + porterEu.stemmer(this.lastWord(this.state.searchTerm));
      } else if (this.lastWord(this.state.searchTerm).search(/[а-яА-Я]/) >= 0) {
        words = withoutLastWord + ' ' + porterRu.stem(this.lastWord(this.state.searchTerm));
      }
    } else {
      if (this.lastWord(this.state.searchTerm).search(/[a-zA-Z]/) >= 0) {
        words = porterEu.stemmer(this.lastWord(this.state.searchTerm));
      } else if (this.lastWord(this.state.searchTerm).search(/[а-яА-Я]/) >= 0) {
        words = porterRu.stem(this.lastWord(this.state.searchTerm));
      }
    }
    return words;
  }

  filterArticles() {
    //time
    let time = performance.now();
    //let highlightResults = [];
    let result;

    const fuse = new Fuse(articleData, this.state.searchOptions);
    result = fuse.search(this.state.searchTerm);
    if (result.length === 0) {
      //todo: do something
    } else {
      console.log(highlight(result, 'className'));
      this.setState({
        results: highlight(result, 'className'),
      })
    }
    //time
    time = performance.now() - time;
    console.log('Время выполнения = ', time);
  }

  highlightResults(resultItem) {
    resultItem.matches.map((matchItem) => {
      let text = resultItem.item[matchItem.key];
      let matches = [].concat(matchItem.indices);
      let result = [];

      /*let count = 0; not work
      matches.map((match, index) => {
        result[count++] = text.substring(0, match[0])
        result[count++] = <b>{text.substring(match[0], match[1])}</b>
        result[count++] = text.substring(match[1], text.length);
        text = text.substring(match[1], text.length);
      })*/

      if (matches[0][0] === 0) {
        text = text.substring(0, matches[0][1] + 300) + '...';
      } else {
        text = text.substring(matches[0][0] - 150, matches[0][1] + 150) + '...';
      }

      result[0] = text.substring(0, matches[0][0]);
      result[1] = <b>{text.substring(matches[0][0], matches[0][1])}</b>;
      result[2] = text.substring(matches[0][1], text.length);
      resultItem.item[matchItem.key] = result;
      if (resultItem.children && resultItem.children.length > 0) {
        resultItem.children.map((child) => {
          this.highlightResults(child);
        });
      }
    });
    return resultItem;
  }

  onSearchSubmit(event) {
    event.preventDefault();
    this.setState({
      results: []
    });
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
