const http = require('http'); 
const app = require('./app');


const PORT = process.env.PORT || 3000; 
const server = http.createServer(app);


server.listen(PORT, () => {
	 console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
	

