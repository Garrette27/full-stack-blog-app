import { getBackendUrl } from '../config.js'

export const postTrackEvent = (event) =>
  fetch(`${getBackendUrl()}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then((res) => res.json())

export const getTotalViews = (postId) =>
  fetch(`${getBackendUrl()}/events/totalViews/${postId}`).then(
    (res) => res.json(),
  )

export const getDailyViews = (postId) =>
  fetch(`${getBackendUrl()}/events/dailyViews/${postId}`).then(
    (res) => res.json(),
  )

export const getDailyDurations = (postId) =>
  fetch(`${getBackendUrl()}/events/dailyDurations/${postId}`).then((res) => res.json())
