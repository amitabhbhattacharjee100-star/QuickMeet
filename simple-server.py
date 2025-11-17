#!/usr/bin/env python3
"""
Simple HTTP Server for QuickMeet Demo
Run this if you have Python installed (no Node.js needed for demo)
"""
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 50)
        print("QuickMeet Demo Server")
        print("=" * 50)
        print(f"Server running at http://localhost:{PORT}/")
        print(f"Opening demo.html in your browser...")
        print("=" * 50)
        print("Press Ctrl+C to stop the server")
        print("=" * 50)
        
        # Open browser
        webbrowser.open(f'http://localhost:{PORT}/demo.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")

if __name__ == "__main__":
    main()

