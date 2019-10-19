import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { get, isEmpty } from 'lodash';
import { SIGNIN_USER } from '../../queries';
import Error from '../Error';

const initialSate = {
  username: '',
  password: '',
};

class SignIn extends React.Component {
  state = initialSate;

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  clearState = () => {
    this.setState(initialSate);
  }

  handleSubmit = (event, signinUser) => {
    event.preventDefault();
    signinUser().then(async ({ data }) => {
      console.log(data);
      localStorage.setItem('token', get(data, 'signinUser.token'));
      await this.props.refetch();
      this.clearState();
      this.props.history.push('/');
    });
  }

  validateForm = () => {
    const { username, password } = this.state;
    return isEmpty(username) || isEmpty(password);
  }

  render() {
    const { username, password } = this.state;
    const isDisabled = this.validateForm();
    return (
      <div className='App'>
        <h2 className='App'>Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => {

            return (
              <form className='form' onSubmit={event => this.handleSubmit(event, signinUser)}>
                <input
                  type='text'
                  name='username'
                  placeholder='Username'
                  onChange={this.handleChange}
                  value={username}
                />
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  onChange={this.handleChange}
                  value={password}
                />
                <button disabled={loading || isDisabled} type='submit' className='button-primary'>Submit</button>
                {error && <Error error={error}/>}
              </form>
            )
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(SignIn);
