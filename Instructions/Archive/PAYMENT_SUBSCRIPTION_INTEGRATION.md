# Payment & Subscription Integration Guide

## Current State

### Recent Changes
1. Updated API endpoints to use UUID instead of email
2. Modified payment service to handle user IDs properly
3. Implemented secure email handling through backend
4. Updated test scripts to use correct user ID format

### Security Guidelines
- User emails are never exposed in URLs or logs
- All endpoints use UUID from JWT token
- Email mapping is handled internally by the backend
- JWT token required for all endpoints

## API Endpoints

### Subscription Endpoints
```typescript
// Get user's subscription
GET /api/subscriptions/user/{userId}
Headers: {
  'Authorization': 'Bearer <token>'
}

// Create subscription checkout
POST /api/subscriptions/checkout
Headers: {
  'Authorization': 'Bearer <token>'
}
Body: {
  plan_id: string,
  user_id: string,
  return_url: string
}

// Cancel subscription
POST /api/subscriptions/cancel/{subscriptionId}
Headers: {
  'Authorization': 'Bearer <token>'
}
```

### Payment Endpoints
```typescript
// Get payment methods
GET /api/payments/methods/{userId}
Headers: {
  'Authorization': 'Bearer <token>'
}

// Add payment method
POST /api/payments/methods/add
Headers: {
  'Authorization': 'Bearer <token>'
}
Body: {
  user_id: string,
  return_url: string
}

// Set default payment method
POST /api/payments/methods/{paymentMethodId}/default
Headers: {
  'Authorization': 'Bearer <token>'
}
Body: {
  user_id: string
}

// Get payment history
GET /api/payments/history/{userId}
Headers: {
  'Authorization': 'Bearer <token>'
}
```

## Frontend Implementation

### API Utility Function
```typescript
const apiCall = async (endpoint: string, userId: string, token: string, options = {}) => {
  const response = await fetch(`${endpoint}/${userId}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  return response.json();
};
```

### Usage Examples
```typescript
// Get subscription
const getSubscription = (userId: string, token: string) => 
  apiCall('/api/subscriptions/user', userId, token);

// Get payment methods
const getPaymentMethods = (userId: string, token: string) => 
  apiCall('/api/payments/methods', userId, token);

// Add payment method
const addPaymentMethod = (userId: string, token: string, returnUrl: string) => 
  apiCall('/api/payments/methods/add', userId, token, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, return_url: returnUrl })
  });
```

### Error Handling
```typescript
try {
  const response = await apiCall(endpoint, userId, token);
  if (!response.ok) {
    switch (response.status) {
      case 401:
      case 403:
        // Redirect to login
        redirectToLogin();
        break;
      case 400:
        // Handle invalid request
        handleBadRequest(response);
        break;
      case 500:
        // Handle server error
        handleServerError(response);
        break;
    }
  }
  return response.json();
} catch (error) {
  handleError(error);
}
```

## Testing

### Test Script Example
```bash
# Test payment methods endpoint
curl -s -X GET "$API_URL/api/payments/methods/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## Next Steps
1. [ ] Implement frontend subscription status monitoring
2. [ ] Add webhook handling for subscription updates
3. [ ] Implement payment method management UI
4. [ ] Add subscription plan selection UI
5. [ ] Implement error handling and user feedback
6. [ ] Add loading states and optimistic updates

## Notes
- All user IDs should be extracted from JWT token
- Never use email addresses in API calls
- Always include JWT token in Authorization header
- Handle all error cases appropriately
- Implement proper loading states
- Add user feedback for all operations

## Questions or Updates
For any questions or updates, please coordinate with the backend team to avoid breaking changes. 