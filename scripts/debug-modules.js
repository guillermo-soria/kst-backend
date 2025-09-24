const MedusaApp = require("@medusajs/modules-sdk").default;

async function debugModules() {
  try {
    console.log('=== DEBUGGING MEDUSA MODULES ===\n');
    
    // Load the configuration
    const config = require("../medusa-config.js");
    console.log('Current configuration:');
    console.log(JSON.stringify(config, null, 2));
    
    console.log('\n=== CHECKING MODULE RESOLUTION ===');
    
    // Try to create a MedusaApp to see what happens
    const medusaApp = await MedusaApp({
      ...config,
      workerMode: "shared"
    });
    
    console.log('MedusaApp created successfully');
    
    // Check what modules are loaded
    const modules = medusaApp.modules;
    console.log('\nLoaded modules:', Object.keys(modules));
    
    // Check auth module specifically
    if (modules.authModule) {
      console.log('\nAuth module found:', !!modules.authModule);
      console.log('Auth module methods:', Object.getOwnPropertyNames(modules.authModule));
    } else {
      console.log('\n❌ Auth module not found');
    }
    
    await medusaApp.shutdown();
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugModules().catch(console.error);
