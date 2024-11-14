import React, { Component } from "react";
import Chart from "react-apexcharts";
import { supabase } from '../supabaseClient';

class Barchart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: [] // Categories will be the months
                },
                colors: [] // This will hold the colors for each month
            },
            series: [
                {
                    name: "Visitors",
                    data: [] // This will hold the visitor counts for each month
                }
            ]
        };
    }

    async componentDidMount() {
        // Fetch the visitor data from Supabase
        const { data, error } = await supabase
            .from('visitor')
            .select('created_at');

        if (error) {
            console.error(error);
            return;
        }

        // Initialize monthCounts with 0 for each month
        const monthCounts = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0
        };

        // Group data by month and count visitors
        data.forEach(item => {
            const month = new Date(item.created_at).toLocaleString('default', { month: 'long' });
            monthCounts[month]++; // Increment visitor count for the month
        });

        // Extract months, visitor counts
        const categories = Object.keys(monthCounts); // Get month names
        const seriesData = Object.values(monthCounts); // Get visitor counts for each month

        // Update the state with the data
        this.setState({
            options: {
                ...this.state.options,
                xaxis: {
                    categories: categories
                }
            },
            series: [
                {
                    name: "Visitors",
                    data: seriesData
                }
            ]
        });
    }

    render() {
        return (
            <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-4xl">
                <h1 className="text-center text-xl font-bold mb-4">Jumlah Tamu LAN Jakarta per Bulan</h1>
                <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width="100%"
                height="600"
                />
            </div>
            </div>
        );
    }
}

export default Barchart;
