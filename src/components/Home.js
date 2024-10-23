import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/items');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    // Function to handle click
    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div>
            <main>
                <h2>Top Products</h2>
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div 
                                className="product" 
                                key={product._id}
                                onClick={() => handleProductClick(product._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={`http://localhost:5000/${product.images[0]}`} alt={product.itemName} />
                                <h3>{product.itemName}</h3>
                                <p>{product.transactionType === 'sell' ? `Rs ${product.itemPrice}` : 'Donation'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;