# Manual Testing Checklist

Print this page and check off each item as you test your app end-to-end.

---

## 1. Authentication (Auth)
- [ ] Register a new account via the signup page
- [ ] Log in with valid credentials
- [ ] Log out and confirm you cannot access protected pages
- [ ] Confirm JWT is stored in localStorage and used for API calls

## 2. User Profile (User Service)
- [ ] View your profile info (name, email) on the Account page
- [ ] (If available) Update and save your profile details

## 3. CV Management (CV Service)
- [ ] Upload a new CV (PDF, DOCX, etc.) and see it in your list
- [ ] List all uploaded CVs
- [ ] Select a CV for further actions
- [ ] Edit the content and save (if available)
- [ ] Delete a CV and confirm it disappears from the list
- [ ] Download a CV and verify the file

## 4. AI Features (AI Service)
- [ ] Select a CV, enter a job description, and click "Optimize with AI"
- [ ] See the optimized CV in the UI
- [ ] Click "Generate Cover Letter" and see the result
- [ ] See missing keywords and add them to your CV
- [ ] (If available) Run a full analysis and view feedback

## 5. Payments & Subscription (Payments Service)
- [ ] View all plans on the Pricing page
- [ ] Subscribe to a plan, complete Stripe checkout, and get redirected to the success page
- [ ] Cancel your subscription and see the status update
- [ ] View your current plan and renewal date on the Account page
- [ ] See your payment history table
- [ ] View, add, delete, and set default payment methods

## 6. General
- [ ] Try invalid actions (e.g., bad login, upload wrong file type) and see clear error messages
- [ ] See spinners or loading indicators during API calls
- [ ] All navigation links work and routes are protected as needed

---

**Notes:**
- Use the sample-cv.pdf for upload testing.
- Check the browser console for errors or failed network requests.
- If something fails, note the error and where it occurred. 