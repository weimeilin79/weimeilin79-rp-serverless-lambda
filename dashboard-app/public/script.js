


const totalSalesChartCtx = document.getElementById('totalSalesChart').getContext('2d');
const paymentMethodChartCtx = document.getElementById('paymentMethodChart').getContext('2d');
const deviceTypeChartCtx = document.getElementById('deviceTypeChart').getContext('2d');


let paymentMethodChart;
let deviceTypeChart;
let apiBaseUrl = '';


let totalSalesChart = new Chart(totalSalesChartCtx, {
    type: 'bar', // Use 'bar' type for both datasets
    data: {
        labels: ['Metrics'],
        datasets: [{
            label: 'Total Sales',
            data: [0], // Initial data for total sales
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }, {
            label: 'Fees',
            data: [0], // Initial data for fees
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function fetchDataAndUpdateCharts() {
  const salesPromise = axios.get(`${apiBaseUrl}/tickets/total-sales`);
  const feesPromise = axios.get(`${apiBaseUrl}/tickets/fees`); 

  Promise.all([salesPromise, feesPromise]).then(responses => {
      const totalSalesResponse = responses[0].data;
      const feesResponse = responses[1].data;

      // Log the results returned from each endpoint
      console.log('Total Sales:', totalSalesResponse);
      console.log('Fees:', feesResponse);

      // Assuming both `totalSalesResponse` and `feesResponse` are single numeric values
      totalSalesChart.data.datasets[0].data = [totalSalesResponse];
      totalSalesChart.data.datasets[1].data = [feesResponse];

      totalSalesChart.update();
  }).catch(error => {
      console.error("Error fetching data", error);
  });
}

function fetchDataAndUpdatePieCharts() {
  axios.all([
      axios.get(`${apiBaseUrl}/tickets/payment-method-counts`),
      axios.get(`${apiBaseUrl}/tickets/device-type-counts`)
  ]).then(axios.spread((paymentMethodsResponse, deviceTypesResponse) => {
      const paymentMethodsData = paymentMethodsResponse.data;
      const deviceTypesData = deviceTypesResponse.data;

      // Convert the data objects into arrays suitable for Chart.js
      const paymentMethodLabels = Object.keys(paymentMethodsData);
      const paymentMethodValues = Object.values(paymentMethodsData);
      const deviceTypeLabels = Object.keys(deviceTypesData);
      const deviceTypeValues = Object.values(deviceTypesData);

      // Check if the chart already exists. If so, update it. If not, create it.
      if (paymentMethodChart) {
          paymentMethodChart.data.labels = paymentMethodLabels;
          paymentMethodChart.data.datasets[0].data = paymentMethodValues;
          paymentMethodChart.update();
      } else {
          paymentMethodChart = new Chart(paymentMethodChartCtx, {
              type: 'pie',
              data: {
                  labels: paymentMethodLabels,
                  datasets: [{
                      data: paymentMethodValues,
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',   // pink
                        'rgba(54, 162, 235, 0.6)',   // blue
                        'rgba(255, 206, 86, 0.6)',   // yellow
                        'rgba(75, 192, 192, 0.6)',   // green
                        'rgba(153, 102, 255, 0.6)',  // purple
                        'rgba(255, 159, 64, 0.6)'    // orange
                    ]
                  }]
              }
          });
      }

      if (deviceTypeChart) {
          deviceTypeChart.data.labels = deviceTypeLabels;
          deviceTypeChart.data.datasets[0].data = deviceTypeValues;
          deviceTypeChart.update();
      } else {
          deviceTypeChart = new Chart(deviceTypeChartCtx, {
              type: 'pie',
              data: {
                  labels: deviceTypeLabels,
                  datasets: [{
                      data: deviceTypeValues,
                      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)']
                  }]
              }
          });
      }
  })).catch(error => console.error("Error fetching pie chart data", error));
}

document.addEventListener('DOMContentLoaded', function () {
  fetch('/config')
      .then(response => response.json())
      .then(config => {
          apiBaseUrl = config.apiBaseUrl; // Store the fetched base URL
          // Initialize charts after fetching the configuration
          fetchDataAndUpdateCharts();
          setInterval(fetchDataAndUpdateCharts, 500); // Fetch data every second using the base URL
          setInterval(fetchDataAndUpdatePieCharts, 500); // Fetch data every second using the base URL
      })
      .catch(error => console.error('Error fetching configuration:', error));
});