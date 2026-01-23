import { User, Mail, Lock, Bell, CreditCard, LogOut } from 'lucide-react';

interface AccountProps {
  onNavigate: (page: string) => void;
}

const Account = ({ onNavigate }: AccountProps) => {
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
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#0d9488] rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">John Doe</h2>
              <p className="text-slate-600">john.doe@email.com</p>
              <button className="mt-2 text-[#0d9488] hover:underline text-sm font-medium">
                Change profile picture
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="john.doe@email.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Primary Platform
              </label>
              <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent">
                <option>DoorDash</option>
                <option>Uber</option>
                <option>Instacart</option>
                <option>Lyft</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors">
              Save Changes
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
              <button className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">
                Log Out
              </button>
              <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
