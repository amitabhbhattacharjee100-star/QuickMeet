import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    interestedIn: user?.interestedIn || [],
    country: user?.country || '',
    preferredCountries: user?.preferredCountries || [],
    bio: user?.bio || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age?.toString() || '',
        gender: user.gender || '',
        interestedIn: user.interestedIn || [],
        country: user.country || '',
        preferredCountries: user.preferredCountries || [],
        bio: user.bio || ''
      });
    }
  }, [user]);

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
    if (formData.interestedIn.length === 0) {
      alert('Please select at least one gender you are interested in');
      return;
    }
    await updateUser({
      ...formData,
      age: parseInt(formData.age),
      interestedIn: formData.interestedIn.length === 0 ? ['everyone'] : formData.interestedIn
    });
    alert('Profile updated successfully!');
    navigate('/discover');
  };

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'India',
    'Japan', 'South Korea', 'China', 'Brazil', 'Mexico', 'Argentina', 'South Africa'
  ];

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-header">
          <button onClick={() => navigate('/discover')} className="btn-back">← Back</button>
          <h1>Settings</h1>
        </div>

        <form onSubmit={handleSubmit}>
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
            Save Changes
          </button>
        </form>

        <div className="settings-footer">
          <button onClick={logout} className="btn btn-danger" style={{ width: '100%' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

