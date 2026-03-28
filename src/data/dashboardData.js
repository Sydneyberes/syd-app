// ============================================================
// Route Planner Metrics Dashboard — Mock Data
// ============================================================

// Fleet Score
export const fleetScore = {
  score: 83,
  zone: 'Good',
  delta: '+4',
  components: {
    onTime: 87,
    pod: 91,
    durationVar: -6,
    stopCompletion: 98,
  },
};

// Stat Cards
export const statCards = [
  { label: 'Routes Completed', value: '342', delta: '+12%', positive: true },
  { label: 'Stops Served', value: '4,891', delta: '+9%', positive: true },
  { label: 'Distance (mi)', value: '12,440', delta: '+7%', positive: true },
  { label: 'Route Hours', value: '1,026', delta: '+11%', positive: true },
  { label: 'Avg Duration', value: '3h 01m', delta: '−2%', positive: true },
  { label: 'Avg Stops/Route', value: '14.3', delta: '−0.4', positive: false },
];

// Drivers
export const drivers = [
  { id: 1, name: 'Marcus Webb',   rank: 1, delta: '+2', score: 91, routes: 47, hours: 141, stops: 671, pod: 96, onTime: 92, streak: 7,  tier: 'Gold' },
  { id: 2, name: 'Diana Osei',    rank: 2, delta: '=',  score: 87, routes: 43, hours: 129, stops: 615, pod: 94, onTime: 89, streak: 4,  tier: 'Gold' },
  { id: 3, name: 'Tyrell Santos', rank: 3, delta: '−1', score: 82, routes: 39, hours: 117, stops: 558, pod: 91, onTime: 85, streak: 0,  tier: 'Silver' },
  { id: 4, name: 'Priya Nair',    rank: 4, delta: '+1', score: 78, routes: 36, hours: 108, stops: 514, pod: 88, onTime: 82, streak: 0,  tier: 'Silver' },
  { id: 5, name: 'Josh Kim',      rank: 5, delta: '−2', score: 71, routes: 31, hours: 93,  stops: 443, pod: 85, onTime: 79, streak: 0,  tier: 'Silver' },
  { id: 6, name: 'Leila Brooks',  rank: 6, delta: '=',  score: 64, routes: 26, hours: 78,  stops: 371, pod: 79, onTime: 73, streak: 0,  tier: 'Bronze' },
  { id: 7, name: 'Carlos Reyes',  rank: 7, delta: '−1', score: 58, routes: 21, hours: 63,  stops: 300, pod: 72, onTime: 68, streak: 0,  tier: 'Bronze' },
  { id: 8, name: 'Amber Zhou',    rank: 8, delta: 'NEW', score: 44, routes: 12, hours: 36, stops: 171, pod: 61, onTime: 59, streak: 0,  tier: 'At Risk' },
];
export const fleetMedianRoutes = 33.5;

// Vehicles
// PMH = Productive Machine Hours (SMH – mechanical delays – non-mechanical delays)
// Utilization (%) = (PMH / SMH) × 100
// Status: Over-utilized >85%, Optimized 55–85%, Under-utilized <55%
const computeVehicle = (v) => {
  const pmh = v.smh - v.mechanicalDelays - v.nonMechanicalDelays;
  const utilPct = Math.round((pmh / v.smh) * 100);
  const status =
    utilPct > 85 ? 'Over-utilized' :
    utilPct >= 55 ? 'Optimized' :
    'Under-utilized';
  return { ...v, pmh, utilPct, status };
};

export const vehicles = [
  computeVehicle({ id: 1, name: 'Van 03',   type: 'Van',   routes: 47, miles: 1410, hours: 141, smh: 160, mechanicalDelays: 4,  nonMechanicalDelays: 8  }),
  computeVehicle({ id: 2, name: 'Truck 01', type: 'Truck', routes: 38, miles: 1140, hours: 114, smh: 140, mechanicalDelays: 6,  nonMechanicalDelays: 14 }),
  computeVehicle({ id: 3, name: 'Van 01',   type: 'Van',   routes: 31, miles: 930,  hours: 93,  smh: 120, mechanicalDelays: 8,  nonMechanicalDelays: 18 }),
  computeVehicle({ id: 4, name: 'Truck 02', type: 'Truck', routes: 18, miles: 540,  hours: 54,  smh: 120, mechanicalDelays: 12, nonMechanicalDelays: 34 }),
  computeVehicle({ id: 5, name: 'Van 02',   type: 'Van',   routes: 12, miles: 360,  hours: 36,  smh: 120, mechanicalDelays: 18, nonMechanicalDelays: 54 }),
  computeVehicle({ id: 6, name: 'Van 04',   type: 'Van',   routes: 5,  miles: 150,  hours: 15,  smh: 120, mechanicalDelays: 22, nonMechanicalDelays: 78 }),
];
export const vehicleFleetAvgRoutes = 25.2;
export const vehicleFleetAvgMiles = 755;

// Route Efficiency — last 14 days
export const routeEfficiency = [
  { date: 'Mar 13', planned: 3.2, actual: 3.0, onTimeRate: 91 },
  { date: 'Mar 14', planned: 3.2, actual: 3.5, onTimeRate: 84 },
  { date: 'Mar 15', planned: 3.2, actual: 2.9, onTimeRate: 93 },
  { date: 'Mar 16', planned: 3.2, actual: 3.8, onTimeRate: 79 },
  { date: 'Mar 17', planned: 3.2, actual: 3.1, onTimeRate: 88 },
  { date: 'Mar 18', planned: 3.2, actual: 4.1, onTimeRate: 74 },
  { date: 'Mar 19', planned: 3.2, actual: 2.8, onTimeRate: 90 },
  { date: 'Mar 20', planned: 3.2, actual: 3.4, onTimeRate: 85 },
  { date: 'Mar 21', planned: 3.2, actual: 3.6, onTimeRate: 82 },
  { date: 'Mar 22', planned: 3.2, actual: 3.0, onTimeRate: 91 },
  { date: 'Mar 23', planned: 3.2, actual: 3.3, onTimeRate: 87 },
  { date: 'Mar 24', planned: 3.2, actual: 3.9, onTimeRate: 77 },
  { date: 'Mar 25', planned: 3.2, actual: 3.1, onTimeRate: 89 },
  { date: 'Mar 26', planned: 3.2, actual: 3.4, onTimeRate: 86 },
];

// Last 7 days for grouped bar
export const last7Days = routeEfficiency.slice(-7);

// Trends — last 8 weeks
export const weeklyTrends = [
  { week: 'Wk 1', routes: 34, stops: 486, distance: 1020, hours: 102 },
  { week: 'Wk 2', routes: 36, stops: 514, distance: 1080, hours: 108 },
  { week: 'Wk 3', routes: 37, stops: 529, distance: 1110, hours: 111 },
  { week: 'Wk 4', routes: 39, stops: 557, distance: 1170, hours: 117 },
  { week: 'Wk 5', routes: 40, stops: 572, distance: 1200, hours: 120 },
  { week: 'Wk 6', routes: 42, stops: 600, distance: 1260, hours: 126 },
  { week: 'Wk 7', routes: 43, stops: 614, distance: 1290, hours: 129 },
  { week: 'Wk 8', routes: 44, stops: 629, distance: 1320, hours: 132 },
];

// Weekday averages
export const weekdayAvg = [
  { day: 'Mon', avgRoutes: 7.2 },
  { day: 'Tue', avgRoutes: 8.4 },
  { day: 'Wed', avgRoutes: 8.1 },
  { day: 'Thu', avgRoutes: 7.6 },
  { day: 'Fri', avgRoutes: 6.9 },
  { day: 'Sat', avgRoutes: 2.1 },
  { day: 'Sun', avgRoutes: 2.8 },
];

// POD Data
export const podData = {
  overallRate: 91,
  tier: 'Silver',
  byTaskType: [
    { type: 'Dropoff',        rate: 95 },
    { type: 'Photo',          rate: 93 },
    { type: 'Signature',      rate: 89 },
    { type: 'Pickup',         rate: 87 },
    { type: 'Recipient Name', rate: 84 },
  ],
  failureReasons: [
    { reason: 'Recipient unavailable', count: 34 },
    { reason: 'Connectivity issue',    count: 28 },
    { reason: 'App error',             count: 19 },
    { reason: 'Driver skipped',        count: 14 },
    { reason: 'Location mismatch',     count: 9  },
  ],
};
