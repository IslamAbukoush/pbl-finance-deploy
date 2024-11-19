import { useContext, useEffect, useState } from 'react';
import styles from './Buy.module.css';
import { authContext } from '../../hooks/Context';

const Buy = () => {
    const [symbol, setSymbol] = useState('');
    const [money, setMoney] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [isPurchased, setIsPurchased] = useState(false); // New state to track purchase
    const [isLoading, setIsLoading] = useState(false); // State to track loading status
    const {url} = useContext(authContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            symbol,
            money,
        };

        setIsLoading(true); // Set loading to true when starting the request

        try {
            const response = await fetch(url+'/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...data, userId: localStorage.getItem('id') }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            setResponseMessage(result);
            setIsPurchased(true); // Set purchase state to true
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setResponseMessage('An error occurred. Please try again.');
            setIsPurchased(false); // Reset purchase state on error
        } finally {
            setIsLoading(false); // Set loading to false after the request
        }
    };

    const handleBack = () => {
        setSymbol(''); // Reset symbol input
        setMoney(''); // Reset money input
        setResponseMessage(''); // Clear the response message
        setIsPurchased(false); // Reset purchase state
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Buy Cryptocurrency</h1>
            {responseMessage ? (
                <div className={styles.responseContainer}>
                    <div className={styles.responseMessage}>{responseMessage}</div>
                    <button className={styles.backButton} onClick={handleBack}>Back</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="symbol" className={styles.label}>Symbol (e.g., BTC):</label>
                    <input
                        type='text'
                        className={styles.input}
                        id="symbol"
                        name="symbol"
                        onChange={(e) => setSymbol(e.target.value.toUpperCase() + 'USDT')}
                        required
                    />
                    <label htmlFor="money" className={styles.label}>Money (USDT):</label>
                    <input
                        className={styles.input}
                        type="number"
                        id="money"
                        name="money"
                        value={money}
                        onChange={(e) => setMoney(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Buy'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Buy;
