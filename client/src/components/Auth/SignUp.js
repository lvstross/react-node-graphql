import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { get, isEmpty } from 'lodash';
import { SIGNUP_USER } from '../../queries';
import Error from '../Error';

const initialSate = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

class SignUp extends React.Component {
  state = initialSate;

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  clearState = () => {
    this.setState(initialSate);
  }

  handleSubmit = (event, signupUser) => {
    event.preventDefault();
    signupUser().then(async ({ data }) => {
      console.log(data);
      localStorage.setItem('token', get(data, 'signupUser.token'));
      await this.props.refetch();
      this.clearState();
      this.props.history.push('/');
    });
  }

  validateForm = () => {
    const {
      username,
      email,
      password,
      passwordConfirmation,
    } = this.state;
    return password !== passwordConfirmation
    || isEmpty(username)
    || isEmpty(email)
    || isEmpty(password);
  }

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
    } = this.state;
    const isDisabled = this.validateForm();
    return (
      <div className='App'>
        <h2 className='App'>Signup</h2>
        <Mutation mutation={SIGNUP_USER} variables={{ username, email, password }}>
          {(signupUser, { data, loading, error }) => {

            return (
              <form className='form' onSubmit={event => this.handleSubmit(event, signupUser)}>
                <input
                  type='text'
                  name='username'
                  placeholder='Username'
                  onChange={this.handleChange}
                  value={username}
                />
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  onChange={this.handleChange}
                  value={email}
                />
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  onChange={this.handleChange}
                  value={password}
                />
                <input
                  type='password'
                  name='passwordConfirmation'
                  placeholder='Confirm Password'
                  onChange={this.handleChange}
                  value={passwordConfirmation}
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

export default withRouter(SignUp);
