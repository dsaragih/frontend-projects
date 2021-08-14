import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Mui from '@material-ui/core/';
import bass from './sounds/bass.mp3';
import closed_hihat from './sounds/closed-hihat.mp3';
import cymbal_crash from './sounds/cymbal-crash.mp3';
import cymbal_scrape from './sounds/cymbal-scrape.mp3';
import floor_tom from './sounds/floor-tom.mp3';
import medium_tom from './sounds/medium-tom.mp3';
import open_hihat from './sounds/open-hihat.mp3';
import snare from './sounds/snare.mp3';
import sticks from './sounds/sticks.mp3';


const pads = {
  Q: ['bass', bass],
  W: ['closed_hihat', closed_hihat],
  E: ['cymbal_crash', cymbal_crash],
  A: ['cymbal_scrape', cymbal_scrape],
  S: ['floor_tom', floor_tom],
  D: ['medium_tom', medium_tom],
  Z: ['open_hihat', open_hihat],
  X: ['snare', snare],
  C: ['sticks', sticks]
}

// From Material-UI: https://material-ui.com/components/switches/
const AntSwitch = Mui.withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Mui.Switch);

const Slider = props => {

  return (
    <div>
      <Mui.Typography id="continuous-slider" gutterBottom>
            Volume
      </Mui.Typography>
      <Mui.Grid container spacing={2}>
        <Mui.Grid item xs>
          <Mui.Slider value={props.value} onChange={props.onChange} aria-label="Volume" min={0} max={100} valueLabelDisplay="auto" />
        </Mui.Grid>
      </Mui.Grid>
    </div>
  )
}

const Pads = props => {
  return (
    <button className="drum-pad" id={props.value} onClick={props.onClick}>
      {props.keypress}
    </button>
  )
}

class Board extends React.Component {
  renderPad(pad) {
    return (
      <Pads key={pad[1][0]} 
      value={pad[1][0]}
      keypress={pad[0]} 
      onClick={() => this.props.onClick(pad[1][0], pad[1][1])}/>
    )
  }

  render() {
    let board = [];
    for (const [key, sound] of Object.entries(this.props.board)) {
      board.push(this.renderPad([key, sound]));
    }
    return (
      <div id="board">
        {board}
      </div>
    )
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: pads,
      display: '',
      on: false,
      volume: 40
    };
    this.handlePress = this.handlePress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
  }

  handlePress(event) {
    if (!this.state.on) return;
    let key = this.state.board[event.key.toUpperCase()];
    if (key) {
      this.setState({
        display: key[0]
      });
      let audio = new Audio(key[1]);
      audio.volume = this.state.volume / 100;
      audio.play()
      .catch(error => {
        console.log("Audio unable to load " + error);
      })
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handlePress,false);
  }

  handleChange() {
    this.setState(state => ({
      on: !state.on,
      display: ''
    }))
  }

  handleVolumeChange(event, value) {
    this.setState({
      volume: value
    })
  }

  handleClick(id, sound) {
    if (!this.state.on) return;
    this.setState({
      display: id
    });
    let audio = new Audio(sound);
    audio.volume = this.state.volume / 100;
    audio.play()
    .catch(error => {
      console.log("Audio failed to load: " + error);
    });
  }

  render() {
    return (
      <div id="drum-machine">
        <Board 
        board={this.state.board} 
        onClick={(id, sound) => this.handleClick(id, sound)}
        />
        <div id="controls">
          <Mui.Typography component="div">
            <Mui.Grid component="label" container alignItems="center" spacing={1}>
              <Mui.Grid item>Off</Mui.Grid>
              <Mui.Grid item>
                <AntSwitch  onChange={this.handleChange} name="switch" />
              </Mui.Grid>
              <Mui.Grid item>On</Mui.Grid>
            </Mui.Grid>
          </Mui.Typography>
          <div id="display">
            {this.state.display}
          </div>
          <Slider value={this.state.volume} onChange={(e, v) => this.handleVolumeChange(e, v)}/>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));