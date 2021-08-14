import logo from './logo.svg';
import './App.css';
import React from 'react';

const colors = ["#420420", "#008080", "#8a2be2", "#047806", "#000080"]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      author: "",
      content: "",
      index: 0
    };
    this.randomQuote = this.randomQuote.bind(this);
  }

  async randomQuote() {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    this.setState(state => ({
      author: data.author,
      content: data.content,
      index: (state.index + 1) % colors.length
    }));
  }

  async componentDidMount() {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    this.setState({
      author: data.author,
      content: data.content
    });
  }
  
  render() {
    const color = colors[this.state.index];
    return (
      <div id="page" style={{backgroundColor: color}}>
        <div id="quote-box">
          <blockquote id="text" style={{color: color}}>{this.state.content}</blockquote>
          <cite id="author" style={{color: color}}>- {this.state.author}</cite>
          <button id="new-quote" className="button" style={{backgroundColor: color}} onClick={this.randomQuote}>New Quote</button>
          <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button fa fa-twitter" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </div>
      </div>
    );
    
  }
}

export default App;
