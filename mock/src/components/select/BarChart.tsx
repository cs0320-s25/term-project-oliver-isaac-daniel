import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface BarChartProps {
  labels: string[];
  data: number[];
}

export function BarChart({ labels, data }: BarChartProps) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        backgroundColor: "rgba(75,192,192,0.6)",
        data: data,
      },
    ],
  };

  return (
    <div>
      <Bar
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          animation: {
            onComplete: function () {
              setTimeout(() => {
                document.querySelector('canvas')?.setAttribute('aria-live', 'polite');
              }, 0);
            },
          },
        }}
        aria-label="Bar chart showing the selected dataset"
      />
    </div>
  );
}