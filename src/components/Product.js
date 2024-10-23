import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './Product.css';

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [ownerDetails, setOwnerDetails] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const changeMainImage = (imageSrc) => {
        setMainImage(imageSrc);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/items/${id}`);
                const data = await response.json();
                setProduct(data);
                setMainImage(data.images[0]);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    // Function to fetch owner details
    const fetchOwnerDetails = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (product) {
            try {
                const response = await fetch(`http://localhost:5000/items/${product._id}/owner`);
                const ownerData = await response.json();

                if (ownerData.success === false) {
                    console.error(ownerData.message);
                    setOwnerDetails(null);
                } else {
                    setOwnerDetails(ownerData);
                }
            } catch (error) {
                console.error('Error fetching owner details:', error);
            }
        }
    };

    if (!product) {
        return <p>Loading product...</p>;
    }

    return (
        <div className="product-page">
            <main>
                {/* Product Image Section */}
                <div className="product-images">
                    {/* Enlarged Main Image */}
                    <img id="main-image" src={`http://localhost:5000/${mainImage}`} alt="Product" />

                    {/* Thumbnail Gallery */}
                    <div className="thumbnail-gallery">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={`http://localhost:5000/${image}`}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => changeMainImage(`${image}`)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="product-details">
                    <h1>{product.itemName}</h1>
                    <p className="price">{product.transactionType === 'sell' ? `Rs ${product.itemPrice}` : 'Donation'}</p>
                    <p>{product.itemDescription}</p>

                    {/* Conditionally display negotiable status */}
                    {product.transactionType === 'sell' && (
                        <p><strong>Negotiable:</strong> {product.itemNegotiable ? 'Yes' : 'No'}</p>
                    )}

                    {/* Display item condition */}
                    <p><strong>Condition:</strong> {product.itemCondition}</p>

                    <button type="button" onClick={fetchOwnerDetails}>Contact Owner</button>

                    {/* Display owner details if fetched */}
                    {ownerDetails && (
                        <div className="owner-details">
                            <h1>Owner Details:</h1>
                            <p><strong>Name:</strong> {ownerDetails.name}</p>
                            <p><strong>Email:</strong> {ownerDetails.email}</p>
                            <p><strong>Phone No:</strong> {ownerDetails.phoneNumber}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Product;