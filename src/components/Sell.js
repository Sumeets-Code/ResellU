import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sell.css';

const Sell = () => {
    const [transactionType, setTransactionType] = useState('donate');
    const [images, setImages] = useState([]);
    const [itemData, setItemData] = useState({
        itemName: '',
        itemDescription: '',
        itemPrice: '',
        itemNegotiable: 'yes',
        itemCondition: 'new',
    });

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleTransactionChange = (event) => {
        setTransactionType(event.target.value);
    };

    const validateImageUpload = (event) => {
        const files = event.target.files;
        if (files.length > 3) {
            alert('You can upload a maximum of 3 images.');
            event.target.value = '';
        } else {
            setImages(Array.from(files));
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setItemData({ ...itemData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user || !user.email) {
            alert('You need to be logged in to submit this form.');
            return;
        }

        // Create a FormData object to send files and data
        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('itemName', itemData.itemName);
        formData.append('itemDescription', itemData.itemDescription);
        formData.append('transactionType', transactionType);
        formData.append('itemCondition', itemData.itemCondition);

        if (transactionType === 'sell') {
            formData.append('itemPrice', itemData.itemPrice);
            formData.append('itemNegotiable', itemData.itemNegotiable);
        }

        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const response = await axios.post('http://localhost:5000/sell', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert('Item submitted successfully!');
                // Reset the form
                setItemData({
                    itemName: '',
                    itemDescription: '',
                    itemPrice: '',
                    itemNegotiable: 'yes',
                    itemCondition: 'new',
                });
                setImages([]);
                navigate('/profile');
            } else {
                alert('Error submitting item: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error submitting form', error);
            alert('Error submitting item: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="sell-page">
            <main>
                <div className="form-section">
                    <h2>Sell or Donate Your Item</h2>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <label htmlFor="item-name">Item Name</label>
                        <input
                            type="text"
                            id="item-name"
                            name="itemName"
                            value={itemData.itemName}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="item-description">Item Description</label>
                        <textarea
                            id="item-description"
                            name="itemDescription"
                            rows="4"
                            value={itemData.itemDescription}
                            onChange={handleInputChange}
                            required
                        ></textarea>

                        <label htmlFor="transaction-type">Transaction Type</label>
                        <select
                            id="transaction-type"
                            name="transactionType"
                            value={transactionType}
                            onChange={handleTransactionChange}
                            required
                        >
                            <option value="sell">Sell</option>
                            <option value="donate">Donate</option>
                        </select>

                        {transactionType === 'sell' && (
                            <>
                                <label htmlFor="item-price">Price (Rs)</label>
                                <input
                                    type="number"
                                    id="item-price"
                                    name="itemPrice"
                                    value={itemData.itemPrice}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    required
                                />

                                <label htmlFor="item-negotiable">Is the price negotiable?</label>
                                <select
                                    id="item-negotiable"
                                    name="itemNegotiable"
                                    value={itemData.itemNegotiable}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </>
                        )}

                        <label htmlFor="item-condition">Condition</label>
                        <select
                            id="item-condition"
                            name="itemCondition"
                            value={itemData.itemCondition}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="New">New</option>
                            <option value="Used-Like-New">Used - Like New</option>
                            <option value="Used-Good">Used - Good</option>
                            <option value="Used-Acceptable">Used - Acceptable</option>
                        </select>

                        <label htmlFor="item-images">Upload Item Images (max 3):</label>
                        <input
                            type="file"
                            id="item-images"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={validateImageUpload}
                            required
                        />

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Sell;