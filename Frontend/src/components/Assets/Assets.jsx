import React, { useContext, useEffect, useState } from 'react';
import styles from './Assets.module.css';
import { authContext } from '../../hooks/Context';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [loadingId, setLoadingId] = useState(null); // Track which asset is currently being sold
    const {lightMode, url} = useContext(authContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url+'/users/' + localStorage.getItem("id"));
                if (response.ok) {
                    const data = await response.json();
                    setAssets(data.assets);
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
    }, []);

    const handleSell = async (assetId) => {
        const payload = { assetId };
        setLoadingId(assetId);

        try {
            const response = await fetch(url+'/sell/' + localStorage.getItem("id"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            let result;

            // Check if the response is in JSON format
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('Unexpected response format:', text);
                return;
            }

            if (response.ok) {
                console.log('Sell successful:', result);
                setAssets((prevAssets) => {
                    const updatedAssets = prevAssets.filter(asset => asset._id !== assetId);
                    console.log('Updated assets:', updatedAssets);
                    return updatedAssets;
                });
            } else {
                console.error('Error selling asset:', response.statusText, result);
            }
        } catch (error) {
            console.error('Sell error:', error);
        } finally {
            setLoadingId(null); // Reset loading ID after operation
        }
    };

    return (
        <table className={styles.table}>
            <thead className={styles.tableHeader + " " + (lightMode?styles.tableHeader_light:"")}>
                <tr className={styles.tableRow}>
                    <th className={styles.tableHeaderCell}>Symbol</th>
                    <th className={styles.tableHeaderCell}>Quantity</th>
                    <th className={styles.tableHeaderCell}>Money</th>
                    <th className={styles.tableHeaderCell}>Interval</th>
                    <th className={styles.tableHeaderCell}>Start Price</th>
                    <th className={styles.tableHeaderCell}>Start Time</th>
                    <th className={styles.tableHeaderCell}>Action</th>
                </tr>
            </thead>
            <tbody className={styles.tableBody}>
                {assets.length > 0 ? (
                    assets.map((asset) => (
                        <tr key={asset._id} className={styles.tableRow + " " + (lightMode?"text-black":"")}>
                            <td className={styles.tableCell}>{asset.symbol}</td>
                            <td className={styles.tableCell}>{asset.quantity}</td>
                            <td className={styles.tableCell}>{asset.money}</td>
                            <td className={styles.tableCell}>{asset.interval}</td>
                            <td className={styles.tableCell}>{asset.closePriceOnStart}</td>
                            <td className={styles.tableCell}>{asset.startTime}</td>
                            <td className={styles.tableCell}>
                                <button
                                    className={styles.sellButton}
                                    onClick={() => handleSell(asset._id)}
                                    disabled={loadingId === asset._id} // Disable if this asset is being sold
                                >
                                    {loadingId === asset._id ? 'Loading...' : 'Sell'}
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr className={styles.tableRow}>
                        <td className={styles.noDataCell} colSpan="7">No data available</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Assets;
