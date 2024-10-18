import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './Profile.css';

const ProfilePage = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    // Track if the fields should be editable or not
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    // Initialize state for contact and address fields
    const [phoneNumber, setPhoneNumber] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [areaLocality, setAreaLocality] = useState('');
    const [pincode, setPincode] = useState('');

    // Function to fetch data from the server
    const fetchUserData = async () => {
        try {
            console.log('Fetching user data...');
            const response = await fetch(`http://localhost:5000/user/${user.email}`); // Replace with the actual route
            const data = await response.json();

            console.log('Fetched data:', data);  // Log fetched data for debugging

            if (response.ok) {
                // Populate the fields with data from the server
                setPhoneNumber(data.phoneNumber || '');
                setFlatNumber(data.flatNumber || '');
                setAreaLocality(data.areaLocality || '');
                setPincode(data.pincode || '');
            } else {
                console.error('Error fetching user data:', data.message);
            }
        } catch (error) {
            console.error('An error occurred while fetching user data:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    // If the user is not yet available, show a loading message or handle gracefully
    if (!user) return <div>Loading user data...</div>;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Update Contact
    const handleUpdateContact = async () => {
        if (isEditingContact) {
            try {
                const response = await fetch('http://localhost:5000/update-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email, phoneNumber }),
                });

                const data = await response.json();
                if (data.success) {
                    alert('Contact number updated successfully!');
                    setIsEditingContact(false);
                } else {
                    alert('Failed to update contact number: ' + data.message);
                }
            } catch (error) {
                console.error('Error updating contact:', error);
                alert('An error occurred while updating contact.');
            }
        } else {
            setIsEditingContact(true); // Switch to editing mode
        }
    };

    // Update Address
    const handleUpdateAddress = async () => {
        if (isEditingAddress) {
            try {
                const response = await fetch('http://localhost:5000/update-address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user.email,
                        flatNumber,
                        areaLocality,
                        pincode,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    alert('Address updated successfully!');
                    setIsEditingAddress(false);
                } else {
                    alert('Failed to update address: ' + data.message);
                }
            } catch (error) {
                console.error('Error updating address:', error);
                alert('An error occurred while updating address.');
            }
        } else {
            setIsEditingAddress(true); // Switch to editing mode
        }
    };

    return (
        <main className="profile-page">
            <div className="sidebar">
                <h2>My Account</h2>
                <ul>
                    <li><a href="#">Profile Overview</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">Address</a></li>
                    <li><a href="#">Payment Methods</a></li>
                    <li className="logout">
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </li>
                </ul>
            </div>

            <div className="content">
                <h2>Profile Overview</h2>
                <div className="profile-info">
                    <div className="profile-details">
                        <h3>{user.name || user.ngoName}</h3>
                        <p>Email: {user.email}</p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="account-section">
                    <h3>Contact</h3>
                    <ul>
                        <li>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={!isEditingContact}
                                placeholder={phoneNumber || "Enter your phone number"} // Display phone number in placeholder if it exists
                            />
                        </li>
                    </ul>
                    <button onClick={handleUpdateContact}>
                        {isEditingContact ? 'Update' : 'Edit'}
                    </button>
                </div>

                {/* Address Section */}
                <div className="account-section">
                    <h3>Address Book</h3>
                    <ul>
                        <li>
                            <input
                                type="text"
                                value={flatNumber}
                                onChange={(e) => setFlatNumber(e.target.value)}
                                disabled={!isEditingAddress}
                                placeholder={flatNumber || "Enter Flat/Building Number"} // Display flat number in placeholder if it exists
                            />
                        </li>
                        <li>
                            <input
                                type="text"
                                value={areaLocality}
                                onChange={(e) => setAreaLocality(e.target.value)}
                                disabled={!isEditingAddress}
                                placeholder={areaLocality || "Enter Area Locality"} // Display area locality in placeholder if it exists
                            />
                        </li>
                        <li>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                disabled={!isEditingAddress}
                                placeholder={pincode || "Enter Pincode"} // Display pincode in placeholder if it exists
                            />
                        </li>
                    </ul>
                    <button onClick={handleUpdateAddress}>
                        {isEditingAddress ? 'Update' : 'Edit'}
                    </button>
                </div>

                {/* Payment Methods Section */}
                <div className="account-section">
                    <h3>Payment Methods</h3>
                    <ul>
                        <li><a href="#">Visa ending in 1234</a></li>
                        <li><a href="#">MasterCard ending in 5678</a></li>
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;