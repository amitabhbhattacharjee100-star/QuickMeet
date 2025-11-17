import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    interestedIn: [] as string[],
    country: '',
    preferredCountries: [] as string[],
    bio: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(value)
        ? prev.interestedIn.filter(g => g !== value)
        : [...prev.interestedIn, value]
    }));
  };

  const handlePreferredCountriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !formData.preferredCountries.includes(value)) {
      setFormData(prev => ({
        ...prev,
        preferredCountries: [...prev.preferredCountries, value]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.interestedIn.length === 0) {
      setError('Please select at least one gender you are interested in');
      return;
    }

    try {
      await register({
        ...formData,
        age: parseInt(formData.age),
        interestedIn: formData.interestedIn
      });
      navigate('/discover');
    } catch (err: any) {
      if (err.response) {
        setError(err.response?.data?.message || 'Registration failed');
      } else if (err.request) {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'India',
    'Japan', 'South Korea', 'China', 'Brazil', 'Mexico', 'Argentina', 'South Africa'
  ];

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h1>QuickMeet</h1>
          <p>Create your account to start connecting</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              className="input"
              value={formData.age}
              onChange={handleChange}
              required
              min={18}
            />
          </div>

          <div className="form-group">
            <label>Your Gender</label>
            <select
              name="gender"
              className="select"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="man">Man</option>
              <option value="woman">Woman</option>
              <option value="non-binary">Non-binary</option>
              <option value="custom">Custom</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label>Interested In</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="man"
                  checked={formData.interestedIn.includes('man')}
                  onChange={handleInterestedInChange}
                />
                Men
              </label>
              <label>
                <input
                  type="checkbox"
                  value="woman"
                  checked={formData.interestedIn.includes('woman')}
                  onChange={handleInterestedInChange}
                />
                Women
              </label>
              <label>
                <input
                  type="checkbox"
                  value="non-binary"
                  checked={formData.interestedIn.includes('non-binary')}
                  onChange={handleInterestedInChange}
                />
                Non-binary
              </label>
              <label>
                <input
                  type="checkbox"
                  value="everyone"
                  checked={formData.interestedIn.includes('everyone')}
                  onChange={handleInterestedInChange}
                />
                Everyone
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Your Country</label>
            <select
              name="country"
              className="select"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Countries (Optional)</label>
            <select
              className="select"
              onChange={handlePreferredCountriesChange}
              value=""
            >
              <option value="">Add a country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {formData.preferredCountries.length > 0 && (
              <div className="tag-list">
                {formData.preferredCountries.map(country => (
                  <span key={country} className="tag">
                    {country}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        preferredCountries: prev.preferredCountries.filter(c => c !== country)
                      }))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Bio (Optional)</label>
            <textarea
              name="bio"
              className="input"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign Up
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

