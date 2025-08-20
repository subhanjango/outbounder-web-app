<template>
  <div class="grid">
    <div class="col-12 md:col-4">
      <div class="card">
        <div class="flex align-items-center justify-content-between mb-2">
          <span class="subtle">Sales Rate</span>
          <Button icon="pi pi-ellipsis-h" text rounded />
        </div>
        <div class="text-3xl font-bold mb-2">$256,137.48</div>
        <div class="sparkline">
          <Chart type="bar" :data="spark1.data" :options="spark1.options" />
        </div>
        <div class="mt-2 subtle" style="color:#10b981">+24% total orders compared last month</div>
      </div>
    </div>

    <div class="col-12 md:col-4">
      <div class="card">
        <div class="flex align-items-center justify-content-between mb-2">
          <span class="subtle">New Customers</span>
          <Button icon="pi pi-ellipsis-h" text rounded />
        </div>
        <div class="text-3xl font-bold mb-2">17,435</div>
        <div class="sparkline">
          <Chart type="bar" :data="spark2.data" :options="spark2.options" />
        </div>
        <div class="mt-2 subtle" style="color:#10b981">+12% total orders compared last month</div>
      </div>
    </div>

    <div class="col-12 md:col-4">
      <div class="card">
        <div class="flex align-items-center justify-content-between mb-2">
          <span class="subtle">AVG. Monthly Order</span>
          <Button icon="pi pi-ellipsis-h" text rounded />
        </div>
        <div class="text-3xl font-bold mb-2">32,048</div>
        <div class="sparkline">
          <Chart type="bar" :data="spark3.data" :options="spark3.options" />
        </div>
        <div class="mt-2 subtle" style="color:#10b981">+40% total orders compared last month</div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <div class="flex align-items-center justify-content-between mb-3">
          <div>
            <div class="font-semibold mb-1">E‑Commerce Overview</div>
            <div class="subtle">Trends summary, performance analysis</div>
          </div>
          <Button icon="pi pi-sliders-h" label="Weekly" text />
        </div>
        <Chart type="bar" :data="overview.data" :options="overview.options" style="height: 280px" />
      </div>
    </div>
  </div>
</template>

<script>
const baseSparkOptions = (color) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: {
    x: { display: false, grid: { display: false }, border: { display: false } },
    y: { display: false, grid: { display: false }, border: { display: false } }
  },
  datasets: { bar: { borderRadius: 8, backgroundColor: color, barThickness: 10 } }
})

export default {
  name: 'Home',
  data() {
    const labels = Array.from({ length: 12 }).map((_, i) => `W${i + 1}`)
    return {
      spark1: { data: { labels, datasets: [{ data: [5,4,6,5,7,5,6,5,6,7,6,7] }] }, options: baseSparkOptions('rgba(99,102,241,0.8)') },
      spark2: { data: { labels, datasets: [{ data: [3,5,4,6,4,6,5,6,4,6,5,7] }] }, options: baseSparkOptions('rgba(139,92,246,0.85)') },
      spark3: { data: { labels, datasets: [{ data: [2,3,2,4,3,4,3,5,3,4,3,5] }] }, options: baseSparkOptions('rgba(59,130,246,0.85)') },
      overview: {
        data: {
          labels: ['Aug 16','Aug 23','Aug 30','Sep 6','Sep 13','Sep 20','Sep 27','Oct 4','Oct 11','Oct 18','Oct 25','Nov 1'],
          datasets: [
            { type: 'bar', label: 'New', backgroundColor: 'rgba(99,102,241,0.8)', data: [30,60,90,40,70,80,45,60,70,50,80,65], stack: 'combined', borderRadius: 6, barPercentage: 0.7, categoryPercentage: 0.8 },
            { type: 'bar', label: 'Returning', backgroundColor: 'rgba(139,92,246,0.65)', data: [20,40,70,35,50,60,40,45,55,40,60,55], stack: 'combined', borderRadius: 6 },
            { type: 'bar', label: 'Guest', backgroundColor: 'rgba(148,163,184,0.6)', data: [15,30,50,25,40,45,30,35,40,35,45,40], stack: 'combined', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8' }, border: { display: false } },
            y: { stacked: true, grid: { color: 'rgba(148,163,184,0.25)' }, ticks: { color: '#94a3b8' }, border: { display: false } }
          }
        }
      }
    }
  }
}
</script>


