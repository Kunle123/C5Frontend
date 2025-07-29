export default async function handler(req, res) {
    const { cvId } = req.query;
    const backendUrl = `https://cvservice-production.up.railway.app/api/cv/${cvId}/download`;
  
    // Log the incoming request for debugging
    console.log('Proxying CV download for:', cvId);
  
    // Forward the Authorization header if present
    const headers = {};
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
  
    // Fetch from backend
    const response = await fetch(backendUrl, { headers });
  
    // Log backend response status
    console.log('Backend response status:', response.status);
  
    // Forward status and headers
    res.status(response.status);
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }
  
    // Stream the response
    response.body.pipe(res);
  }