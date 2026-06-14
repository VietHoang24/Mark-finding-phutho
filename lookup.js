// Accent removal helper for Vietnamese search
function removeAccents(str) {
  return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
}

// Global Stats calculations
let EXAM_DATA = [];
let maxScore = 0;
let avgScore = 0;
let medianScore = 0;
let topStudent = null;

// DOM Elements
const elements = {
  searchInput: document.getElementById('studentSearchInput'),
  suggestList: document.getElementById('suggestList'),
  resultCard: document.getElementById('studentResultCard'),
  globalStats: document.getElementById('globalStatsSection'),
  
  // Stats labels
  statAvg: document.getElementById('statAvg'),
  statMax: document.getElementById('statMax'),
  statMedian: document.getElementById('statMedian'),
  distributionChart: document.getElementById('distributionChart'),
  
  // Leaderboard Elements
  leaderboardBody: document.getElementById('leaderboardBody'),
  totalStudentsCount: document.getElementById('totalStudentsCount'),
  
  // Student card details
  resName: document.getElementById('resName'),
  resSbd: document.getElementById('resSbd'),
  resTotalScore: document.getElementById('resTotalScore'),
  resRank: document.getElementById('resRank'),
  resMath: document.getElementById('resMath'),
  resLit: document.getElementById('resLit'),
  resEng: document.getElementById('resEng'),
  analyticsContent: document.getElementById('analyticsContent')
};

let currentSchool = '102';
let _lastSelectedSbd = null;

async function loadSchoolData(schoolCode) {
  try {
    currentSchool = schoolCode;
    
    // Reset search input and details card
    elements.searchInput.value = '';
    elements.suggestList.style.display = 'none';
    elements.resultCard.classList.add('hide');
    elements.globalStats.style.display = 'block';
    
    if (elements.leaderboardBody) {
      elements.leaderboardBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Đang tải dữ liệu điểm thi trường...</td></tr>';
    }
    
    // Fetch pre-crawled database dynamically
    const res = await fetch(`data_${schoolCode}.json?v=2`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    EXAM_DATA = await res.json();
    
    calculateGlobalStats();
    renderDistributionChart();
    renderFullLeaderboard();
    
    // Update active button state
    document.querySelectorAll('.school-btn').forEach(btn => {
      if (btn.getAttribute('data-school') === schoolCode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update dropdown select state
    const schoolSelect = document.getElementById('schoolSelect');
    if (schoolSelect && schoolSelect.value !== schoolCode) {
      schoolSelect.value = schoolCode;
    }

    
  } catch (err) {
    console.error(`Lỗi tải tệp data_${schoolCode}.json:`, err);
    if (elements.leaderboardBody) {
      elements.leaderboardBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Không thể tải cơ sở dữ liệu điểm thi trường ${schoolCode} (data_${schoolCode}.json).</td></tr>`;
    }
  }
}

// Initialize Lookup portal
document.addEventListener('DOMContentLoaded', async () => {
  // Load default school 102
  await loadSchoolData('102');
  setupSearch();
  setupSchoolSelector();
  
  // Auto-focus search on load
  elements.searchInput.focus();
});

// Setup event listeners for school buttons or dropdown select
function setupSchoolSelector() {
  const schoolSelect = document.getElementById('schoolSelect');
  if (schoolSelect) {
    schoolSelect.addEventListener('change', () => {
      const schoolCode = schoolSelect.value;
      if (schoolCode !== currentSchool) {
        loadSchoolData(schoolCode);
      }
    });
  }

  document.querySelectorAll('.school-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const schoolCode = btn.getAttribute('data-school');
      if (schoolCode !== currentSchool) {
        loadSchoolData(schoolCode);
      }
    });
  });
}

// Calculate metrics
function calculateGlobalStats() {
  if (!EXAM_DATA || EXAM_DATA.length === 0) return;
  
  const totalStudents = EXAM_DATA.length;
  
  // 1. Max / Top Student
  maxScore = Math.max(...EXAM_DATA.map(d => d.total));
  topStudent = EXAM_DATA.find(d => d.total === maxScore);
  
  // 2. Average
  const sum = EXAM_DATA.reduce((acc, curr) => acc + curr.total, 0);
  avgScore = sum / totalStudents;
  
  // 3. Median
  const sortedTotals = EXAM_DATA.map(d => d.total).sort((a, b) => a - b);
  medianScore = sortedTotals[Math.floor(totalStudents / 2)];
  
  // Populate UI
  elements.statAvg.innerText = avgScore.toFixed(2);
  elements.statMax.innerText = maxScore.toFixed(2);
  elements.statMax.title = `Thủ khoa: ${topStudent.name} (SBD: ${topStudent.sbd})`;
  elements.statMedian.innerText = medianScore.toFixed(2);
}

// Generate CSS Horizontal Bar Chart for Score distribution
function renderDistributionChart() {
  if (!EXAM_DATA) return;
  
  // Define buckets
  const buckets = [
    { label: '< 10 điểm', min: 0, max: 9.99, count: 0 },
    { label: '10 - 15 điểm', min: 10, max: 14.99, count: 0 },
    { label: '15 - 20 điểm', min: 15, max: 19.99, count: 0 },
    { label: '20 - 22 điểm', min: 20, max: 21.99, count: 0 },
    { label: '22 - 24 điểm', min: 22, max: 23.99, count: 0 },
    { label: '24 - 26 điểm', min: 24, max: 26.00, count: 0 }
  ];
  
  // Count
  EXAM_DATA.forEach(student => {
    for (let b of buckets) {
      if (student.total >= b.min && student.total <= b.max) {
        b.count++;
        break;
      }
    }
  });
  
  // Find max count to scale width percentages
  const maxCount = Math.max(...buckets.map(b => b.count));
  
  // Render
  elements.distributionChart.innerHTML = '';
  buckets.forEach(b => {
    const pct = maxCount > 0 ? (b.count / maxCount) * 100 : 0;
    
    const row = document.createElement('div');
    row.className = 'dist-bar-row';
    row.innerHTML = `
      <div class="dist-label">${b.label}</div>
      <div class="dist-track">
        <div class="dist-fill" style="width: ${pct}%"></div>
      </div>
      <div class="dist-count">${b.count} hs</div>
    `;
    elements.distributionChart.appendChild(row);
  });
}

// Render the full leaderboard table at the bottom
function renderFullLeaderboard() {
  if (!EXAM_DATA || !elements.leaderboardBody) return;
  
  elements.totalStudentsCount.innerText = `${EXAM_DATA.length} học sinh`;
  elements.leaderboardBody.innerHTML = '';
  
  EXAM_DATA.forEach(student => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-sbd', student.sbd);
    tr.setAttribute('data-name', removeAccents(student.name.toLowerCase()));
    
    // Rank cell with styled medals for Top 3
    const rankTd = document.createElement('td');
    rankTd.style.textAlign = 'center';
    if (student.rank === 1) {
      rankTd.innerHTML = '<i class="fa-solid fa-trophy" style="color: #fbbf24;" title="Thủ khoa"></i> 1';
      rankTd.style.fontWeight = '700';
    } else if (student.rank === 2) {
      
      rankTd.innerHTML = '<i class="fa-solid fa-medal" style="color: #94a3b8;" title="Á khoa 1"></i> 2';
      rankTd.style.fontWeight = '700';
    } else if (student.rank === 3) {
      rankTd.innerHTML = '<i class="fa-solid fa-medal" style="color: #b45309;" title="Á khoa 2"></i> 3';
      rankTd.style.fontWeight = '700';
    } else {
      rankTd.innerText = `#${student.rank}`;
    }
    tr.appendChild(rankTd);
    
    // SBD
    const sbdTd = document.createElement('td');
    sbdTd.innerHTML = `<strong>${student.sbd}</strong>`;
    sbdTd.style.fontFamily = 'Courier New, monospace';
    tr.appendChild(sbdTd);
    
    // Name
    const nameTd = document.createElement('td');
    nameTd.innerText = student.name;
    tr.appendChild(nameTd);
    
    // Scores
    const mathTd = document.createElement('td');
    mathTd.innerText = student.math.toFixed(2);
    mathTd.style.textAlign = 'center';
    tr.appendChild(mathTd);
    
    const litTd = document.createElement('td');
    litTd.innerText = student.lit.toFixed(2);
    litTd.style.textAlign = 'center';
    tr.appendChild(litTd);
    
    const engTd = document.createElement('td');
    engTd.innerText = student.eng.toFixed(2);
    engTd.style.textAlign = 'center';
    tr.appendChild(engTd);
    
    // Total
    const totalTd = document.createElement('td');
    totalTd.innerText = student.total.toFixed(3);
    totalTd.style.textAlign = 'center';
    totalTd.style.color = 'var(--success-color)';
    totalTd.style.fontWeight = '700';
    tr.appendChild(totalTd);
    
    elements.leaderboardBody.appendChild(tr);
  });
}

// Setup fuzzy lookup and suggestion drop
function setupSearch() {
  elements.searchInput.addEventListener('input', () => {
    const rawQuery = elements.searchInput.value.trim();
    const cleanQuery = removeAccents(rawQuery.toLowerCase());
    
    if (!cleanQuery) {
      elements.suggestList.style.display = 'none';
      elements.resultCard.classList.add('hide');
      elements.globalStats.style.display = 'block';
      
      // Clear leaderboard row highlights & search filters
      clearLeaderboardFiltersAndHighlights();
      return;
    }
    
    // Fuzzy matching filter
    const matches = EXAM_DATA.filter(student => {
      const matchSbd = student.sbd.startsWith(cleanQuery);
      const cleanName = removeAccents(student.name.toLowerCase());
      const matchName = cleanName.includes(cleanQuery);
      return matchSbd || matchName;
    });
    
    showSuggestions(matches.slice(0, 6));
    filterLeaderboardTable(cleanQuery);
  });
  
  // Keyboard enter submits first suggestion
  elements.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const items = elements.suggestList.querySelectorAll('.suggest-item');
      if (items.length > 0) {
        items[0].click();
      }
    }
  });
  
  // Click outside suggestions lists hides them
  document.addEventListener('click', (e) => {
    if (e.target !== elements.searchInput && e.target !== elements.suggestList) {
      elements.suggestList.style.display = 'none';
    }
  });
}

// Show auto suggest list
function showSuggestions(list) {
  elements.suggestList.innerHTML = '';
  
  if (list.length === 0) {
    elements.suggestList.innerHTML = '<li style="padding: 12px 16px; color: var(--text-muted); font-size: 13px;">Không tìm thấy thí sinh nào</li>';
    elements.suggestList.style.display = 'block';
    return;
  }
  
  list.forEach(student => {
    const li = document.createElement('li');
    li.className = 'suggest-item';
    li.innerHTML = `
      <span>${student.name}</span>
      <span class="sbd-badge">${student.sbd}</span>
    `;
    li.addEventListener('click', () => {
      elements.searchInput.value = student.name;
      elements.suggestList.style.display = 'none';
      renderStudentResultCard(student);
      // Scroll to the result card smoothly
      setTimeout(() => {
        document.getElementById('studentResultCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });

    elements.suggestList.appendChild(li);
  });
  
  elements.suggestList.style.display = 'block';
}

// Filter the Leaderboard table rows on typing
function filterLeaderboardTable(cleanQuery) {
  const rows = elements.leaderboardBody.querySelectorAll('tr');
  rows.forEach(row => {
    const sbd = row.getAttribute('data-sbd');
    const name = row.getAttribute('data-name');
    
    if (sbd.includes(cleanQuery) || name.includes(cleanQuery)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Highlight a row in the leaderboard — does NOT scroll the page, only highlights
function highlightLeaderboardRow(sbd) {
  const rows = elements.leaderboardBody.querySelectorAll('tr');
  rows.forEach(row => {
    row.style.background = '';
    row.style.fontWeight = '';
    row.style.borderLeft = '';
    row.style.display = '';
    if (row.getAttribute('data-sbd') === sbd) {
      row.style.background = 'rgba(99, 102, 241, 0.2)';
      row.style.fontWeight = '600';
      row.style.borderLeft = '4px solid #6366f1';
    }
  });
}

// Scroll to and highlight leaderboard row — called by the button inside the result card
function scrollToLeaderboardRow() {
  if (!_lastSelectedSbd) return;
  const sbd = _lastSelectedSbd;

  // Make sure leaderboard rows are all visible (no filter active)
  const rows = elements.leaderboardBody.querySelectorAll('tr');
  let targetRow = null;
  rows.forEach(row => {
    row.style.background = '';
    row.style.fontWeight = '';
    row.style.borderLeft = '';
    row.style.display = '';
    if (row.getAttribute('data-sbd') === sbd) {
      targetRow = row;
    }
  });

  if (targetRow) {
    targetRow.style.background = 'rgba(99, 102, 241, 0.2)';
    targetRow.style.fontWeight = '600';
    targetRow.style.borderLeft = '4px solid #6366f1';
    setTimeout(() => {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }
}

// Highlight a row in the leaderboard and scroll it into view smoothly (legacy)
function highlightAndScrollToLeaderboardRow(sbd) {
  const rows = elements.leaderboardBody.querySelectorAll('tr');
  let targetRow = null;
  
  rows.forEach(row => {
    // Reset background and border
    row.style.background = '';
    row.style.fontWeight = '';
    row.style.borderLeft = '';
    row.style.display = ''; // Make sure it's visible
    
    if (row.getAttribute('data-sbd') === sbd) {
      targetRow = row;
    }
  });
  
  if (targetRow) {
    targetRow.style.background = 'rgba(99, 102, 241, 0.2)';
    targetRow.style.fontWeight = '600';
    targetRow.style.borderLeft = '4px solid #6366f1';
    
    // Smooth scroll inside container
    setTimeout(() => {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}

// Reset all leaderboard filters and highlights
function clearLeaderboardFiltersAndHighlights() {
  const rows = elements.leaderboardBody.querySelectorAll('tr');
  rows.forEach(row => {
    row.style.display = '';
    row.style.background = '';
    row.style.fontWeight = '';
    row.style.borderLeft = '';
  });
}

// Render candidate profile card and analysis
function renderStudentResultCard(student) {
  _lastSelectedSbd = student.sbd;
  elements.globalStats.style.display = 'none';
  elements.resultCard.className = 'card glass-card result-score-card';
  
  // Apply glowing borders for top ranks
  if (student.rank === 1) elements.resultCard.classList.add('gold-border');
  else if (student.rank === 2) elements.resultCard.classList.add('silver-border');
  else if (student.rank === 3) elements.resultCard.classList.add('bronze-border');
  
  // Fill details
  elements.resName.innerText = student.name;
  elements.resSbd.innerText = student.sbd;
  elements.resTotalScore.innerText = student.total.toFixed(3);
  elements.resRank.innerText = `#${student.rank}`;
  
  // Individual subject scores
  elements.resMath.innerText = student.math.toFixed(2);
  elements.resLit.innerText = student.lit.toFixed(2);
  elements.resEng.innerText = student.eng.toFixed(2);
  
  // Analytics
  const totalCandidates = EXAM_DATA.length;
  const percentile = (student.rank / totalCandidates) * 100;
  const scoredBelow = totalCandidates - student.rank;
  const pctScoredBelow = (scoredBelow / totalCandidates) * 100;
  
  const isAboveAvg = student.total > avgScore;
  const diffAvg = Math.abs(student.total - avgScore).toFixed(2);
  const diffMax = (maxScore - student.total).toFixed(2);
  
  elements.analyticsContent.innerHTML = `
    <div class="analytics-item">
      <i class="fa-solid fa-circle-check" style="color: var(--success-color);"></i>
      <span>Bạn thuộc <strong>Top ${percentile.toFixed(2)}%</strong> thí sinh xuất sắc nhất.</span>
    </div>
    <div class="analytics-item">
      <i class="fa-solid fa-chart-line" style="color: var(--primary-color);"></i>
      <span>Điểm số của bạn cao hơn <strong>${scoredBelow}</strong> thí sinh (${pctScoredBelow.toFixed(2)}% của dải quét).</span>
    </div>
    <div class="analytics-item">
      <i class="fa-solid ${isAboveAvg ? 'fa-trending-up' : 'fa-trending-down'}" style="color: ${isAboveAvg ? 'var(--success-color)' : 'var(--danger-color)'};"></i>
      <span>${isAboveAvg ? 'Cao' : 'Thấp'} hơn điểm trung bình cả dải quét là <strong>${diffAvg} điểm</strong>.</span>
    </div>
    ${student.total === maxScore ? `
      <div class="analytics-item">
        <i class="fa-solid fa-trophy" style="color: #fbbf24;"></i>
        <span>🌟 <strong>Chúc mừng! Bạn chính là Thủ Khoa kỳ thi này!</strong></span>
      </div>
    ` : `
      <div class="analytics-item">
        <i class="fa-solid fa-flag-checkered" style="color: var(--text-secondary);"></i>
        <span>Cách điểm Thủ khoa (${topStudent.name}) đúng <strong>${diffMax} điểm</strong>.</span>
      </div>
    `}
    <button class="btn-view-in-list" onclick="scrollToLeaderboardRow()">
      <i class="fa-solid fa-table-list"></i> Xem vị trí trong bảng xếp hạng
    </button>
  `;
  
  elements.resultCard.classList.remove('hide');
}
