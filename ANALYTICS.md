# Blog Analytics and Statistics

This document explains the analytics and statistics features implemented in your blog application.

## Features

### Event Tracking
- **Post Views**: Automatically tracks when users start and stop viewing posts
- **Session Duration**: Measures how long users spend reading each post
- **Daily Statistics**: Aggregates view counts and durations by day

### Data Visualization
- **Total Views**: Shows the total number of views for each post
- **Daily Views Chart**: Bar chart displaying views per day
- **Average Viewing Duration**: Line chart showing average reading time per day

## How It Works

### Backend Implementation

1. **Event Model** (`backend/src/db/models/event.js`)
   - Stores post views with session tracking
   - Tracks start/end times for duration calculation

2. **Event Service** (`backend/src/services/events.js`)
   - `trackEvent()`: Records user interactions
   - `getTotalViews()`: Counts total views per post
   - `getDailyViews()`: Aggregates daily view counts
   - `getDailyDurations()`: Calculates average viewing durations

3. **Event Routes** (`backend/src/routes/events.js`)
   - POST `/api/v1/events`: Track new events
   - GET `/api/v1/events/totalViews/:postId`: Get total views
   - GET `/api/v1/events/dailyViews/:postId`: Get daily view data
   - GET `/api/v1/events/dailyDurations/:postId`: Get duration data

### Frontend Implementation

1. **Event Tracking** (`src/components/Post.jsx`)
   - Automatically tracks when users view posts
   - Uses 1-second delay to avoid tracking accidental views
   - Tracks both start and end of viewing sessions

2. **Statistics Component** (`src/components/PostStats.jsx`)
   - Displays charts using Victory library
   - Shows total views and daily trends
   - Interactive tooltips with detailed information

3. **Integration** (`src/pages/Blog.jsx`)
   - Toggle button to show/hide statistics
   - Side panel for viewing post analytics

## Usage

### Viewing Statistics
1. Navigate to the main blog page
2. Click "Show Statistics" button
3. View charts showing post performance
4. Click "Close" to hide statistics

### Simulating Sample Data
To generate sample data for testing:

```bash
cd backend
node simulateEvents.js
```

This will create:
- 5 sample users
- 10 sample posts
- 1000 simulated view events over the last 30 days

### API Endpoints

#### Track Event
```javascript
POST /api/v1/events
{
  "postId": "post_id_here",
  "session": "optional_session_id",
  "action": "startView" // or "endView"
}
```

#### Get Statistics
```javascript
GET /api/v1/events/totalViews/:postId
GET /api/v1/events/dailyViews/:postId
GET /api/v1/events/dailyDurations/:postId
```

## MongoDB Aggregations

The system uses MongoDB aggregation pipelines to efficiently process event data:

- **$match**: Filter events by post and action type
- **$group**: Group events by day and calculate counts/averages
- **$project**: Transform data for visualization
- **$sort**: Order results chronologically

## Victory Charts

Two types of charts are implemented:

1. **Bar Chart**: Daily view counts with tooltips
2. **Line Chart**: Average viewing duration over time

Charts are responsive and include interactive tooltips showing detailed information.

## Privacy Considerations

- Event tracking is automatic and non-intrusive
- No personal data is collected beyond session IDs
- Users can view their own post statistics
- Consider adding privacy controls for production use

## Future Enhancements

Potential improvements:
- User authentication for personalized analytics
- Export statistics to CSV/PDF
- Advanced filtering (date ranges, post categories)
- Real-time statistics updates
- A/B testing for post performance
- Geographic analytics
- Device/browser analytics

