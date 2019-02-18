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
      articles: articleData,
      results: [],
      searchTerm: '',
      searchOptions: {
        location: 0,
        includeMatches: true,
        shouldSort: true,
        threshold: 0.2,
        distance: 40000,
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
    this.highlight = this.highlight.bind(this);
    this.trimArticles = this.trimArticles.bind(this);
  }

  highlight(resultSearch, className) {
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
        const differenceRegion = region[1] - region[0];
        const searchTermLength = this.stemWord(this.state.searchTerm).length - 1;
        if (searchTermLength <= differenceRegion) {
          const lastIndex = region[1] + 1;
          content.push(
            inputText.substring(startIndex, region[0]),
            <b className={className}>
              {inputText.substring(region[0], lastIndex)}
            </b>
          );
          startIndex = lastIndex;
        }
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
    let result;
    const fuse = new Fuse(this.state.articles, this.state.searchOptions);
    result = fuse.search(this.stemWord(this.state.searchTerm));
    if (result.length === 0) {
      this.setState({
        results: [{
          description: 'Nothing found'
        }]
      });
    } else {
      this.setState({
        results: this.trimArticles(this.highlight(result, 'className')),
      })
    }
  }

  trimArticles(articles) {
    articles.map(article => {
      if (article.description[0] !== undefined && article.description[0].length >= 150) {
        let tmp;
        tmp = '...' + article.description[0].slice(-350);
        if (article.description[2] === undefined) {
          tmp = article.description[0].substring(0, 300) + '...';
        }
        article.description[0] = tmp;
      }
      if (article.description[2] !== undefined && article.description[2].length >= 150) {
        article.description[2] = article.description[2].substring(0, 150) + '...';
      }
    });
    return articles;
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
          Поиск
        </Search>
        {results.length !== 0 ? <Result results={results}/> : null}
      </div>
    );
  }
}

export default App;
