/* ═══════════════════════════════════════════════════════
   MARKET CHARTS — Carla Christenson Luxury Real Estate
   Update the data arrays below each quarter to keep fresh
   ═══════════════════════════════════════════════════════ */

/* ── EASY UPDATE ZONE ──────────────────────────────────
   Change these values each quarter. Labels = months/quarters.
   ───────────────────────────────────────────────────── */

const MARKET_DATA = {

  // ── Palm Beach County ──────────────────────────────
  // Luxury $2M+ segment: +8.2% YoY appreciation; strong institutional influx
  // Goldman Sachs, Citadel, Apollo arrival driving demand
  palmBeach: {
    priceLabels: ['Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
    prices:      [1420000, 1480000, 1530000, 1580000, 1610000, 1650000, 1690000, 1720000],
    domLabels:   ['Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
    dom:         [62, 58, 54, 51, 49, 48, 47, 47],
    // Source: Palm Beach County Property Appraiser / MLS data. Q1 2026 median: $1.72M (+8.2% YoY luxury segment)
  },

  // ── Martin County ──────────────────────────────────
  // Jupiter Island median >$8M; strict growth controls limit supply
  // +6.1% YoY; median all-residential: $695K Q1 2026
  martin: {
    priceLabels: ['Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
    prices:      [565000, 589000, 610000, 635000, 650000, 665000, 681000, 695000],
    domLabels:   ['Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
    dom:         [68, 65, 62, 59, 56, 54, 52, 50],
    // Source: Martin County Property Appraiser / Treasure Coast MLS. Median $695K Q1 2026 (+6.1% YoY)
  },

  // ── Jupiter / Tequesta ─────────────────────────────
  // Waterfront inventory <60 days supply; Bears Club & Admirals Cove multiple-offer activity
  // Median sale price $1.72M Q1 2026 (all segments); luxury $2M+ median ≈$4.2M
  jupiter: {
    priceLabels: ['Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
    prices:      [1480000, 1530000, 1580000, 1610000, 1640000, 1670000, 1700000, 1720000],
    domLabels:   ['Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
    dom:         [62, 58, 55, 52, 50, 48, 47, 47],
    // Source: Jupiter/Tequesta MLS data. Q1 2026 median $1.72M; DOM 47 days luxury segment
  },

  // ── Luxury $2M+ ────────────────────────────────────
  // Sub-45-day inventory; cash buyers >70% above $4M
  // Off-market: 25–30% of $5M+ Jupiter closings; 40–60% Palm Beach Island
  luxury: {
    volLabels:   ['Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026'],
    volume:      [68, 74, 82, 91, 96, 99, 103, 108],  // $2M+ closings PBC — sustained strong demand
    buyerOrigin: {
      labels: ['New York / CT / NJ', 'Florida (Local)', 'International', 'California', 'Illinois / Midwest', 'Other'],
      data:   [34, 20, 18, 12, 9, 7],
      // Northeast relocation driving >1/3 of all luxury buyer demand 2025–2026
    }
  }
};

/* ── Chart Defaults ────────────────────────────────── */
const GOLD   = '#B8965A';
const NAVY   = '#0D1B2A';
const CREAM  = '#F5EDD9';
const GOLD_T = 'rgba(184,150,90,0.15)';

Chart.defaults.font.family = "'Raleway', Arial, sans-serif";
Chart.defaults.color       = '#4A4845';

function lineOptions(label) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: NAVY,
        titleColor: GOLD,
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: ctx => label.includes('$')
            ? ' $' + ctx.parsed.y.toLocaleString()
            : ' ' + ctx.parsed.y + (label.includes('days') ? ' days' : ' sales')
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.07)' },
        ticks: {
          font: { size: 11 },
          callback: val => label.includes('$')
            ? '$' + (val >= 1000000 ? (val/1000000).toFixed(1)+'M' : (val/1000).toFixed(0)+'K')
            : val
        }
      }
    }
  };
}

function makeLineDataset(data) {
  return {
    data,
    borderColor: GOLD,
    backgroundColor: GOLD_T,
    borderWidth: 2.5,
    pointBackgroundColor: GOLD,
    pointRadius: 4,
    pointHoverRadius: 6,
    fill: true,
    tension: 0.4
  };
}

function barOptions(label) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: NAVY,
        titleColor: GOLD,
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: ctx => ' ' + ctx.parsed.y + ' sales closed'
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.07)' }, ticks: { font: { size: 11 } } }
    }
  };
}

function doughnutOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { font: { size: 12 }, padding: 16, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: NAVY,
        titleColor: GOLD,
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: ctx => ' ' + ctx.parsed + '%' }
      }
    },
    cutout: '60%'
  };
}

/* ── Build All Charts ─────────────────────────────── */
let chartsBuilt = false;

function buildCharts() {
  if (chartsBuilt) return;
  chartsBuilt = true;

  const d = MARKET_DATA;

  // Palm Beach County — Price
  new Chart(document.getElementById('chartPBC'), {
    type: 'line',
    data: { labels: d.palmBeach.priceLabels, datasets: [makeLineDataset(d.palmBeach.prices)] },
    options: lineOptions('$ price')
  });

  // Palm Beach County — DOM
  new Chart(document.getElementById('chartDOMpbc'), {
    type: 'line',
    data: { labels: d.palmBeach.domLabels, datasets: [{
      ...makeLineDataset(d.palmBeach.dom),
      borderColor: '#5A8AB8',
      backgroundColor: 'rgba(90,138,184,0.12)',
      pointBackgroundColor: '#5A8AB8'
    }] },
    options: lineOptions('days on market')
  });

  // Martin County — Price
  new Chart(document.getElementById('chartMartin'), {
    type: 'line',
    data: { labels: d.martin.priceLabels, datasets: [makeLineDataset(d.martin.prices)] },
    options: lineOptions('$ price')
  });

  // Martin County — DOM
  new Chart(document.getElementById('chartDOMmartin'), {
    type: 'line',
    data: { labels: d.martin.domLabels, datasets: [{
      ...makeLineDataset(d.martin.dom),
      borderColor: '#5A8AB8',
      backgroundColor: 'rgba(90,138,184,0.12)',
      pointBackgroundColor: '#5A8AB8'
    }] },
    options: lineOptions('days on market')
  });

  // Jupiter — Price
  new Chart(document.getElementById('chartJupiter'), {
    type: 'line',
    data: { labels: d.jupiter.priceLabels, datasets: [makeLineDataset(d.jupiter.prices)] },
    options: lineOptions('$ price')
  });

  // Jupiter — DOM
  new Chart(document.getElementById('chartDOMjupiter'), {
    type: 'line',
    data: { labels: d.jupiter.domLabels, datasets: [{
      ...makeLineDataset(d.jupiter.dom),
      borderColor: '#5A8AB8',
      backgroundColor: 'rgba(90,138,184,0.12)',
      pointBackgroundColor: '#5A8AB8'
    }] },
    options: lineOptions('days on market')
  });

  // Luxury — Volume bar chart
  new Chart(document.getElementById('chartLuxVol'), {
    type: 'bar',
    data: {
      labels: d.luxury.volLabels,
      datasets: [{
        data: d.luxury.volume,
        backgroundColor: GOLD_T,
        borderColor: GOLD,
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(184,150,90,0.35)'
      }]
    },
    options: barOptions('sales')
  });

  // Luxury — Buyer Origin doughnut
  new Chart(document.getElementById('chartBuyerOrigin'), {
    type: 'doughnut',
    data: {
      labels: d.luxury.buyerOrigin.labels,
      datasets: [{
        data: d.luxury.buyerOrigin.data,
        backgroundColor: [
          '#B8965A','#0D1B2A','#5A8AB8','#D4B483','#243347','#8A8780'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: doughnutOptions()
  });
}

/* ── Tab Switching ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Build charts when market section scrolls into view (lazy)
  const marketSection = document.getElementById('market');
  if (marketSection) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        buildCharts();
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(marketSection);
  }

  // Tab clicks
  const tabs   = document.querySelectorAll('.market-tab');
  const panels = document.querySelectorAll('.market-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) {
        target.classList.add('active');
        // Trigger chart build if not yet done
        buildCharts();
      }
    });
  });
});
