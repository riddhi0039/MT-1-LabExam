import http from 'http';
import { readFile } from 'fs';


const vehicles = [
    { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
    { id: 2, vehicleName: "Maruti Swift", vehicleNumber: "DL8CAF5030", type: "Hatchback", price: 750000 },
    { id: 3, vehicleName: "Honda City", vehicleNumber: "UP14CD5678", type: "Sedan", price: 1200000 }
];

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>Welcome to Vehicle Management Application</h1>
                 <a href="/vehicles">Vehicles</a> |
                 <a href="/about">About</a> |
                 <a href="/info">Info</a>`);
    }

    else if (req.url === '/vehicles' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(vehicles));
    }

    else if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About</h1><p>Vehicle Management Web Application built using the Node.js HTTP module.</p>');
    }

    else if (req.url === '/info' && req.method === 'GET') {
        readFile("public/info.html", "utf-8", (err, data) => {
            if (err) {
                console.log(err.message);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Internal Server Error: Unable to read info.html</h1>');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else if (req.url === '/add-vehicle' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            let newVehicle;

            try {
                newVehicle = JSON.parse(body);
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }

            const { id, vehicleName, vehicleNumber, type, price } = newVehicle;
            if (!id || !vehicleName || !vehicleNumber || !type || !price) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    error: "id, vehicleName, vehicleNumber, type and price are required"
                }));
            }

            vehicles.push(newVehicle);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Vehicle added successfully", vehicle: newVehicle }));
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Page Not Found</h1>');
    }
})

server.listen(3000, "127.0.0.1", () => {
    console.log('HTTP Server running at http://localhost:3000');
})
