# Deploying the Backend to Render.com

1. **Login to Render.com**

   - Go to [https://dashboard.render.com](https://dashboard.render.com) and log in to your account

2. **Navigate to Your Web Service**

   - Find your "backend-supersquiz" service in the dashboard

3. **Deploy Latest Changes**

   - If you've connected your GitHub repository, you can manually deploy by clicking the "Manual Deploy" button and select "Deploy latest commit"
   - If not, ensure you push your latest changes to the repository connected to Render

4. **Verify CORS Settings**

   - After deployment, check the logs to ensure the server started correctly
   - Make a test request from your Netlify site to confirm CORS is working

5. **Debugging CORS Issues**

   - If CORS issues persist, try these steps:
     - Check if the deployed server is using the correct version of your code
     - Verify that the environment variables are set correctly in Render
     - Try temporarily setting `origin: "*"` in your CORS configuration for testing (remember to change it back for production)

6. **Testing Your API**
   - Use a tool like Postman to test your API endpoints directly
   - Include the `Origin` header in your test requests to simulate cross-origin requests
