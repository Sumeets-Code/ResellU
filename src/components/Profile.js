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

    // State for item names
    const [itemNames, setItemNames] = useState([]);

    // Function to fetch data from the server
    const fetchUserData = async () => {
        try {
            console.log('Fetching user data...');
            const response = await fetch(`http://localhost:5000/user/${user.email}`);
            const data = await response.json();

            console.log('Fetched data:', data);

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

    // Function to fetch item names by user email
    const fetchItemNames = async () => {
        try {
            const response = await fetch(`http://localhost:5000/items/user/${user.email}`);
            const data = await response.json();

            if (response.ok) {
                setItemNames(data);
            } else {
                console.error('Error fetching item names:', data.message);
            }
        } catch (error) {
            console.error('An error occurred while fetching item names:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchItemNames();
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
            if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
                alert('Phone number must be exactly 10 digits.');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5000/update-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user.email,
                        phoneNumber,
                        isNGO: user.isNGO,
                    }),
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
            setIsEditingContact(true);
        }
    };

    // Update Address
    const handleUpdateAddress = async () => {
        if (isEditingAddress) {
            console.log('Sending isNGO:', user.ngoName ? true : false);
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
                        isNGO: user.isNGO,
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
            setIsEditingAddress(true);
        }
    };

    // New delete function
    const handleDelete = async (itemName) => {
        const userEmail = user.email;

        // Show confirmation dialog
        const confirmDelete = window.confirm(`Are you sure you want to delete "${itemName}"?`);

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/items/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, itemName }),
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                fetchItemNames();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('An error occurred while deleting the item:', error);
            alert('An error occurred while trying to delete the item.');
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
                    <li><a href="#">Product for Sale</a></li>
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
                                placeholder={phoneNumber || "Enter your phone number"}
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
                                placeholder={flatNumber || "Enter Flat/Building Number"}
                            />
                        </li>
                        <li>
                            <input
                                type="text"
                                value={areaLocality}
                                onChange={(e) => setAreaLocality(e.target.value)}
                                disabled={!isEditingAddress}
                                placeholder={areaLocality || "Enter Area Locality"}
                            />
                        </li>
                        <li>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                disabled={!isEditingAddress}
                                placeholder={pincode || "Enter Pincode"}
                            />
                        </li>
                    </ul>
                    <button onClick={handleUpdateAddress}>
                        {isEditingAddress ? 'Update' : 'Edit'}
                    </button>
                </div>

                {/* Product for Sale Section */}
                <div className="account-section">
                    <h3>Product for Sale (Click to delete)</h3>
                    <ul>
                        {itemNames.map((itemName, index) => (
                            <li key={index}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(itemName);
                                    }}
                                    className="delete-item-link"
                                >
                                    {itemName}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;