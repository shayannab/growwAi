# GrowEasy CSV Backend

This is the backend API for GrowEasy CRM, built with Node.js, Express, TypeScript, and the Groq SDK.

## How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The backend will start running on [http://localhost:3001](http://localhost:3001).

4. **Build for Production**:
   ```bash
   npm run build
   ```
   This will compile the TypeScript code into the `dist/` directory.

---

## Deployment to Render

To deploy this backend on [Render](https://render.com) as a **Web Service**:

1. Create a new **Web Service** and link your GitHub repository (`growwAi`).
2. Set the following configuration details:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Add the following **Environment Variable** in the Render settings:
   - `GROQ_API_KEY`: `your_groq_api_key_here`
