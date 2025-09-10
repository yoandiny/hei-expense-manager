// components/charts/Chart.tsx
'use client';

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { FC } from 'react';

// Enregistre les éléments nécessaires pour le pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseCategory {
    categoryName: string;
    total: number;
}

interface PieChartProps {
    data: ExpenseCategory[];
    title?: string;
}

const Chart: FC<PieChartProps> = ({ data, title = "Répartition des dépenses" }) => {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 text-center py-8">Aucune donnée à afficher</div>;
    }

    const chartData = {
        labels: data.map(item => item.categoryName),
        datasets: [
            {
                data: data.map(item => item.total),
                backgroundColor: [
                    '#FF6384', // rose
                    '#36A2EB', // bleu
                    '#FFCE56', // jaune
                    '#4BC0C0', // turquoise
                    '#9966FF', // violet
                    '#FF9F40', // orange
                    '#8BC34A', // vert
                    '#E91E63', // rose vif
                    '#00BCD4', // cyan
                    '#CDDC39', // citron
                ],
                borderColor: '#fff',
                borderWidth: 2,
            },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw as number;
                        const total = context.dataset.data.reduce((a, b) => a + (b as number), 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value.toFixed(2)} € (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {title && <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>}
            <div className="w-full max-w-xs mx-auto">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
};

export default Chart;