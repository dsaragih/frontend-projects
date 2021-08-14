import logo from './logo.svg';
import './App.css';
import React from 'react';


const buttons = [
  [
    {'AC': 'clear'},
    {'/': 'divide'},
    {'*': 'multiply'}
  ],
  [
    {'7': 'seven'},
    {'8': 'eight'},
    {'9': 'nine'},
    {'-': 'subtract'}
  ],
  [
    {'4': 'four'},
    {'5': 'five'},
    {'6': 'six'},
    {'+': 'add'}
  ],
  [
    {'1': 'one'},
    {'2': 'two'},
    {'3': 'three'},
    {'=': 'equals'}
  ],
  [
    {'0': 'zero'},
    {'.': 'decimal'}
  ]
]

const lastOperator = input => {
  const max = Math.max(input.lastIndexOf('+'), input.lastIndexOf('-'), input.lastIndexOf('*'), input.lastIndexOf('/'));
  if (max == -1) {
    return input.includes('.') ? -1 : input.length;
  } else {return max;}
};

const calculate = input => new Function('return ' + input.join(''))();

const isOperator = input => input === '+' || input === '*' || input === '/' || input === '-';

const Square = props => {
  return (
    <button className="square" onClick={props.onClick} id={props.id}>
      {props.value === '*' ? 'x' : props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(row) {
    let key = Object.keys(row)[0];
     return (
         <Square 
           value={key}
           id={row[key]}
           onClick={() => this.props.onClick(key)}
          />
       )
  };
  

  render() {
    let rows = [];
    for (const row of this.props.squares) {
      for (const button of row) {
        rows.push(this.renderSquare(button));
      }
    };
    return (
      <div id="buttons">
        {rows}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: buttons,
      display: '0',
      calculation: '',
      inputs: ['0'],
      result: false
    };
    
    this.handleClick = this.handleClick.bind(this);
    
  }
  
  handleClick(e) {
    if (this.state.display === '0') {
      if (e === '0' || e === 'AC') {
        return;
      } else {isOperator(e) || e == '.' ? this.setState( state => ({
        inputs: state.inputs.concat([e]),
        display: state.display + e,
        calculation: '0' + e
      })) : this.setState(state => ({
        inputs: [e],
        display: e,
        calculation: e
      }))
      }
    }  
    
    else if (e == '.' && this.state.inputs.lastIndexOf('.') >= lastOperator(this.state.inputs)) {
      return;
    } 
    
    else if (e === '=') {
      
      try {
        const result = calculate(this.state.inputs);
        this.setState(state => ({
          display: String(result),
          calculation: state.calculation + '=' + String(result),
          inputs: [String(result)],
          result: true
        }))
      } catch {
        this.setState({
          display: 'Error'
        })
      }
      
    } 
    
    else if (e === 'AC'){
      this.setState({
        inputs: ['0'],
        display: '0',
        calculation: '',
        result: false
      })
    }
    
    else if (isOperator(this.state.inputs[this.state.inputs.length - 1]) && isOperator(e) && e !== '-' && !this.state.result) {
      this.setState(({
        inputs: this.state.inputs.slice(0, this.state.inputs.length - 1).concat([e]),
        display: this.state.display.slice(0, -1) + e,
        calculation: this.state.calculation.slice(0, -1) + e
      }))
    }
    
    else if (this.state.result) {
      this.setState({
        result: false
      });
      if (isOperator(e)) {
        this.setState(state => ({
          calculation: state.display,
        }));
      } else {
        isOperator(e) || e == '.' ? this.setState( state => ({
        inputs: ['0'].concat([e]),
        display: '0' + e,
        calculation: '0' + e
      })) : this.setState({
        inputs: [e],
        display: e,
        calculation: e
      })}
      
    } 
    
    else {
      this.setState( state => ({
        inputs: state.inputs.concat([e]),
        display: state.display + e,
        calculation: state.calculation + e
      }))
    }
  }
  
  render () {
    console.log(this.state)
    return (
      <div id="calculator">
        <div id="calculation">{this.state.calculation}</div>
        <div id="display">{this.state.display}</div>
        <Board 
          squares={this.state.grid} 
          onClick={i => this.handleClick(i)}
          />
      </div>
    )
  }
}

export default App;