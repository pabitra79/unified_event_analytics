export class DeviceParser {
  static parseUserAgent(userAgent: string): { browser: string; os: string; device: string } {
    const ua = userAgent.toLowerCase();
    
    let browser = 'Unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';

    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios')) os = 'iOS';

    let device = 'desktop';
    if (ua.includes('mobile')) device = 'mobile';
    else if (ua.includes('tablet')) device = 'tablet';

    return { browser, os, device };
  }

  static parseScreenSize(screenSize: string): { width: number; height: number } {
    const [width, height] = screenSize.split('x').map(Number);
    return {
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height
    };
  }
}