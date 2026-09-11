#!/usr/bin/env python3
"""
🚀 nff747 Open-Source Ecosystem Universal Downloader (Python 3)
Cross-platform 1-click downloader for Windows, macOS, and Linux.
No third-party packages required (pure Python standard library).

Website: https://nff747.github.io/download
GitHub:  https://github.com/nff747
"""

import sys
import os
import urllib.request
import zipfile
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor

REPOS = [
    {
        "name": "auto-rig-web",
        "category": "3D & Graphics",
        "lang": "TypeScript",
        "desc": "Zero-click 3D humanoid auto-rigging inside Web Worker (Three.js/ONNX)",
    },
    {
        "name": "splat-bvh-core",
        "category": "3D & Graphics",
        "lang": "WebGPU / WGSL",
        "desc": "Real-time Karras 2012 GPU LBVH & Bitonic Sort for 3D Gaussian Splats",
    },
    {
        "name": "aerocache",
        "category": "High-Performance Systems",
        "lang": "Java 21",
        "desc": "13M ops/sec Zero-GC Off-Heap In-Memory Cache with Unsafe memory slabs",
    },
    {
        "name": "helix-lsm",
        "category": "Storage & Compilers",
        "lang": "Rust",
        "desc": "Distributed Lock-Free LSM-Tree Storage Engine with Crossbeam Skiplist",
    },
    {
        "name": "swarm-refactor",
        "category": "AI & LLM Systems",
        "lang": "Python",
        "desc": "Actor-Model Multi-Agent Code Self-Healing Framework with POSIX Sandboxing",
    },
    {
        "name": "neural-texture-engine",
        "category": "3D & Graphics",
        "lang": "WebGPU / WebGL2",
        "desc": "AI Real-Time Texture Super-Resolution Engine with analytical filters",
    },
    {
        "name": "nova-wasm",
        "category": "Storage & Compilers",
        "lang": "Rust",
        "desc": "Sub-millisecond Systems Language Compiling Directly to WebAssembly",
    },
    {
        "name": "webgpu-vram-pager",
        "category": "High-Performance Systems",
        "lang": "WebGPU / TypeScript",
        "desc": "Async Ring Buffer VRAM Paging & Weight Streaming for In-Browser LLMs",
    },
    {
        "name": "spatial-glass-ui",
        "category": "3D & Graphics",
        "lang": "WebGL2 / React",
        "desc": "Zero-DOM Hardware-Accelerated Spatial Glassmorphism UI with Phantom DOM",
    },
    {
        "name": "edge-context-router",
        "category": "AI & LLM Systems",
        "lang": "TypeScript",
        "desc": "Quantized Edge Semantic Context Router for LLMs (83% Token Savings)",
    },
]

BANNER = r"""
  ███╗   ██╗███████╗███████╗███████╗██╗  ██╗███████╗
  ████╗  ██║██╔════╝██╔════╝╚════██║██║  ██║╚════██║
  ██╔██╗ ██║█████╗  █████╗      ██╔╝███████║    ██╔╝
  ██║╚██╗██║██╔══╝  ██╔══╝     ██╔╝ ╚════██║   ██╔╝ 
  ██║ ╚████║██║     ██║        ██║       ██║   ██║  
  ╚═╝  ╚═══╝╚═╝     ╚═╝        ╚═╝       ╚═╝   ╚═╝  
   --- OPEN SOURCE DEEP-TECH ECOSYSTEM DOWNLOADER ---
"""

def download_and_extract_zip(repo_name: str, target_dir: str):
    url = f"https://github.com/nff747/{repo_name}/archive/refs/heads/main.zip"
    dest_dir = os.path.join(target_dir, repo_name)
    zip_path = os.path.join(target_dir, f"{repo_name}.zip")
    
    print(f"⬇ Downloading {repo_name}...")
    headers = {"User-Agent": "nff747-downloader/1.0"}
    req = urllib.request.Request(url, headers=headers)
    
    with urllib.request.urlopen(req) as response, open(zip_path, 'wb') as out_file:
        shutil.copyfileobj(response, out_file)
    
    print(f"📦 Extracting {repo_name}...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(target_dir)
        
    extracted_folder = os.path.join(target_dir, f"{repo_name}-main")
    if os.path.exists(extracted_folder):
        if os.path.exists(dest_dir):
            shutil.rmtree(dest_dir)
        os.rename(extracted_folder, dest_dir)
        
    if os.path.exists(zip_path):
        os.remove(zip_path)
        
    print(f"✔ {repo_name} ready in: {dest_dir}")
    return dest_dir

def clone_repo(repo_name: str, target_dir: str):
    url = f"https://github.com/nff747/{repo_name}.git"
    dest_dir = os.path.join(target_dir, repo_name)
    print(f"⬇ Cloning {repo_name} with Git...")
    if os.path.exists(dest_dir):
        shutil.rmtree(dest_dir)
    subprocess.run(["git", "clone", "--depth", "1", url, dest_dir], check=True)
    print(f"✔ {repo_name} cloned in: {dest_dir}")
    return dest_dir

def main():
    print(BANNER)
    print("✔ All 10 projects are 100% Free & Open Source (Commercial MIT License)")
    print("✔ Compatible with Windows, macOS, and Linux\n")
    
    target_dir = os.path.abspath("./nff747-ecosystem")
    os.makedirs(target_dir, exist_ok=True)
    
    print("Choose download option:")
    print("  [1] Download ALL 10 Projects (.ZIP - Recommended for non-coders)")
    print("  [2] Clone ALL 10 Projects via Git")
    print("  [3] Choose individual project to download")
    print("  [4] Exit\n")
    
    try:
        choice = input("Enter selection [1-4, default: 1]: ").strip() or "1"
    except (KeyboardInterrupt, EOFError):
        print("\nExiting.")
        sys.exit(0)
        
    if choice == "1":
        print(f"\n🚀 Downloading all 10 projects in parallel to '{target_dir}'...\n")
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(download_and_extract_zip, r["name"], target_dir) for r in REPOS]
            for f in futures:
                f.result()
    elif choice == "2":
        print(f"\n🚀 Cloning all 10 projects to '{target_dir}'...\n")
        for r in REPOS:
            clone_repo(r["name"], target_dir)
    elif choice == "3":
        print("\nSelect a project to download:")
        for idx, r in enumerate(REPOS, 1):
            print(f"  [{idx:2d}] {r['name']:<24} ({r['lang']:<12}) - {r['desc']}")
        print()
        try:
            sel = int(input(f"Enter project number [1-{len(REPOS)}]: ").strip())
            if 1 <= sel <= len(REPOS):
                selected = REPOS[sel - 1]["name"]
                print(f"\n🚀 Downloading {selected}...")
                download_and_extract_zip(selected, target_dir)
            else:
                print("Invalid selection.")
                sys.exit(1)
        except (ValueError, KeyboardInterrupt):
            print("Invalid input.")
            sys.exit(1)
    else:
        print("Cancelled.")
        sys.exit(0)
        
    print("\n" + "=" * 65)
    print("🎉 All selected projects downloaded successfully!")
    print(f"📂 Saved to: {target_dir}")
    print("🌐 Web Hub:  https://nff747.github.io/download")
    print("📜 License:  MIT (Free for commercial use with visible nff747 credit)")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    main()
