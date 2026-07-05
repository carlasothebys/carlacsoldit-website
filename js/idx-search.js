/**
 * IDX Search — Spark API Integration
 * Carla Christenson · carlacsoldit.com
 */

// ── State ────────────────────────────────────────────────────
const IDX = {
  currentStatus : 'active',
  currentPage   : 1,
  totalResults  : 0,
  perPage       : 24,
  isLoading     : false,
};

// ── Spark RESO API v3 via CORS proxy ────────────────────────
const SPARK_TOKEN = '3oj6cr71pdujwme4zgjestqye';
const SPARK_BASE  = 'https://corsproxy.io/?url=https://replication.sparkapi.com/Version/3/Reso/OData';

// ── Format currency ──────────────────────────────────────────
function formatPrice(val) {
  if (!val && val !== 0) return 'Price on Request';
  const n = parseFloat(val);
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 2) + 'M';
  if (n >= 1000)    return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n.toLocaleString();
}

// ── Format address ───────────────────────────────────────────
function formatAddress(d) {
  const street = [d.StreetNumber, d.StreetDirPrefix, d.StreetName, d.StreetSuffix]
    .filter(Boolean).join(' ');
  const city   = [d.City, d.StateOrProvince, d.PostalCode].filter(Boolean).join(', ');
  return { street, city };
}

// ── Build listing card HTML ───────────────────────────────────
function buildCard(listing) {
  const d       = listing.StandardFields || listing;
  // RESO v3 field names
  const price   = d.ListPrice || d.ClosePrice || 0;
  const isRent  = (d.PropertyType || '').toLowerCase().includes('lease');
  const isSold  = (d.StandardStatus || d.MlsStatus || '').toLowerCase() === 'closed';
  const media   = d.Media || d.Photos || [];
  const imgSrc  = media.length > 0 ? (media[0].MediaURL || media[0].Uri640 || media[0].Uri800 || '') : '';
  const beds    = d.BedroomsTotal || d.BedsTotal || '—';
  const baths   = d.BathroomsTotalInteger || d.BathsTotal || '—';
  const sqft    = d.LivingArea || d.BuildingAreaTotal || null;
  const mlsId   = d.ListingId || d.MLSNumber || '';
  const street  = d.UnparsedAddress || [d.StreetNumber, d.StreetName, d.StreetSuffix].filter(Boolean).join(' ');
  const cityLine = [d.City, d.StateOrProvince, d.PostalCode].filter(Boolean).join(', ');
  const detailUrl = `listing.html?id=${d.ListingKey || d.Id || mlsId}`;

  let badgeClass = 'badge-sale', badgeText = 'For Sale';
  if (isRent) { badgeClass = 'badge-rent'; badgeText = 'For Rent'; }
  if (isSold) { badgeClass = 'badge-sold'; badgeText = 'Sold'; }

  const imgHtml = imgSrc
    ? `<img src="${imgSrc}" alt="${street}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-img-placeholder\\'><i class=\\'fas fa-home\\'></i></div>'">`
    : `<div class="card-img-placeholder"><i class="fas fa-home"></i></div>`;

  return `
    <a class="listing-card" href="${detailUrl}" target="_blank" rel="noopener">
      <div class="card-img-wrap">
        ${imgHtml}
        <span class="card-status-badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="card-body">
        <div class="card-price">${formatPrice(price)}</div>
        <div class="card-address">
          <strong>${street || 'Address on Request'}</strong><br>
          ${cityLine}
        </div>
        <div class="card-specs">
          <span class="card-spec"><i class="fas fa-bed"></i> ${beds} Beds</span>
          <span class="card-spec"><i class="fas fa-bath"></i> ${baths} Baths</span>
          ${sqft ? `<span class="card-spec"><i class="fas fa-ruler-combined"></i> ${Number(sqft).toLocaleString()} Sq.Ft.</span>` : ''}
        </div>
        ${mlsId ? `<div class="card-mls">MLS# ${mlsId}</div>` : ''}
      </div>
    </a>`;
}

// ── Render cards ─────────────────────────────────────────────
function renderCards(listings) {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  if (!listings || listings.length === 0) {
    grid.innerHTML = `
      <div class="state-empty">
        <i class="fas fa-search"></i>
        <p style="font-size:1rem;font-weight:600;color:#444;margin-bottom:8px;">No Listings Found</p>
        <p>Try adjusting your filters or expanding your search area.</p>
      </div>`;
    return;
  }

  grid.innerHTML = listings.map(buildCard).join('');
}

// ── Render pagination ─────────────────────────────────────────
function renderPagination(total, page, perPage) {
  const pag = document.getElementById('pagination');
  if (!pag) return;
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  let html = '';
  html += `<button class="page-btn" onclick="runSearch(${page - 1})" ${page === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;

  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="runSearch(${i})">${i}</button>`;
    } else if (i === page - delta - 1 || i === page + delta + 1) {
      html += `<button class="page-btn" disabled>…</button>`;
    }
  }

  html += `<button class="page-btn" onclick="runSearch(${page + 1})" ${page === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
  pag.innerHTML = html;
}

// ── Update results count ──────────────────────────────────────
function updateCount(total, status) {
  const el = document.getElementById('resultsCount');
  if (!el) return;
  const label = status === 'rent' ? 'For Rent' : 'For Sale';
  el.innerHTML = `<strong>${total.toLocaleString()}</strong> ${label} listings found`;
}

// ── Set status tab ────────────────────────────────────────────
function setStatus(status, btn) {
  IDX.currentStatus = status;
  document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  runSearch(1);
}

// ── Clear filters ─────────────────────────────────────────────
function clearFilters() {
  ['cityFilter','minPrice','maxPrice','minBeds','minBaths'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const kw = document.getElementById('keyword');
  if (kw) kw.value = '';
  runSearch(1);
}

// ── Main search function ──────────────────────────────────────
async function runSearch(page) {
  if (IDX.isLoading) return;
  IDX.isLoading  = true;
  IDX.currentPage = page || 1;

  const grid = document.getElementById('listingsGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="state-loading">
        <div class="spinner"></div>
        <p>Searching MLS listings…</p>
      </div>`;
  }
  document.getElementById('pagination') && (document.getElementById('pagination').innerHTML = '');

  // Build query params
  const params = new URLSearchParams({
    action  : 'search',
    status  : IDX.currentStatus,
    limit   : IDX.perPage,
    page    : IDX.currentPage,
    orderby : document.getElementById('sortOrder')?.value || '-ListPrice',
  });

  const city     = document.getElementById('cityFilter')?.value;
  const minPrice = document.getElementById('minPrice')?.value;
  const maxPrice = document.getElementById('maxPrice')?.value;
  const minBeds  = document.getElementById('minBeds')?.value;
  const minBaths = document.getElementById('minBaths')?.value;
  const keyword  = document.getElementById('keyword')?.value?.trim();

  if (city)     params.append('city',     city);
  if (minPrice) params.append('minprice', minPrice);
  if (maxPrice) params.append('maxprice', maxPrice);
  if (minBeds)  params.append('minbeds',  minBeds);
  if (minBaths) params.append('minbaths', minBaths);
  if (keyword)  params.append('q',        keyword);

  try {
    // Build RESO OData filter
    const status = IDX.currentStatus;
    const filters = [];
    if (status === 'rent') {
      filters.push("StandardStatus eq 'Active' and PropertyType eq 'ResidentialLease'");
    } else {
      filters.push("StandardStatus eq 'Active' and PropertyType eq 'Residential'");
    }
    const city     = document.getElementById('cityFilter')?.value;
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;
    const minBeds  = document.getElementById('minBeds')?.value;
    const minBaths = document.getElementById('minBaths')?.value;
    if (city)     filters.push(`City eq '${city}'`);
    if (minPrice) filters.push(`ListPrice ge ${minPrice}`);
    if (maxPrice) filters.push(`ListPrice le ${maxPrice}`);
    if (minBeds)  filters.push(`BedroomsTotal ge ${minBeds}`);
    if (minBaths) filters.push(`BathroomsTotalInteger ge ${minBaths}`);

    const limit = IDX.perPage;
    const skip  = (IDX.currentPage - 1) * limit;
    const qp = new URLSearchParams({
      '$filter'  : filters.join(' and '),
      '$orderby' : 'ListPrice desc',
      '$top'     : limit,
      '$skip'    : skip,
      '$count'   : 'true',
      '$select'  : 'ListingKey,ListPrice,StandardStatus,PropertyType,BedroomsTotal,BathroomsTotalInteger,City,StateOrProvince,PostalCode,UnparsedAddress,Media,LivingArea,YearBuilt',
    });

    const res  = await fetch(`${SPARK_BASE}/Property?${qp.toString()}`, {
      headers: {
        'Authorization': `Bearer ${SPARK_TOKEN}`,
        'Accept': 'application/json',
        'X-SparkApi-User-Mode': 'vow',
        'x-cors-api-key': 'temp_demo',
      }
    });
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    const results = data.value || [];
    const total   = data['@odata.count'] || results.length;

    IDX.totalResults = total;

    renderCards(results);
    renderPagination(total, IDX.currentPage, IDX.perPage);
    updateCount(total, IDX.currentStatus);

    // Scroll to grid
    grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    console.error('IDX Search error:', err);
    if (grid) {
      grid.innerHTML = `
        <div class="state-error">
          <i class="fas fa-exclamation-triangle"></i>
          <p style="font-size:1rem;font-weight:600;margin-bottom:8px;">Unable to Load Listings</p>
          <p>${err.message || 'Please try again or contact Carla directly.'}</p>
          <p style="margin-top:16px;"><a href="index.html#contact" style="color:#c9a84c;">Contact Carla →</a></p>
        </div>`;
    }
  } finally {
    IDX.isLoading = false;
  }
}

// ── Allow Enter key in keyword field ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const kw = document.getElementById('keyword');
  if (kw) kw.addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(1); });
});
