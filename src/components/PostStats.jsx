import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
} from '../api/events.js'
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory'

export function PostStats({ postId }) {
  const totalViews = useQuery({
    queryKey: ['totalViews', postId],
    queryFn: () => getTotalViews(postId),
  })
  const dailyViews = useQuery({
    queryKey: ['dailyViews', postId],
    queryFn: () => getDailyViews(postId),
  })
  const dailyDurations = useQuery({
    queryKey: ['dailyDurations', postId],
    queryFn: () => getDailyDurations(postId),
  })

  if (
    totalViews.isLoading ||
    dailyViews.isLoading ||
    dailyDurations.isLoading
  ) {
    return <div>Loading stats...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Post Statistics</h3>
      <div style={{ marginBottom: '20px' }}>
        <strong>{totalViews.data?.views || 0} total views</strong>
      </div>
      
      {dailyViews.data && dailyViews.data.length > 0 && (
        <div style={{ width: 600, marginBottom: '30px' }}>
          <h4>Daily Views</h4>
          <VictoryChart domainPadding={16}>
            <VictoryBar
              labelComponent={<VictoryTooltip />}
              data={dailyViews.data?.map((d) => ({
                x: new Date(d._id),
                y: d.views,
                label: `${new Date(d._id).toLocaleDateString()}: ${d.views} views`,
              }))}
            />
          </VictoryChart>
        </div>
      )}

      {dailyDurations.data && dailyDurations.data.length > 0 && (
        <div style={{ width: 600 }}>
          <h4>Daily Average Viewing Duration</h4>
          <VictoryChart
            domainPadding={16}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension='x'
                labels={({ datum }) =>
                  `${datum.x.toLocaleDateString()}: ${datum.y.toFixed(2)} minutes`
                }
                labelComponent={<VictoryTooltip />}
              />
            }
          >
            <VictoryLine
              data={dailyDurations.data?.map((d) => ({
                x: new Date(d._id),
                y: d.averageDuration / (60 * 1000),
              }))}
            />
          </VictoryChart>
        </div>
      )}

      {(!dailyViews.data || dailyViews.data.length === 0) && 
       (!dailyDurations.data || dailyDurations.data.length === 0) && (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          No viewing data available yet. View this post to start collecting statistics!
        </div>
      )}
    </div>
  )
}

PostStats.propTypes = {
  postId: PropTypes.string.isRequired,
}

