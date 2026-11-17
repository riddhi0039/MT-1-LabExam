import express from 'express';

const app = express();

app.use(express.json());

let vehicles = [
    { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
    { id: 2, vehicleName: "Maruti Swift", vehicleNumber: "DL8CAF5030", type: "Hatchback", price: 750000 },
    { id: 3, vehicleName: "Honda City", vehicleNumber: "UP14CD5678", type: "Sedan", price: 1200000 }
];

app.get('/vehicles', (req, res) => {
    console.log(`${req.method} ${req.url}`);
    res.status(200).json(vehicles);
});

app.get('/vehicles/:id', (req, res) => {
    console.log(`${req.method} ${req.url}`);
    const vehicle = vehicles.find((v) => v.id === parseInt(req.params.id));

    if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
});

app.post('/vehicles', (req, res) => {
    console.log(`${req.method} ${req.url}`);
    const { id, vehicleName, vehicleNumber, type, price } = req.body;


    if (!id || !vehicleName || !vehicleNumber || !type || price === undefined) {
        return res.status(400).json({
            error: "id, vehicleName, vehicleNumber, type and price are required"
        });
    }

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "price must be a positive number" });
    }

    if (vehicles.some((v) => v.id === id)) {
        return res.status(400).json({ error: "Vehicle with this id already exists" });
    }

    const newVehicle = { id, vehicleName, vehicleNumber, type, price };
    vehicles.push(newVehicle);

    res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
});

app.put('/vehicles/:id', (req, res) => {
    console.log(`${req.method} ${req.url}`);
    const vehicle = vehicles.find((v) => v.id === parseInt(req.params.id));

    if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
    }

    const { vehicleName, vehicleNumber, type, price } = req.body;

    if (!vehicleName || !vehicleNumber || !type || price === undefined) {
        return res.status(400).json({
            error: "vehicleName, vehicleNumber, type and price are required"
        });
    }

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "price must be a positive number" });
    }

    vehicle.vehicleName = vehicleName;
    vehicle.vehicleNumber = vehicleNumber;
    vehicle.type = type;
    vehicle.price = price;

    res.status(200).json({ message: "Vehicle updated successfully", vehicle });
});

app.delete('/vehicles/:id', (req, res) => {
    console.log(`${req.method} ${req.url}`);
    const index = vehicles.findIndex((v) => v.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: "Vehicle not found" });
    }

    const deletedVehicle = vehicles.splice(index, 1)[0];
    res.status(200).json({ message: "Vehicle deleted successfully", vehicle: deletedVehicle });
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: "Invalid JSON format" });
    }
    res.status(500).json({ error: "Internal server error" });
});

app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});

