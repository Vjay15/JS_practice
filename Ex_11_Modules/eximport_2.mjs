import {name} from "./modules.mjs";

console.log(import.meta);
// Set name first
name.name = "Vjay"

// Use dynamic import to ensure name.name is set before eximport.mjs executes
import("./eximport.mjs")