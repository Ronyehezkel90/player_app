import React from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom'
import './App.css';
import Looper from './Looper/Looper'

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Looper/>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

export default App;
