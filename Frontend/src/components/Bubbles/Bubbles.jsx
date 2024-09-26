import React, { useEffect, useState } from 'react';
import styles from './Bubbles.module.css';
import * as d3 from 'd3';

const Bubbles = () => {
    const [cryptoData, setCryptoData] = useState([]);

    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1')
            .then(response => response.json())
            .then(data => setCryptoData(data));
    }, []);

    useEffect(() => {
        if (cryptoData.length) {
            createBubbleChart();
        }
    }, [cryptoData]);

    const createBubbleChart = () => {
        const width = 1100;
        const height = 850;

        const svg = d3.select('#bubble-chart')
            .attr('width', width)
            .attr('height', height);

        const bubble = d3.pack()
            .size([width, height])
            .padding(2);

        const root = d3.hierarchy({ children: cryptoData })
            .sum(d => d.market_cap);

        bubble(root);

        const nodes = svg.selectAll('g')
            .data(root.children)
            .enter().append('g')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .call(d3.drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded));

        nodes.append('circle')
            .attr('class', `${styles.bubble}`)
            .attr('r', d => d.r)
            .style('fill', d => {
                if (d.data.price_change_percentage_24h > 0) {
                    return 'lightgreen';
                } else if (d.data.price_change_percentage_24h < 0) {
                    return 'lightcoral';
                } else {
                    return 'lightgrey';
                }
            })
            .style('stroke', d => {
                if (d.data.price_change_percentage_24h > 0) {
                    return 'green';
                } else if (d.data.price_change_percentage_24h < 0) {
                    return 'red';
                } else {
                    return 'grey';
                }
            })
            .style('stroke-width', '3');


        nodes.transition()
            .duration(1000)
            .ease(d3.easeSin)
            .attr('transform', d => `translate(${d.x + (Math.random() - 0.5) * 5},${d.y + (Math.random() - 0.5) * 5})`)
            .on('end', function repeat() {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeSin)
                    .attr('transform', d => `translate(${d.x + (Math.random() - 0.5) * 5},${d.y + (Math.random() - 0.5) * 5})`)
                    .on('end', repeat);
            });

        nodes.append('text')
            .style('text-anchor', 'middle')
            .style('dominant-baseline', 'middle')
            .style('font-size', d => `${d.r / 5}px`)
            .style('display', d => d.r < 20 ? 'none' : 'block')
            .each(function (d) {
                const element = d3.select(this);
                element.append('tspan')
                    .attr('x', 0)
                    .attr('dy', '0')
                    .text(d.data.name);
                element.append('tspan')
                    .attr('x', 0)
                    .attr('dy', '1.2em')
                    .text(`${d.data.price_change_percentage_24h}%`);
            });

        function dragStarted(event, d) {
            d3.select(this).raise().classed('active', true);
        }

        function dragged(event, d) {
            d3.select(this)
                .attr('transform', `translate(${d.x = event.x},${d.y = event.y})`); // Update position
        }

        function dragEnded(event, d) {
            d3.select(this).classed('active', false);
        }
    };

    return (
        <div className={styles.container}>
            <svg id="bubble-chart"></svg>
        </div>
    );
};

export default Bubbles;