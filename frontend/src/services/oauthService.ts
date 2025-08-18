import React from "react";

interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

interface GoogleOAuthConfig extends OAuthConfig {
  responseType?: "code" | "token";
  accessType?: "online" | "offline";
  prompt?: "none" | "consent" | "select_account";
}

interface LinkedInOAuthConfig extends OAuthConfig {
  state?: string;
}

class OAuthService {
  // Google OAuth configuration
  private googleConfig: GoogleOAuthConfig = {
    clientId: "425401566082-eie01hplk2hm2mgd04cqk509orfmipi2.apps.googleusercontent.com", // Real Google Client ID
    redirectUri: `${window.location.origin}/auth/google/callback`,
    scope: "openid email profile",
    responseType: "code",
    accessType: "offline",
    prompt: "select_account"
  };

  // LinkedIn OAuth configuration
  private linkedinConfig: LinkedInOAuthConfig = {
    clientId: "78dpf66evefqj5", // Real LinkedIn Client ID
    redirectUri: `${window.location.origin}/auth/linkedin/callback`,
    scope: "openid profile email",
    state: this.generateState()
  };

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Initiate Google OAuth flow
  initiateGoogleAuth(): void {
    const params = new URLSearchParams({
      client_id: this.googleConfig.clientId,
      redirect_uri: this.googleConfig.redirectUri,
      scope: this.googleConfig.scope,
      response_type: this.googleConfig.responseType!,
      access_type: this.googleConfig.accessType!,
      prompt: this.googleConfig.prompt!
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
  }

  // Initiate LinkedIn OAuth flow
  initiateLinkedInAuth(): void {
    // Redirect to backend's LinkedIn OAuth endpoint to ensure correct redirect_uri
    window.location.href = "https://candidatev-auth-production.up.railway.app/auth/linkedin";
  }

  // Handle OAuth callback (call this from your callback route)
  async handleGoogleCallback(code: string): Promise<any> {
    try {
      // This should be handled by your backend
      const response = await fetch("/api/auth/google/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code }),
        credentials: "include" // Ensure cookies are sent/received
      });

      if (!response.ok) {
        throw new Error("OAuth callback failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      throw error;
    }
  }

  async handleLinkedInCallback(code: string, state: string): Promise<any> {
    try {
      // Verify state parameter to prevent CSRF attacks
      if (state !== this.linkedinConfig.state) {
        throw new Error("Invalid state parameter");
      }

      // This should be handled by your backend
      const response = await fetch("/api/auth/linkedin/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, state }),
        credentials: "include" // Ensure cookies are sent/received
      });

      if (!response.ok) {
        throw new Error("OAuth callback failed");
      }

      return await response.json();
    } catch (error) {
      console.error("LinkedIn OAuth callback error:", error);
      throw error;
    }
  }

  // Update configuration (useful for different environments)
  updateGoogleConfig(config: Partial<GoogleOAuthConfig>): void {
    this.googleConfig = { ...this.googleConfig, ...config };
  }

  updateLinkedInConfig(config: Partial<LinkedInOAuthConfig>): void {
    this.linkedinConfig = { ...this.linkedinConfig, ...config };
  }
}

export const oauthService = new OAuthService();
export type { GoogleOAuthConfig, LinkedInOAuthConfig }; 