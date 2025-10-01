from http.server import SimpleHTTPRequestHandler, HTTPServer, BaseHTTPRequestHandler
import sqlite3
import time
import json

class main(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/content':
            self.send_response(200)
            self.send_header('Content-type', 'text/json')
            self.end_headers()
            with open('content.json', 'rb') as file:
                self.wfile.write(file.read())

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        self.send_response(200)
        self.send_header('Content-type', 'application/javascript')
        self.end_headers()
        response = {'status': 'success', 'received': data}
        self.wfile.write(json.dumps(response).encode('utf-8'))
        print(data)
        # savetodb(data)

conn = sqlite3.connect('thedbb.db')
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS symptomlogs (id INTEGER PRIMARY KEY,timestamp INT, uuid TEXT, cough BIT, fever BIT, nausea BIT, breathing BIT, tiredness BIT, mood BIT, massloss BIT, pain BIT, longitude DECIMAL(9, 7), latitude DECIMAL(9, 7) )''')

def savetodb(data):
# data format data = ({[False, False, False, False, False, False, False, False], [4233, 2345], "gfergrg43780y04982r7fyw"})
# {'symptoms': [False, False, False, True, False, False, False, False], 'location': {'coords': {'accuracy': 100, 'longitude': 27.9953875, 'altitude': 1753.9000244140625, 'heading': 0, 'latitude': -26.2005381, 'altitudeAccuracy': 100, 'speed': 0}, 'mocked': False, 'timestamp': 1759257085426}, theUUID: "fbiwe09832923r90cvuijuJKBn"} <- real data
    symptoms = data['symptoms']
    location_longatude = data['location']['coords']['longitude']
    location_latitude = data['location']['coords']['latitude']
    uid = data['theUUID']
    
    cursor.execute('''
    INSERT INTO symptomlogs (time, uuid, cough, fever, nausea, breathing, tiredness, mood, massloss, pain, longitude, latitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (time.time(), uid, *symptoms, location_longatude, location_latitude))

if __name__ == '__main__':
    server_address = ("192.168.0.248", 8000)
    httpd = HTTPServer(server_address, main)
    httpd.serve_forever()
