import React, { Component } from 'react';
import Search from './components/Search/Search';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '123',
    }
  }

  onSearchSubmit(event) {
    event.preventDefault();
    console.log('submit');
  }

  onSearchChange() {
    console.log('change');
  }

  render() {
    const {
      searchTerm
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
      </div>
    );
  }
}

export default App;
