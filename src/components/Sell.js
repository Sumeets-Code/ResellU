import React, { useState } from 'react';
import './Sell.css';

const Sell = () => {
    const [isSelling, setIsSelling] = useState(false);
    const [images, setImages] = useState([]);

    const togglePriceSection = () => {
        setIsSelling(prev => !prev);
    };

    const validateImageUpload = (event) => {
        const files = event.target.files;
        if (files.length > 5) {
            alert("You can upload a maximum of 5 images.");
            event.target.value = '';
        } else {
            setImages(Array.from(files));
        }
    };

    return (
        <div className="sell-page">
            <main>
                <div className="form-section">
                    <h2>Sell or Donate Your Item</h2>

                    {/* Checkbox to choose Sell or Donate */}
                    <label>
                        <input type="checkbox" id="sell-checkbox" checked={isSelling} onChange={togglePriceSection} />
                        Check this box if you want to sell the item (uncheck to donate)
                    </label>

                    <form action="#" method="POST" encType="multipart/form-data">
                        <label htmlFor="item-name">Item Name</label>
                        <input type="text" id="item-name" name="item-name" required />

                        <label htmlFor="item-description">Item Description</label>
                        <textarea id="item-description" name="item-description" rows="4" required></textarea>

                        <label htmlFor="item-category">Category</label>
                        <select id="item-category" name="item-category" required>
                            <option value="electronics">Electronics</option>
                            <option value="books">Books</option>
                            <option value="fashion">Fashion</option>
                            <option value="home-goods">Home Goods</option>
                        </select>

                        {/* Price section, shown only when selling */}
                        {isSelling && (
                            <div id="price-section" className="price-section">
                                <label htmlFor="item-price">Price ($)</label>
                                <input type="number" id="item-price" name="item-price" step="0.01" />
                            </div>
                        )}

                        <label htmlFor="item-condition">Condition</label>
                        <select id="item-condition" name="item-condition" required>
                            <option value="new">New</option>
                            <option value="used-like-new">Used - Like New</option>
                            <option value="used-good">Used - Good</option>
                            <option value="used-acceptable">Used - Acceptable</option>
                        </select>

                        {/* Image upload section */}
                        <div className="image-upload-section">
                            <label htmlFor="item-images">Upload Item Images (max 5):</label>
                            <input
                                type="file"
                                id="item-images"
                                name="item-images[]"
                                accept="image/*"
                                multiple
                                onChange={validateImageUpload}
                            />
                        </div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Sell;