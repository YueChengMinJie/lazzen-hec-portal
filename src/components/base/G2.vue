<script setup lang="ts">
  import { Chart, register } from '@antv/g2';

  // @ts-ignore
  register('shape.interval.column25d', column25d);

  const chart = ref<Chart | null>(null);
  const container = ref<HTMLElement>();

  onMounted(() => {
    chart.value = renderBarChart(container.value as HTMLElement);
  });

  function renderBarChart(container: HTMLElement) {
    const chart = new Chart({
      container,
      width: 460,
      height: 315,
      autoFit: true,
    });

    chart.theme({ type: 'dark' });

    const data = [
      {
        date: '00:00',
        data1: 2,
        data2: 2.6,
        data3: 2,
      },
      {
        date: '01:00',
        data1: 4.9,
        data2: 5.9,
        data3: 2.2,
      },
      {
        date: '02:00',
        data1: 7,
        data2: 9,
        data3: 3.3,
      },
      {
        date: '03:00',
        data1: 23.2,
        data2: 26.4,
        data3: 4.5,
      },
      {
        date: '04:00',
        data1: 25.6,
        data2: 28.7,
        data3: 6.3,
      },
      {
        date: '05:00',
        data1: 76.7,
        data2: 70.7,
        data3: 10.2,
      },
      {
        date: '06:00',
        data1: 135.6,
        data2: 175.6,
        data3: 20.3,
      },
      {
        date: '07:00',
        data1: 162.2,
        data2: 182.2,
        data3: 23.4,
      },
      {
        date: '08:00',
        data1: 32.6,
        data2: 48.7,
        data3: 23,
      },
      {
        date: '09:00',
        data1: 20,
        data2: 18.8,
        data3: 16.5,
      },
      {
        date: '10:00',
        data1: 6.4,
        data2: 6,
        data3: 12,
      },
      {
        date: '11:00',
        data1: 3.3,
        data2: 2.3,
        data3: 6.2,
      },
      {
        date: '12:00',
        data1: 2,
        data2: 2.6,
        data3: 2,
      },
      {
        date: '13:00',
        data1: 4.9,
        data2: 5.9,
        data3: 2.2,
      },
      {
        date: '14:00',
        data1: 7,
        data2: 9,
        data3: 3.3,
      },
      {
        date: '15:00',
        data1: 23.2,
        data2: 26.4,
        data3: 4.5,
      },
      {
        date: '16:00',
        data1: 25.6,
        data2: 28.7,
        data3: 6.3,
      },
      {
        date: '17:00',
        data1: 76.7,
        data2: 70.7,
        data3: 10.2,
      },
      {
        date: '18:00',
        data1: 135.6,
        data2: 175.6,
        data3: 20.3,
      },
      {
        date: '19:00',
        data1: 162.2,
        data2: 182.2,
        data3: 23.4,
      },
      {
        date: '20:00',
        data1: 32.6,
        data2: 48.7,
        data3: 23,
      },
      {
        date: '21:00',
        data1: 20,
        data2: 18.8,
        data3: 16.5,
      },
      {
        date: '22:00',
        data1: 6.4,
        data2: 6,
        data3: 12,
      },
      {
        date: '23:00',
        data1: 3.3,
        data2: 2.3,
        data3: 6.2,
      },
    ];

    chart.data(data);

    chart
      .interval()
      .encode('x', 'date')
      .encode('y', 'data1')
      .style('shape', 'column25d')
      .axis('x', {
        title: null,
      })
      .axis('y', {
        position: 'left',
        title: null,
        grid: null,
        titleFill: '#00D8C3',
      });

    chart
      .line()
      .encode('x', 'date')
      .encode('y', 'data2')
      .encode('color', '#00D8C3')
      .scale('y', { independent: true })
      .style('lineWidth', 2)
      .axis('y', {
        position: 'right',
        title: null,
        grid: null,
        titleFill: '#00D8C3',
      });

    chart
      .line()
      .encode('x', 'date')
      .encode('y', 'data3')
      .encode('color', '#00D8C3')
      .encode('shape', 'smooth')
      .scale('y', { independent: true, domainMax: 30 })
      .axis('y', {
        position: 'right',
        title: null,
        grid: null,
        titleFill: '#00D8C3',
      });

    chart.render();

    return chart;
  }

  function updateBarChart(chart: Chart, newData: Array<any>) {
    const interval = chart.getNodesByType('interval')[0] as any;
    interval.data(newData);
    chart.render();
  }

  // @ts-ignore
  function column25d(_, context) {
    // @ts-ignore
    return points => {
      const x3 = points[1][0] - points[0][0];
      const x4 = x3 / 2 + points[0][0];
      const { document } = context;
      const g = document.createElement('g', {});

      const r = document.createElement('polygon', {
        style: {
          points: [
            [points[0][0], points[0][1]],
            [x4, points[1][1] + 8],
            [x4, points[3][1] + 8],
            [points[3][0], points[3][1]],
          ],
          fill: 'rgba(114, 177, 207, 0.5)',
          stroke: 'rgba(0,0,0,0.1)',
          strokeOpacity: 0.1,
          inset: 30,
        },
      });

      const p = document.createElement('polygon', {
        style: {
          points: [
            [x4, points[1][1] + 8],
            [points[1][0], points[1][1]],
            [points[2][0], points[2][1]],
            [x4, points[2][1] + 8],
          ],
          fill: 'rgba(126, 212, 236, 0.5)',
          stroke: 'rgba(0,0,0,0.3)',
          strokeOpacity: 0.1,
        },
      });

      const t = document.createElement('polygon', {
        style: {
          points: [
            [points[0][0], points[0][1]],
            [x4, points[1][1] - 8],
            [points[1][0], points[1][1]],
            [x4, points[1][1] + 8],
          ],
          fill: 'rgba(173, 240, 255, 1)',
        },
      });

      g.appendChild(r);
      g.appendChild(p);
      g.appendChild(t);

      return g;
    };
  }

  defineExpose({
    chart,
    updateBarChart,
  });
</script>

<template>
  <div ref="container" />
</template>

<style scoped></style>
