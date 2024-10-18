import React, { useState } from 'react';
import './Prod.css'; // Import the CSS file

const ProductDetail = () => {
    const [mainImage, setMainImage] = useState('https://via.placeholder.com/500x500');

    const changeMainImage = (imageSrc) => {
        setMainImage(imageSrc);
    };

    return (
        <div>
            <header>
                <div className="logo">
                    <img src="https://via.placeholder.com/100x30" alt="Amazon Logo" />
                </div>
                <div className="nav-links">
                    <a href="#">Home</a>
                    <a href="#">Orders</a>
                    <a href="#">Cart</a>
                    <a href="#">Profile</a>
                </div>
            </header>

            <main>
                <div className="product-images">
                    <img id="main-image" src={mainImage} alt="Product Image" />

                    <div className="thumbnail-gallery">
                        <img src="https://via.placeholder.com/500x500" alt="Thumbnail 1" onClick={() => changeMainImage('https://via.placeholder.com/500x500')} />
                        <img src="https://via.placeholder.com/500x501" alt="Thumbnail 2" onClick={() => changeMainImage('https://via.placeholder.com/500x501')} />
                        <img src="https://via.placeholder.com/500x502" alt="Thumbnail 3" onClick={() => changeMainImage('https://via.placeholder.com/500x502')} />
                        <img src="https://via.placeholder.com/500x503" alt="Thumbnail 4" onClick={() => changeMainImage('https://via.placeholder.com/500x503')} />
                    </div>
                </div>

                <div className="product-details">
                    <h1>Product Title Goes Here</h1>
                    <p className="price">$19.99</p>
                    <p>Product description goes here. It explains the features, specifications, and any other details that are relevant to the customer about this particular item.</p>

                    <div className="product-options">
                        <label htmlFor="product-color">Color:</label>
                        <select id="product-color" name="product-color">
                            <option value="black">Black</option>
                            <option value="white">White</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                        </select>

                        <label htmlFor="product-size" style={{ marginTop: '15px' }}>Size:</label>
                        <select id="product-size" name="product-size">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="x-large">X-Large</option>
                        </select>
                    </div>

                    <button type="button">Add to Cart</button>
                </div>
            </main>

            <footer>
                <p>&copy; 2024 Amazon Clone. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ProductDetail;