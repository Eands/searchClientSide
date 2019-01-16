import React, { Component } from 'react';
import Search from './components/Search/Search';
import Result from './components/Result/Result';
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

    const results = [{
      title: 'title',
      url: 'url'
    },{
      title: 'title',
      url: 'url'
    },{
      title: 'title',
      url: 'url'
    }]

    return (
      <div className="App">
        <Search
            value = {searchTerm}
            onChange = {this.onSearchChange}
            onSubmit = {this.onSearchSubmit}
        >
            Search
        </Search>
        <Result results = {results}/>
      </div>
    );
  }
}

export default App;
