# ThreadIt API 🧵

[![Deployment Status](https://img.shields.io/badge/deployment-active-brightgreen)](http://34.91.78.87:3001)
[![Monitoring](https://img.shields.io/badge/monitoring-grafana-orange)](http://34.91.78.87:3001/d/nextjs-monitoring/next-js-app-monitoring?orgId=1&timezone=browser&refresh=5s&theme=dark)
[![Platform](https://img.shields.io/badge/platform-Google%20Cloud-4285F4)](https://cloud.google.com/)
[![API Docs](https://img.shields.io/badge/API-documentation-blue)](https://doc.echoapi.com/docs/detail/3fbadf56b402000?target_id=3af12ef179403b)

A [Reddit-like API](https://threadit.site) service with comprehensive monitoring using Prometheus and Grafana, deployed on Google Cloud Platform.

## 🌟 API Overview

ThreadIt API provides endpoints for a social news aggregation and discussion platform, including:

- 👤 **User management** - Authentication, profiles, and preferences
- 🏘️ **Subreddit creation and management** - Community spaces for specific topics
- 📝 **Thread posting and interaction** - Content creation and commenting
- 🔼 **Voting system** - Community-driven content ranking
- 🩺 **Health monitoring** - System status and performance metrics

## 🚀 Deployment

This project is deployed on a Google Cloud VM instance with the following specifications:

- **Region**: europe-west4 (Netherlands)
- **Machine Type**: e2-medium (2 vCPU, 4GB memory)
- **OS**: Debian 11 (Bullseye)
- **Networking**: External IP with firewall rules for ports 3001 (Grafana) and 9090 (Prometheus)

## 📊 Monitoring System

The API is monitored using Prometheus and Grafana to track key performance metrics:

### Grafana Dashboard

Monitoring dashboard is available at:
[ThreadIt Monitoring Dashboard](http://34.91.78.87:3001/d/nextjs-monitoring/next-js-app-monitoring?orgId=1&timezone=browser&refresh=5s&theme=dark)

<div align="center">
  <img src="https://img.shields.io/badge/Refresh%20Rate-5s-brightgreen" alt="Refresh Rate: 5s">
  <img src="https://img.shields.io/badge/Real%20Time-Monitoring-orange" alt="Real Time Monitoring">
  <img src="https://img.shields.io/badge/24%2F7-Metrics-green" alt="24/7 Metrics">
</div>

### 📈 Key Metrics

1. **Latency (Response Time)** ⏱️
   - `p50` (median response time): Baseline for average user experience
   - `p90` (90th percentile): Identifies performance issues affecting 10% of requests
   - `p99` (99th percentile): Highlights edge cases and worst-case scenarios

2. **Throughput** 🔄
   - Median requests per day: Establishes baseline traffic patterns
   - Peak traffic periods: Identifies high-load times requiring additional resources
   - Request rate by endpoint: Shows which API features are most heavily used(in progress)

3. **Availability** 🟢
   - Error rate percentage (daily): Short-term reliability indicator
   - Status code distribution: Breakdown of successful vs. error responses

## 🎯 Performance Baselines

<table>
  <thead>
    <tr>
      <th>Metric</th>
      <th style="background-color:#c6efce; color:#006100">Good</th>
      <th style="background-color:#ffeb9c; color:#9c5700">Warning</th>
      <th style="background-color:#ffc7ce; color:#9c0006">Critical</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>p50 Latency</b></td>
      <td>< 100ms</td>
      <td>100-300ms</td>
      <td>> 300ms</td>
    </tr>
    <tr>
      <td><b>p90 Latency</b></td>
      <td>< 200ms</td>
      <td>200-500ms</td>
      <td>> 500ms</td>
    </tr>
    <tr>
      <td><b>p99 Latency</b></td>
      <td>< 500ms</td>
      <td>500ms-1s</td>
      <td>> 1s</td>
    </tr>
    <tr>
      <td><b>Error Rate</b></td>
      <td>< 0.1%</td>
      <td>0.1-1%</td>
      <td>> 1%</td>
    </tr>
  </tbody>
</table>

## 🛠️ API Endpoints

```javascript
app.use('/api/v1/users', userRoutes);       // User management
app.use('/api/v1/subreddits', subredditRoutes); // Subreddit operations
app.use('/api/v1/threads', threadRoutes);   // Thread creation
app.use('/api/v1/votes', voteRoutes);       // Voting functionality
app.use('/api/v1/health', healthRoutes);    // Health checks
```

📚 Full API documentation: [ThreadIt API Docs](https://doc.echoapi.com/docs/detail/3fbadf56b402000?target_id=3af12ef179403b)


## 🔍 Troubleshooting

### API Issues

1. **Authentication failures** 🔐

1. Check JWT token expiration
2. Verify user credentials in the database



2. **Database connectivity** 💾

1. Ensure Prisma connection is properly configured
2. Check database server status





### Monitoring Issues

1. **No data in Grafana** 📊

1. Check Prometheus target status at `http://34.91.78.87:9090/targets`
2. Verify the API endpoint is exposing metrics correctly
3. Check network connectivity between containers



2. **Missing metrics** 📉

1. Ensure the API is properly instrumented
2. Check Prometheus scrape configuration
3. Verify metric names in Grafana queries

##

<div align="center">
  <p>Deployed on Google Cloud Platform</p>
  <img src="https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="Made with TypeScript">
  <img src="https://img.shields.io/badge/Monitored%20with-Prometheus-E6522C?style=for-the-badge&logo=prometheus" alt="Monitored with Prometheus">
  <img src="https://img.shields.io/badge/Visualized%20with-Grafana-F46800?style=for-the-badge&logo=grafana" alt="Visualized with Grafana">
</div>