import React, { Component } from 'react';
import Search from './components/Search/Search';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    }
  }

  onSubmit() {
    console.log('submit');
  }

  onChange() {
    console.log('change');
    console.log(this.searchTerm);
  }

  render() {
    return (
      <div className="App">
        <Search
            value={this.searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
        >
            Search
        </Search>
      </div>
    );
  }
}

export default App;
