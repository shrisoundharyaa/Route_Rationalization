from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from google.transit import gtfs_realtime_pb2
from google.protobuf.json_format import MessageToDict

app = Flask(__name__)
CORS(app)
@app.route('/api/vehicle-positions', methods=['GET'])
def get_vehicle_positions():
    bus_id = request.args.get('bus_id')  # Get the bus ID from query parameters
    url = "https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key=yca7ebT5Tg3LtDYNdQigGTqv9YZ57Ydx"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching data from API: {e}"}), 500

    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)
    data_json = MessageToDict(feed)

    positions = []
    for entity in data_json.get("entity", []):
        vehicle = entity.get("vehicle", {})
        position = vehicle.get("position", {})
        trip_id = vehicle.get("trip", {}).get("tripId")
        vehicle_id = vehicle.get("vehicle", {}).get("id")
        latitude = position.get("latitude")
        longitude = position.get("longitude")

        if latitude and longitude and trip_id and vehicle_id:
            position_data = {
                "vehicle_id": vehicle_id,
                "trip_id": trip_id,
                "latitude": latitude,
                "longitude": longitude,
                "source": "Unknown",
                "destination": "Unknown"
            }
            # If a bus ID is provided, only return matching records
            if not bus_id or bus_id == vehicle_id:
                positions.append(position_data)

    # Return the filtered data as JSON
    return jsonify(positions) 

if __name__ == '__main__':
    app.run(debug=True)
