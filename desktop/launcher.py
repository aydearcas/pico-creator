"""Optional desktop launcher. Standard library only; packaged with PyInstaller."""
from __future__ import annotations
import argparse
import functools
import http.server
import pathlib
import sys
import threading
import webbrowser


def app_path() -> pathlib.Path:
    root = pathlib.Path(getattr(sys, "_MEIPASS", pathlib.Path(__file__).resolve().parents[1]))
    for path in (root / "PICO-Creator.html", root / "dist" / "index.html"):
        if path.is_file():
            return path
    raise FileNotFoundError("PICO-Creator.html not found / No se encuentra PICO-Creator.html")


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def do_HEAD(self):
        if self.path.split("?", 1)[0] not in ("/", "/PICO-Creator.html", "/index.html"):
            self.send_error(404)
            return
        self.path = "/" + self.server.app_file.name
        super().do_HEAD()

    def do_GET(self):
        # Serve only the application; do not list directories or expose source files.
        if self.path.split("?", 1)[0] not in ("/", "/PICO-Creator.html", "/index.html"):
            self.send_error(404)
            return
        self.path = "/" + self.server.app_file.name
        super().do_GET()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--headless", action="store_true")
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    app = app_path()
    if args.check:
        print(app)
        return
    handler = functools.partial(Handler, directory=str(app.parent))
    # Stable loopback origin keeps browser recovery drafts associated with this launcher.
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 8768), handler)
    server.app_file = app
    url = "http://127.0.0.1:8768/"
    worker = threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    if not args.no_browser:
        webbrowser.open(url)
    try:
        if args.headless:
            print(f"PICO Creator: {url}\nCtrl+C to close / Ctrl+C para cerrar", flush=True)
            worker.join()
        else:
            try:
                import tkinter as tk
                from tkinter import ttk
                window = tk.Tk()
                window.title("PICO Creator")
                window.geometry("430x200")
                window.resizable(False, False)
                frame = ttk.Frame(window, padding=22)
                frame.pack(fill="both", expand=True)
                ttk.Label(frame, text="PICO Creator", font=("Segoe UI", 16)).pack(anchor="w")
                ttk.Label(frame, text="Running locally / Aplicación local activa").pack(anchor="w", pady=(10, 3))
                ttk.Label(frame, text=url).pack(anchor="w")
                buttons = ttk.Frame(frame)
                buttons.pack(anchor="e", pady=(18, 0))
                ttk.Button(buttons, text="Open / Abrir", command=lambda: webbrowser.open(url)).pack(side="left", padx=6)
                ttk.Button(buttons, text="Quit / Salir", command=window.destroy).pack(side="left")
                window.mainloop()
            except Exception:
                if getattr(sys, "frozen", False):
                    raise
                print(f"PICO Creator: {url}\nCtrl+C to close / Ctrl+C para cerrar", flush=True)
                worker.join()
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
