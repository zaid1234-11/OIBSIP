import React from 'react';
import Button from '../components/ui/Button';

export function Profile() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-display font-extrabold text-[#4A121A] mb-8">Account Profile</h1>
      <div className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-5">
        {['Full Name', 'Email Address', 'Phone Number'].map(field => (
          <div key={field}>
            <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">{field}</label>
            <input
              type="text"
              placeholder={field}
              className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810]"
              disabled
            />
          </div>
        ))}
        <div className="pt-2">
          <Button variant="customer-primary" disabled>Update Account</Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
