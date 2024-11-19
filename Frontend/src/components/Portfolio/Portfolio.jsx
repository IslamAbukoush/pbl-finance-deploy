import styles from './Portfolio.module.css';
import { useContext, useEffect, useState } from 'react';
import { authContext } from '../../hooks/Context';
import { Link } from 'react-router-dom';

const Portfolio = () => {
    const { userData, lightMode, url} = useContext(authContext);
    const [tradingHistory, setTradingHistory] = useState([]);

    // Fetch trading history from the backend
    useEffect(() => {
        const fetchTradingHistory = async () => {
            try {
                const response = await fetch(url+'/users/'+localStorage.getItem("id")); // Update with your API endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTradingHistory(data.posts);
            } catch (error) {
                console.error('Error fetching trading history:', error);
            }
        };

        fetchTradingHistory();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className={styles.wrapper + ' ' + (lightMode?"text-black":"")}>
            <h1 className={styles.title}>{userData.firstName + ' ' + userData.lastName}'s Portfolio</h1>
            <div className={styles.main}>
                <div className={styles.table + ' ' + styles.grayBox + " " + (lightMode? "bg-light-secondary":"bg-dark-secondary")}>
                    <h1>Trading History</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Buying Time</th>
                                <th>Symbol</th>
                                <th>Interval</th>
                                <th>Profit/Loss (USDT)</th>
                                <th>Selling Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tradingHistory.length > 0 ? (
                                tradingHistory.map((trade, index) => (
                                    <tr key={index}>
                                        <td>{trade.startTime}</td>
                                        <td>{trade.symbol}</td>
                                        <td>{trade.interval}</td>
                                        <td>{trade.profitOrLoss} USDT</td>
                                        <td>{trade.sellTime}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No trading history available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className={styles.options + ' ' + styles.grayBox + " " + (lightMode? "bg-light-secondary " + styles.options_light:"bg-dark-secondary")}>
                    <h1>Chart Overview</h1>
                    <div className={styles.intervals}>
                        <h1 className={lightMode?"text-black":""}>Interval:</h1>
                        <button>1 Day</button>
                        <button>1 Month</button>
                        <button>1 Year</button>
                        <button>All</button>
                    </div>
                </div>
                <div className={styles.stats + ' ' + styles.grayBox + " " + (lightMode? "bg-light-secondary":"bg-dark-secondary")}>
                    <img src='/dummyChart.png' className={styles.chart} alt="Dummy Chart"/>
                    <div className={styles.company}>
                        <h1>Company Name</h1>
                        <h2>Mine</h2>
                        <h1>$1578.5</h1>
                        <p className={lightMode?"text-black":""}>Total Invested Deposit</p>
                        <h1>$200.5</h1>
                        <p className={lightMode?"text-black":""}>Profit</p>
                    </div>
                    <div className={styles.summary + " " + (lightMode? styles.summary_light:"")}>
                        <p className={lightMode?"text-black":""}>Market Summary</p>
                        <h1>22.33 USD</h1>
                        <h2>+0.44 (2.01%) today</h2>
                    </div>
                </div>
            </div>
            <div className={styles.side}>
                <Link to='/buy' className={styles.invest + ' ' + styles.colorBox + " " + (lightMode?"text-black":"")}>Buy Now</Link>
                <div className={styles.deposit + ' ' + styles.colorBox + ' ' + (lightMode?styles.deposit_light:"")}>
                    <h1>Deposit Analysis</h1>
                    <h2>${userData.deposit.initial.toFixed(2)}</h2>
                    <h3>Total Initial Deposit</h3>
                    <h2>${userData.deposit.invested.toFixed(2)}</h2>
                    <h3>Total Invested Deposit</h3>
                    <p>{Math.min((userData.deposit.invested / userData.deposit.initial * 100, 100)).toFixed(2) || 0}% of deposit invested</p>
                    <h2>${(userData.deposit.initial - userData.deposit.invested).toFixed(2)}</h2>
                    <h3>Total Remaining Deposit</h3>
                </div>
                <div className={styles.preferences + ' ' + styles.colorBox + ' ' + (lightMode?styles.deposit_light:"")}>
                    <h1>My Preferences</h1>
                    <div className={styles.industries}>
                        <h2>Industries</h2>
                        <div className={styles.checkBox}>
                            <input type="checkbox" name='tech' />
                            <label htmlFor="tech">Tech</label>
                        </div>
                        <div className={styles.checkBox}>
                            <input type="checkbox" name='finance' />
                            <label htmlFor="finance">Finance</label>
                        </div>
                        <div className={styles.checkBox}>
                            <input type="checkbox" name='energy' />
                            <label htmlFor="energy">Energy</label>
                        </div>
                    </div>
                    <div className={styles.trending}>
                        <h2>Trending Now <img className={lightMode?"invert":""} src="/trending_svg.svg" alt="Trending Icon"/></h2>
                        <p className={lightMode?"text-black":""}>Today</p>
                        <h1><img className={lightMode?"invert":""} src="/rectangle.svg" alt="Rectangle"/>Lorem Ipsum Company </h1>
                        <h1><img className={lightMode?"invert":""} src="/rectangle.svg" alt="Rectangle"/>Lorem Ipsum Company </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Portfolio;
