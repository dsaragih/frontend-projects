import logo from './logo.svg';
import './App.css';
import React from 'react';
import DOMPurify from 'dompurify';
import marked from 'marked';

const defaultText = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`
           
function createMarkup(markdown) {
  return {__html: DOMPurify.sanitize(marked(markdown, {gfm: true, breaks: true}) , {USE_PROFILES: {html: true}})};
}

function Editor(props) {
  return (
    <textarea id="editor" value={props.input} onChange={props.onChange}>
    </textarea>
  )
}

function Previewer(props) {
  return (
    <div id="preview" dangerouslySetInnerHTML={props.text}>
    </div>
  )
}

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      input: defaultText,
      output: {__html: ''}
    }
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    this.setState(state => ({
      output: createMarkup(state.input)
    }))
  }
  
  handleChange(event) {
    const text = event.target.value;
    this.setState({
      input: text,
      output: createMarkup(text)
    })    
  }
  
  render () {
    return (
      <div id="container">
        <Editor input={this.state.input} onChange={(e) => this.handleChange(e)}/>
        <Previewer text={this.state.output}/>
      </div>
    );
  };
}

export default App;