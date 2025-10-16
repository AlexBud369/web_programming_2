import React from 'react';
import Catalog from './pages/Catalog/catalog';
import Home from './pages/Home/home';
import "./css/index.css";
import "./css/fonts.css";

class App extends React.Component {
    state = {  
      currentPage: 'home',
    };

  switchPage = (page) => {
    this.setState({currentPage: page });
  }

  render () {
    const {currentPage} = this.state;
    return (
      <>
        {currentPage === 'home' ? 
        (<Home onPageChange = {this.switchPage}/>) : (<Catalog onPageChange = {this.switchPage}/>)}
      </>
    );
  }
}

export default App;
