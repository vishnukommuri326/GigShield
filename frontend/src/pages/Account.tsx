import { User, Mail, Lock, Bell, CreditCard, LogOut, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuths';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth as firebaseAuth } from '../config/firebase';
import { logout } from '../services/authService';
import { deleteUser } from 'firebase/auth';

interface AccountProps {
  onNavigate: (page: string) => void;
}

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  platform: string;
  platformAccountId: string;
}

const Account = ({ onNavigate }: AccountProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phoneNumber: '',
    platform: '',
    platformAccountId: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get platform-specific account ID label
  const getPlatformAccountIdLabel = () => {
    const labels: { [key: string]: string } = {
      'DoorDash': 'Dasher ID',
      'Uber': 'Partner ID',
      'Uber Eats': 'Partner ID',
      'Lyft': 'Driver ID',
      'Instacart': 'Shopper ID',
      'Grubhub': 'Driver ID',
      'Postmates': 'Fleet ID',
      'Shipt': 'Shopper ID',
      'Amazon Flex': 'Driver ID'
    };
    return labels[profile.platform] || 'Account ID';
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile({
            name: data.name || user.displayName || '',
            email: user.email || '',
            phoneNumber: data.phoneNumber || '',
            platform: data.platform || '',
            platformAccountId: data.platformAccountId || ''
          });
        } else {
          // If no Firestore doc, use auth data
          setProfile({
            name: user.displayName || '',
            email: user.email || '',
            phoneNumber: '',
            platform: '',
            platformAccountId: ''
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        platform: profile.platform,
        platformAccountId: profile.platformAccountId,
        updatedAt: new Date().toISOString()
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('login');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to log out');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      
      // Delete Firebase auth account
      await deleteUser(user);
      
      // Navigate to login
      onNavigate('login');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. You may need to re-authenticate first.');
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
            Account Settings
          </h1>
          <p className="text-lg text-slate-600">
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#0d9488] rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{profile.name || 'User'}</h2>
              <p className="text-slate-600">{profile.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Primary Platform
              </label>
              <select 
                value={profile.platform}
                onChange={(e) => setProfile({...profile, platform: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              >
                <option value="">Select platform...</option>
                <option value="DoorDash">DoorDash</option>
                <option value="Uber Eats">Uber Eats</option>
                <option value="Uber">Uber</option>
                <option value="Lyft">Lyft</option>
                <option value="Instacart">Instacart</option>
                <option value="Grubhub">Grubhub</option>
                <option value="Postmates">Postmates</option>
                <option value="Shipt">Shipt</option>
                <option value="Amazon Flex">Amazon Flex</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {getPlatformAccountIdLabel()}
              </label>
              <input
                type="text"
                value={profile.platformAccountId}
                onChange={(e) => setProfile({...profile, platformAccountId: e.target.value})}
                placeholder={profile.platform ? `e.g., ${getPlatformAccountIdLabel()}: ABC-123456` : 'Select a platform first'}
                disabled={!profile.platform}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                {profile.platform 
                  ? `Your ${getPlatformAccountIdLabel()} from ${profile.platform}`
                  : 'Select your platform to enter your account ID'
                }
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid gap-6">
          {/* Security */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[#0d9488]" />
              <h3 className="text-xl font-bold text-slate-800">Security</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                <span className="text-slate-700">Change Password</span>
                <span className="text-[#0d9488]">→</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                <span className="text-slate-700">Enable Two-Factor Authentication</span>
                <span className="text-[#0d9488]">→</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-[#0d9488]" />
              <h3 className="text-xl font-bold text-slate-800">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive updates about your appeals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0d9488]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d9488]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Deadline Reminders</p>
                  <p className="text-sm text-slate-500">Get reminded before appeal deadlines</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0d9488]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d9488]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-[#0d9488]" />
              <h3 className="text-xl font-bold text-slate-800">Subscription</h3>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#1e3a5f] to-[#0d9488] rounded-lg text-white mb-4">
              <p className="text-sm opacity-90 mb-1">Current Plan</p>
              <p className="text-2xl font-bold">Free Trial</p>
              <p className="text-sm opacity-90 mt-2">14 days remaining</p>
            </div>
            <button className="w-full py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors font-semibold">
              Upgrade to Premium
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-slate-800">Account Actions</h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
              >
                Log Out
              </button>
              
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium"
                >
                  Delete Account
                </button>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 mb-3 font-medium">
                    Are you sure? This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Yes, Delete My Account
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;