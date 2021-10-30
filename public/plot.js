(async () => {
  const ctx = document.getElementById('myChart').getContext('2d');

  const zip4Mbps2xThrottle = await get('results-zip-4Mbps-2xCPUthrottle.json');
  const vanilla4Mbps2xThrottle = await get('results-vanilla-4Mbps-2xCPUthrottle.json');
  const zipOfBrotli1Mbps2xThrottle = await get('results-zip-of-br-1Mbps-2xCPUthrottle.json');
  const zipOfBrotli4Mbps2xThrottle = await get('results-zip-of-br-4Mbps-2xCPUthrottle.json');
  const zipOfBrotli4Mbps10xThrottle = await get('results-zip-of-br-4Mbps-10xCPUthrottle.json');
  const zipOfBrotli8Mbps2xThrottle = await get('results-zip-of-br-8Mbps-2xCPUthrottle.json');
  const zipOfBrotli8Mbps10xThrottle = await get('results-zip-of-br-8Mbps-10xCPUthrottle.json');
  const zipOfBrotli50Mbps2xThrottle = await get('results-zip-of-br-50Mbps-2xCPUthrottle.json');

  let min = Math.min(...zip4Mbps2xThrottle, ...vanilla4Mbps2xThrottle, ...zipOfBrotli4Mbps2xThrottle);
  let max = Math.max(...zip4Mbps2xThrottle, ...vanilla4Mbps2xThrottle, ...zipOfBrotli4Mbps2xThrottle);

  min = Math.min(...zip4Mbps2xThrottle, ...vanilla4Mbps2xThrottle, ...zipOfBrotli4Mbps2xThrottle);
  max = Math.max(...zip4Mbps2xThrottle, ...vanilla4Mbps2xThrottle, ...zipOfBrotli4Mbps2xThrottle);
  let k = Math.ceil(Math.sqrt(max - min));
  let binWidth = k;
  min = 0;
  max = 8000;

  console.log('median vanilla 4Mbps 2x throttle', Math.round(median(vanilla4Mbps2xThrottle)));
  console.log('median zip (with meta.json) 4Mbps 2x throttle', Math.round(median(zip4Mbps2xThrottle)));
  console.log('median zip of brotlis 1Mbps 2x throttle', Math.round(median(zipOfBrotli1Mbps2xThrottle)));
  console.log('median zip of brotlis 4Mbps 10x throttle', Math.round(median(zipOfBrotli4Mbps10xThrottle)));
  console.log('median zip of brotlis 4Mbps 2x throttle', Math.round(median(zipOfBrotli4Mbps2xThrottle)));
  console.log('median zip of brotlis 8Mbps 10x throttle', Math.round(median(zipOfBrotli8Mbps10xThrottle)));
  console.log('median zip of brotlis 8Mbps 2x throttle', Math.round(median(zipOfBrotli8Mbps2xThrottle)));
  console.log('median zip of brotlis 50Mbps 2x throttle', Math.round(median(zipOfBrotli50Mbps2xThrottle)));

  let labels = [];
  for (let i = min; i <= max; i += binWidth) {
    labels.push(i);
  }

  const data = {
    labels: labels,
    datasets: [
      //   {
      //     label: 'zip meta.json',
      //     data: labels.map((e) => {
      //       let count = 0;
      //       zip4Mbps2xThrottle.forEach((n) => {
      //         if (n >= e && n < e + binWidth) count++;
      //       });
      //       return count;
      //     }),
      //     borderColor: 'rgb(26, 44, 164)',
      //     backgroundColor: 'rgba(26, 44, 164, 1.0)',
      //     categoryPercentage: 1,
      //   },
      //   {
      //     label: 'vanilla',
      //     data: labels.map((e) => {
      //       let count = 0;
      //       vanilla4Mbps2xThrottle.forEach((n) => {
      //         if (n >= e && n < e + binWidth) count++;
      //       });
      //       return count;
      //     }),
      //     borderColor: 'rgb(182, 50, 72)',
      //     backgroundColor: 'rgba(182, 50, 72, 1.0)',
      //     categoryPercentage: 1,
      //   },
      //   {
      //     label: 'zip of brotlis',
      //     data: labels.map((e) => {
      //       let count = 0;
      //       zipOfBrotli4Mbps2xThrottle.forEach((n) => {
      //         if (n >= e && n < e + binWidth) count++;
      //       });
      //       return count;
      //     }),
      //     borderColor: 'rgb(55, 239, 74)',
      //     backgroundColor: 'rgba(55, 239, 74, 1.0)',
      //     categoryPercentage: 1,
      //   },
      {
        label: 'zipbr 1mbps',
        data: labels.map((e) => {
          let count = 0;
          zipOfBrotli1Mbps2xThrottle.forEach((n) => {
            if (n >= e && n < e + binWidth) count++;
          });
          return count;
        }),
        borderColor: 'rgb(55, 239, 74)',
        backgroundColor: 'rgba(55, 239, 74, 1.0)',
        categoryPercentage: 1,
      },
      {
        label: 'zipbr 4mbps',
        data: labels.map((e) => {
          let count = 0;
          zipOfBrotli4Mbps2xThrottle.forEach((n) => {
            if (n >= e && n < e + binWidth) count++;
          });
          return count;
        }),
        borderColor: 'rgb(182, 50, 72)',
        backgroundColor: 'rgba(182, 50, 72, 1.0)',
        categoryPercentage: 1,
      },
      {
        label: 'zipbr 8mbps',
        data: labels.map((e) => {
          let count = 0;
          zipOfBrotli8Mbps2xThrottle.forEach((n) => {
            if (n >= e && n < e + binWidth) count++;
          });
          return count;
        }),
        borderColor: 'blue',
        backgroundColor: 'blue',
        categoryPercentage: 1,
      },
      {
        label: 'vanilla 4mbps',
        data: labels.map((e) => {
          let count = 0;
          vanilla4Mbps2xThrottle.forEach((n) => {
            if (n >= e && n < e + binWidth) count++;
          });
          return count;
        }),
        borderColor: 'orange',
        backgroundColor: 'orange',
        categoryPercentage: 1,
      },
      {
        label: 'zipbr 50mbps',
        data: labels.map((e) => {
          let count = 0;
          zipOfBrotli50Mbps2xThrottle.forEach((n) => {
            if (n >= e && n < e + binWidth) count++;
          });
          return count;
        }),
        borderColor: 'rgb(255, 78, 142)',
        backgroundColor: 'rgba(255, 78, 142, 1.0)',
        categoryPercentage: 1,
      },
    ],
  };

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: '2x CPU slowdown',
        },
      },
    },
  });
})();

function median(values) {
  if (values.length === 0) throw new Error('No inputs');

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

function get(result) {
  return fetch(result).then((res) => res.json());
}
