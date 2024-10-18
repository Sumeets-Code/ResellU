import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div>
            <main>
                <h2>Top Products</h2>
                <div className="product-grid">
                    {/* Product 1 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 1" />
                        <h3>Product 1</h3>
                        <p>$29.99</p>
                    </div>
                    {/* Product 2 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 2" />
                        <h3>Product 2</h3>
                        <p>$49.99</p>
                    </div>
                    {/* Product 3 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 3" />
                        <h3>Product 3</h3>
                        <p>$19.99</p>
                    </div>
                    {/* Product 4 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 4" />
                        <h3>Product 4</h3>
                        <p>$39.99</p>
                    </div>
                    {/* Product 5 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 5" />
                        <h3>Product 5</h3>
                        <p>$59.99</p>
                    </div>
                    {/* Product 6 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 6" />
                        <h3>Product 6</h3>
                        <p>$89.99</p>
                    </div>
                    {/* Product 7 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 7" />
                        <h3>Product 7</h3>
                        <p>$25.99</p>
                    </div>
                    {/* Product 8 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 8" />
                        <h3>Product 8</h3>
                        <p>$99.99</p>
                    </div>
                    {/* Product 9 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 9" />
                        <h3>Product 9</h3>
                        <p>$39.99</p>
                    </div>
                    {/* Product 10 */}
                    <div className="product">
                        <img src="https://via.placeholder.com/200x200" alt="Product 10" />
                        <h3>Product 10</h3>
                        <p>$49.99</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;