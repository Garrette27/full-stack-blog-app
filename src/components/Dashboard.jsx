import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboardAnalytics, getUserSessions } from '../api/dashboard.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import './Dashboard.css'

export function Dashboard() {
  const [token] = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: () => getDashboardAnalytics(token),
    enabled: !!token,
  })

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['user-sessions'],
    queryFn: () => getUserSessions(token, 20),
    enabled: !!token,
  })

  if (!token) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p>Please log in to view your dashboard.</p>
      </div>
    )
  }

  if (analyticsLoading || sessionsLoading) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <div className="loading">Loading dashboard data...</div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const formatLocation = (location) => {
    return `${location.city}, ${location.region}, ${location.country}`
  }

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'devices' ? 'active' : ''}
          onClick={() => setActiveTab('devices')}
        >
          Devices
        </button>
        <button 
          className={activeTab === 'locations' ? 'active' : ''}
          onClick={() => setActiveTab('locations')}
        >
          Locations
        </button>
        <button 
          className={activeTab === 'activity' ? 'active' : ''}
          onClick={() => setActiveTab('activity')}
        >
          Activity Timeline
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Sessions</h3>
                <div className="stat-value">{analytics?.totalSessions || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Last Login</h3>
                <div className="stat-value">
                  {analytics?.lastLogin ? formatDate(analytics.lastLogin) : 'Never'}
                </div>
              </div>
              <div className="stat-card">
                <h3>Account Created</h3>
                <div className="stat-value">
                  {analytics?.lastSignup ? formatDate(analytics.lastSignup) : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="devices-section">
            <h3>Device Analytics</h3>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Device Types</h4>
                <div className="analytics-list">
                  {Object.entries(analytics?.deviceStats?.deviceTypes || {}).map(([device, count]) => (
                    <div key={device} className="analytics-item">
                      <span className="device-type">{device}</span>
                      <span className="count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="analytics-card">
                <h4>Browsers</h4>
                <div className="analytics-list">
                  {Object.entries(analytics?.deviceStats?.browsers || {}).map(([browser, count]) => (
                    <div key={browser} className="analytics-item">
                      <span className="browser">{browser}</span>
                      <span className="count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="analytics-card">
                <h4>Operating Systems</h4>
                <div className="analytics-list">
                  {Object.entries(analytics?.deviceStats?.operatingSystems || {}).map(([os, count]) => (
                    <div key={os} className="analytics-item">
                      <span className="os">{os}</span>
                      <span className="count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="locations-section">
            <h3>Location Analytics</h3>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Countries</h4>
                <div className="analytics-list">
                  {Object.entries(analytics?.locationStats?.countries || {}).map(([country, count]) => (
                    <div key={country} className="analytics-item">
                      <span className="country">{country}</span>
                      <span className="count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="analytics-card">
                <h4>Cities</h4>
                <div className="analytics-list">
                  {Object.entries(analytics?.locationStats?.cities || {}).map(([city, count]) => (
                    <div key={city} className="analytics-item">
                      <span className="city">{city}</span>
                      <span className="count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-section">
            <h3>Recent Activity</h3>
            <div className="activity-timeline">
              {sessions?.map((session, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {session.action === 'login' ? '🔑' : session.action === 'signup' ? '📝' : '🚪'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-action">
                      {session.action === 'login' ? 'Logged In' : 
                       session.action === 'signup' ? 'Account Created' : 'Logged Out'}
                    </div>
                    <div className="activity-details">
                      <span className="device">{session.deviceInfo?.deviceType || 'Unknown'} • </span>
                      <span className="browser">{session.deviceInfo?.browser || 'Unknown'} • </span>
                      <span className="location">{formatLocation(session.locationInfo)}</span>
                    </div>
                    <div className="activity-time">{formatDate(session.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}





















