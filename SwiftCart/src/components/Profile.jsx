import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('id');
  const userType = localStorage.getItem('role'); // 'customer', 'employee', or 'manager'

  const roleTitles = {
    customer: 'Customer',
    employee: 'Employee',
    manager: 'Manager'
  };

  const typeMap = {
    manager: 'm',
    customer: 'c',
    employee: 'e',
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
        console.log(typeMap[userType],userType,userId)
      const response = await fetch(
        `${import.meta.env.VITE_HOSTNAME}/api/${typeMap[userType]}/get_profile?id=${userId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (data && data.success) {
        setUserDetails(data.data[0]); // assuming data.data is an array
      } else {
        setError('Failed to load profile.');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('An error occurred while fetching profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-lg p-6 bg-white rounded-3xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Your Profile</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading profile...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : userDetails ? (
          <div className="space-y-4 text-gray-800 text-sm">
            <ProfileRow label="Role" value={roleTitles[userType]} />
            <ProfileRow label="Name" value={`${userDetails.first_name} ${userDetails.last_name}`} />
            <ProfileRow label="Email" value={userDetails.email} />
            <ProfileRow label="Phone" value={userDetails.phone_no} />
            <ProfileRow label="City" value={userDetails.city} />
            <ProfileRow label="State" value={userDetails.state} />
            <ProfileRow label="Pincode" value={userDetails.pincode} />
            {userDetails.experience !== undefined && (
              <ProfileRow label="Experience" value={`${userDetails.experience} years`} />
            )}
            {userDetails.warehouse_id && (
              <ProfileRow label="Warehouse ID" value={`#${userDetails.warehouse_id}`} />
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No profile data available.</p>
        )}
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-1">
    <span className="font-medium">{label}:</span>
    <span className="text-right">{value}</span>
  </div>
);

export default Profile;
