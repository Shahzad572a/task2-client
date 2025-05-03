import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, signup } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Auth = ({ isSignup = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const { error, loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isSignup ? signup(form) : login(form);
    dispatch(action)
      .unwrap()
      .then(() => {
        navigate('/todos');
      })
      .catch((err) => {
        console.error('Auth error:', err);
      });
  };

  return (
    <div className="auth-box">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>

        <div className="input-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

        </div>
        <div className='btn'>

          <button type="submit" className="add-inline-btn" disabled={loading}>
            {isSignup ? 'Sign Up' : 'Log in'}
          </button>
        </div>


        <div className="divider text">
          <span>or</span>
        </div>



        {error && <p className="error text">{error}</p>}

        <div className="auth-switch text">
          {isSignup ? (
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          ) : (
            <p>
              Don’t have an account? <Link to="/signup">SignUp</Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Auth;
