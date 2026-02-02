import { User, Mail, Lock, Bell, LogOut, Check, AlertCircle, X } from 'lucide-react';
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
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

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

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth');
      
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email!,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, passwordData.newPassword);
      
      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (err.code === 'auth/weak-password') {
        setError('New password is too weak');
      } else {
        setError('Failed to change password. Please try again.');
      }
    } finally {
      setChangingPassword(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-5xl font-extrabold text-[#0f172a] mb-3 tracking-tight">
            Account Settings
          </h1>
          <p className="text-slate-600 text-xl font-medium">
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
            <div className="w-24 h-24 bg-[#0f172a] rounded-full flex items-center justify-center">
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
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
              className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0f172a] rounded-xl hover:shadow-xl hover:shadow-[#d4af37]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold transform hover:scale-105 active:scale-95"
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
              <Lock className="w-6 h-6 text-[#d4af37]" />
              <h3 className="text-xl font-bold text-slate-800">Security</h3>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => setShowPasswordChange(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <span className="text-slate-700">Change Password</span>
                <span className="text-[#d4af37]">→</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-[#d4af37]" />
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
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d4af37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                </label>
              </div>
            </div>
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

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setError('');
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium"
                  disabled={changingPassword}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={changingPassword}
                  className="flex-1 px-4 py-3 bg-[#d4af37] hover:bg-[#d4af37]/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;