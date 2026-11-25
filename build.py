#!/usr/bin/env python3
import os
import zipfile

def build():
    root = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(root, "dist")
    os.makedirs(dist_dir, exist_ok=True)
    
    xpi_path = os.path.join(dist_dir, "gemini-monet.xpi")
    zip_path = os.path.join(dist_dir, "gemini-monet.zip")
    
    include_files = [
        "manifest.json",
        "background.js",
        "content.js",
        "inject.css",
        "theme-map.json",
        "material-color.js",
        "LICENSE",
        "NOTICE",
    ]
    include_dirs = ["icons", "popup"]
    
    for target in [xpi_path, zip_path]:
        with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as z:
            for f in include_files:
                p = os.path.join(root, f)
                if os.path.exists(p):
                    z.write(p, f)
            for d in include_dirs:
                dp = os.path.join(root, d)
                if os.path.exists(dp):
                    for sub_root, _, files in os.walk(dp):
                        for file in files:
                            full_path = os.path.join(sub_root, file)
                            arc_name = os.path.relpath(full_path, root)
                            z.write(full_path, arc_name)
        print(f"Built: {target} ({os.path.getsize(target)} bytes)")

if __name__ == "__main__":
    build()
