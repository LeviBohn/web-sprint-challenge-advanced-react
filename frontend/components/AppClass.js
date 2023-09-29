import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        message: initialMessage,
        email: initialEmail,
        steps: initialSteps,
        index: initialIndex // the index the "B" is at
      }
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getNextIndex = (direction) => {
    const { index } = this.state;

    switch (direction) {
      case 'up' :
        return index < 3 ? index : index - 3;
      case 'down' :
        return index > 5 ? index : index + 3;
      case 'right':
        return index === 2 || index === 5 || index === 8 ? index : index + 1;
      case 'left':
        return index === 0 || index === 3 || index === 6 ? index : index - 1;
      case 'reset':
        return this.initialIndex;
      default:
        return index;
    }
  }
  
  getXY = () => {
    const index = this.state.index
    const x = (index % 3) + 1
    let y = null
    if (index < 3) {
      y = 1;
    } else if (index < 6) {
      y = 2;
    } else {
      y = 3;
    }
    return [x,y];
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }


  getXYMessage = () => {
    const [x,y] = this.getXY()
      return `Coordinates (${x}, ${y})`
    }
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.

  reset = () => {
    this.setState({ ...initialState});
    // Use this helper to reset all states to their initial values.
  }

  move = (direction) => {
    const newIndex = this.getNextIndex(direction);
    if (newIndex !== this.state.index) {
      this.setState({
        message: '',
        index: newIndex,
        steps: this.state.steps + 1,
      });
    } else {
      switch (direction) {
        case 'up':
          this.setState({ message: "You can't go up" });
          break;
        case 'down':
          this.setState({ message: "You can't go down" });
          break;
        case 'right':
          this.setState({ message: "You can't go right" });
          break;
        case 'left':
          this.setState({ message: "You can't go left" });
          break;
        default:
          this.setState({ message: '' });
          break;
      }
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    this.setState({ email: evt.target.value })
    // You will need this to update the value of the input.
  }

  onSubmit = evt => {
    evt.preventDefault();
    const [x,y] = this.getXY()
    const {email, steps} = this.state
    let message = null
    axios.post('http://localhost:9000/api/result', { "x": x, "y": y, "steps": steps, "email": email } )
    .then(res => {
      message = res.data.message
    })
    .catch(err => {
      message = err.response.data.message
    })
    .finally(() => {
      this.setState({
        ...this.state,
        message,
        email: initialEmail,
      })
    })
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={ className }>

        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved { this.state.steps } {`${this.state.steps === 1 ? 'time' : 'times'}`}</h3>
        </div>

        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square ${idx === this.state.index ? 'active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>

        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>

        <div id="keypad">
          <button id="left"   onClick={() => this.move('left')}>  LEFT</button>
          <button id="up"     onClick={() => this.move('up')}>    UP</button>
          <button id="right"  onClick={() => this.move('right')}> RIGHT</button>
          <button id="down"   onClick={() => this.move('down')}>  DOWN</button>
          <button id="reset"  onClick={() => this.reset()}>       reset</button>
        </div>

        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" value={this.state.email} onChange={this.onChange}placeholder="type email"></input>
          <input id="submit" type="submit" ></input>
        </form>

      </div>
    )
  }
}
