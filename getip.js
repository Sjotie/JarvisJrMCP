import { networkInterfaces } from 'os';

/**
 * Gets the local IP address (non-localhost)
 */
function getLocalIpAddress() {
  const nets = networkInterfaces();
  
  // First try to find Wi-Fi interface
  for (const name of Object.keys(nets)) {
    if (name.toLowerCase().includes('wi-fi')) {
      const interfaces = nets[name];
      if (!interfaces) continue;
      
      for (const net of interfaces) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }

  // Fallback to first non-internal IPv4 address from any interface
  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;
    
    for (const net of interfaces) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  
  return 'localhost'; // Fallback to localhost if no other IP found
}

// Print all network interfaces for debugging
console.log('\nAll network interfaces:');
console.log(JSON.stringify(networkInterfaces(), null, 2));

// Print the detected local IP
console.log('\nDetected local IP:');
console.log(getLocalIpAddress());
