import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import tripsReducer from './slices/tripsSlice';
import destinationsReducer from './slices/destinationsSlice';
import activitiesReducer from './slices/activitiesSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    trips: tripsReducer,
    destinations: destinationsReducer,
    activities: activitiesReducer,
  },
});