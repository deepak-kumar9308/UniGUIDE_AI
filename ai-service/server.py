import http.server
import socketserver
import json
import urllib.parse

from app import predict_admission, recommend_colleges, get_ml_analytics, PredictionRequest, RecommendationRequest, load_artifacts

class MLServiceHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/" or parsed.path == "":
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "UniGuide AI ML Service is active"}).encode())
        elif parsed.path == "/ml-analytics":
            self._set_headers(200)
            res = get_ml_analytics()
            self.wfile.write(json.dumps(res).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode())

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        if parsed.path == "/predict":
            try:
                req = PredictionRequest(
                    marks=float(body.get('marks', 75.0)),
                    entrance_score=float(body.get('entrance_score', 70.0)),
                    budget=float(body.get('budget', 200000.0)),
                    college_cutoff=float(body.get('college_cutoff', 80.0))
                )
                res = predict_admission(req)
                self._set_headers(200)
                self.wfile.write(json.dumps(res).encode())
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode())

        elif parsed.path == "/recommend":
            try:
                req = RecommendationRequest(
                    student_id=int(body.get('student_id', 1)),
                    marks=float(body.get('marks', 75.0)),
                    budget=float(body.get('budget', 200000.0)),
                    preferred_course=str(body.get('preferred_course', 'MCA')),
                    preferred_location=str(body.get('preferred_location', '')),
                    colleges=list(body.get('colleges', []))
                )
                res = recommend_colleges(req)
                self._set_headers(200)
                self.wfile.write(json.dumps(res).encode())
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode())

def run_server(port=8000):
    load_artifacts()
    with socketserver.TCPServer(("", port), MLServiceHandler) as httpd:
        print(f"UniGuide AI ML Service listening on port {port}...")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
