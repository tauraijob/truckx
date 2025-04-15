export default defineEventHandler(async (event) => {
  // TODO: Implement proper authentication
  // For now, return mock data
  return {
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'TRUCK_PROVIDER'
    }
  }
}) 