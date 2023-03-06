/* eslint-env browser, node */
/* global React */

const marked = require('marked');

let typing = false;
let typingTimer;

document.addEventListener('DOMContentLoaded', function onLoad() {
  const app = React.createElement(App);
  ReactDOM.render(app, document.body);
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      url: '',
      users: [],
      messages: [],
      status: '',
      isLoggedIn: false // new state to track login status
    };
    this.onLogin = this.onLogin.bind(this);
    this.onNotUnderstood = this.onNotUnderstood.bind(this);
    this.onUnderstood = this.onUnderstood.bind(this);
  }
  initSocket(url) {
    this.setState({ status: 'Connexion...' });
    const socket = io.connect(url);
    socket.on('connect', () => {
      this.appendMessage(`Connecté au server ${ this.state.url }`);
      this.setState({ status: '' });
    });
    socket.on('message', data => {
      this.appendMessage(`__${ data.username }:__ ${ data.text }`);
    });
    socket.on('login', data => {
      this.appendMessage(`${ data.username } c'est connecté.`);
      this.setState({ users: data.users });
    });
    socket.on('typing', data => {
      this.setState({ status: `${ data.username } est entrain d'écrire...` });
    });
    socket.on('stop-typing', () => {
      this.setState({ status: '' });
    });
    socket.on('logout', data => {
      this.appendMessage(`${ data.username } c'est déconnecté.`);
      this.setState({ users: data.users });
    });
    this.socket = socket;
  }
  appendMessage(message) {
    this.setState((prev, props) => {
      const messages = prev.messages;
      messages.push(message);
      return { messages };
    });
  }
  onLogin(url, username) {
    this.setState({ url, username, isLoggedIn: true });
    this.initSocket(url);
    this.socket.emit('login', { username });
    this.refs.inputBar.focus();
  }
  
  onInput(text) {
    const username = this.state.username;
    if (!typing) {
      typing = true;
      this.socket.emit('typing', { username });
    }
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
    typingTimer = setTimeout(() => {
      typing = false;
      this.socket.emit('stop-typing', { username });
    }, 1000);
  }
  onSend(text) {
    const username = this.state.username;
    this.socket.emit('message', { username, text });
  }
  componentDidMount() {
    this.refs.loginBox.focus();
  }
  onNotUnderstood() {
    const username = this.state.username;
    this.socket.emit('message', { username, text: "Compris" });
  }

  onUnderstood() {
    const username = this.state.username;
    this.socket.emit('message', { username, text: 'Pas compris' });
  }

  componentDidMount() {
    this.refs.loginBox.focus();
  }
  
  render() {
    return React.createElement(
      'main',
      null,
      this.state.isLoggedIn ?
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(ChatArea, { messages: this.state.messages, status: this.state.status })
        ) :
        React.createElement(LoginBox, { ref: 'loginBox', onLogin: this.onLogin }),
      React.createElement(
        'div',
        { className: 'buttons' },
        React.createElement('button', { onClick: this.onNotUnderstood }, "Pas compris"),
        React.createElement('button', { onClick: this.onUnderstood }, "Compris")
      )
    );
  }
}  


class LoginBox extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  focus() {
    this.refs.username.focus();
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      const value = this.refs.username.value.trim();
      const url = this.refs.url.value.trim();
      if (value) {
        this.props.onLogin(url, value);
        this.refs.root.classList.add('hidden');
      }
    }
  }
  render() {
    return React.createElement(
      'div',
      { id: 'login-box', ref: 'root' },
      React.createElement(
        'div',
        null,
        React.createElement(
          'h2',
          null,
          'Connexion'
        ),
        React.createElement('input', { type: 'url', id: 'server-url', placeholder: 'Adresse IP server',ref: 'url', value: this.props.url }),
        React.createElement('input', { type: 'text', placeholder: 'Nom Prénom', id: 'username', ref: 'username', onKeyDown: this.onKeyDown, autofocus: true })
      )
    );
  }
}


class ChatArea extends React.Component {
  render() {
    const opts = { sanitize: true };
    const text = this.props.messages.map(msg => `${ marked(msg, opts) }\n`).join('');
    return React.createElement(
      'div',
      { id: 'chat' },
      React.createElement('div', { id: 'chat-text', dangerouslySetInnerHTML: { __html: text } }),
      React.createElement(
        'div',
        { id: 'chat-status-msg' },
        this.props.status
      )
    );
  }
}

class InputBar extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onNotUnderstood = this.onNotUnderstood.bind(this);
    this.onUnderstood = this.onUnderstood.bind(this);
    this.state = { inputValue: '' };
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.send();
    }
  }

  onInput() {
    const value = this.refs.input.value.trim();
    this.setState({ inputValue: value });
    this.props.onInput(value);
  }

  onNotUnderstood() {
    const value = 'Pas compris';
    this.props.onSend(value);
    this.setState({ inputValue: '' });
  }

  onUnderstood() {
    const value = 'Compris';
    this.props.onSend(value);
    this.setState({ inputValue: '' });
  }

  send() {
    const value = this.state.inputValue;
    if (value) {
      this.props.onSend(value);
      this.setState({ inputValue: '' });
    }
  }

  focus() {
    this.refs.input.focus();
  }

  render() {
    return React.createElement(
      'div',
      { className: 'input' },
      React.createElement('input', {
        type: 'text',
        id: 'text-input',
        ref: 'input',
        placeholder: 'Dites quelque chose...',
        value: this.state.inputValue,
        onInput: this.onInput,
        onKeyDown: this.onKeyDown
      }),
      React.createElement(
        'button',
        { id: 'Not-btn', onClick: this.onNotUnderstood },
        'Pas-Compris'
      ),
      React.createElement(
        'button',
        { id: 'Yes-btn', onClick: this.onUnderstood },
        'Compris'
      ),
      
    );
  }
}
