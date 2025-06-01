import type { APIRoute } from "astro";

/**
 * Simple image proxy endpoint that fetches an image from an external URL 
 * and serves it through this server to bypass cross-origin restrictions or blocking
 * 
 * Usage: /api/proxy-image?url={encoded-url}
 * Example: /api/proxy-image?url=https%3A%2F%2Fexample.com%2Fimage.jpg
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get("url");
    
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "URL parameter is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Try to fetch the external image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        // Set common headers to avoid being blocked
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": new URL(imageUrl).origin
      }
    });

    if (!imageResponse.ok) {
      return new Response(JSON.stringify({ 
        error: `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}` 
      }), {
        status: imageResponse.status,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Get the image buffer
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Return the original image with original content type
    const contentType = imageResponse.headers.get("Content-Type") || "image/jpeg";
    
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      }
    });
  } catch (error) {
    console.error("Error in image proxy:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};