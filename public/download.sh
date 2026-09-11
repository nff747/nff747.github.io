#!/usr/bin/env bash
# ==============================================================================
# 🚀 nff747 Open-Source Ecosystem Universal Downloader
# Easy one-click project download script for developers and non-coders alike.
# Website: https://nff747.github.io/download
# GitHub:  https://github.com/nff747
# ==============================================================================

set -e

# Color palette
C_CYAN='\033[0;36m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[1;33m'
C_BLUE='\033[0;34m'
C_MAGENTA='\033[0;35m'
C_RED='\033[0;31m'
C_BOLD='\033[1m'
C_RESET='\033[0m'

REPOS=(
  "auto-rig-web:3D Humanoid Auto-Rigging inside Web Worker (Three.js/ONNX)"
  "splat-bvh-core:GPU LBVH & Bitonic Sort in WGSL for 3D Gaussian Splats"
  "aerocache:13M ops/sec Zero-GC Off-Heap In-Memory Cache (Java 21)"
  "helix-lsm:Lock-Free Distributed LSM-Tree Storage Engine (Rust)"
  "swarm-refactor:Actor-Model Multi-Agent Code Self-Healing Framework (Python)"
  "neural-texture-engine:AI Real-Time Texture Super-Resolution (WebGPU/WebGL2)"
  "nova-wasm:Fast Systems Language Compiling Directly to WASM (Rust)"
  "webgpu-vram-pager:Async Ring Buffer VRAM Paging & Weight Streaming (WebGPU)"
  "spatial-glass-ui:Zero-DOM WebGL2 Spatial Glassmorphism Interface (WebGL2)"
  "edge-context-router:Quantized Edge Semantic Context Router for LLMs (TS)"
)

clear 2>/dev/null || true

echo -e "${C_CYAN}${C_BOLD}"
cat << 'EOF'
  ███╗   ██╗███████╗███████╗███████╗██╗  ██╗███████╗
  ████╗  ██║██╔════╝██╔════╝╚════██║██║  ██║╚════██║
  ██╔██╗ ██║█████╗  █████╗      ██╔╝███████║    ██╔╝
  ██║╚██╗██║██╔══╝  ██╔══╝     ██╔╝ ╚════██║   ██╔╝ 
  ██║ ╚████║██║     ██║        ██║       ██║   ██║  
  ╚═╝  ╚═══╝╚═╝     ╚═╝        ╚═╝       ╚═╝   ╚═╝  
   --- OPEN SOURCE DEEP-TECH ECOSYSTEM DOWNLOADER ---
EOF
echo -e "${C_RESET}"
echo -e "${C_GREEN}✔ All projects are 100% Free & Open Source (MIT License for commercial use)${C_RESET}"
echo -e "${C_YELLOW}✔ No coding knowledge required — ready to run and explore!${C_RESET}\n"

# Check download tool
DL_CMD=""
if command -v curl >/dev/null 2>&1; then
  DL_CMD="curl"
elif command -v wget >/dev/null 2>&1; then
  DL_CMD="wget"
else
  echo -e "${C_RED}Error: Neither 'curl' nor 'wget' was found on your system.${C_RESET}"
  exit 1
fi

TARGET_DIR="${1:-./nff747-ecosystem}"
mkdir -p "$TARGET_DIR"

download_repo_zip() {
  local repo_name="$1"
  local dest_dir="$TARGET_DIR/$repo_name"
  local zip_file="$TARGET_DIR/${repo_name}.zip"
  local url="https://github.com/nff747/${repo_name}/archive/refs/heads/main.zip"

  echo -e "${C_CYAN}⬇ Downloading ${C_BOLD}${repo_name}${C_RESET}${C_CYAN}...${C_RESET}"
  
  if [ "$DL_CMD" = "curl" ]; then
    curl -fL -# -o "$zip_file" "$url"
  else
    wget -q --show-progress -O "$zip_file" "$url"
  fi

  if command -v unzip >/dev/null 2>&1; then
    echo -e "${C_BLUE}📦 Extracting ${repo_name}...${C_RESET}"
    rm -rf "$dest_dir"
    mkdir -p "$dest_dir"
    unzip -q -o "$zip_file" -d "$TARGET_DIR"
    # Normalize unzipped directory name
    if [ -d "$TARGET_DIR/${repo_name}-main" ]; then
      rm -rf "$dest_dir"
      mv "$TARGET_DIR/${repo_name}-main" "$dest_dir"
    fi
    rm -f "$zip_file"
    echo -e "${C_GREEN}✔ Ready in: ${dest_dir}${C_RESET}\n"
  else
    echo -e "${C_GREEN}✔ Saved ZIP archive: ${zip_file}${C_RESET}\n"
  fi
}

clone_repo_git() {
  local repo_name="$1"
  local dest_dir="$TARGET_DIR/$repo_name"
  local url="https://github.com/nff747/${repo_name}.git"

  echo -e "${C_CYAN}⬇ Cloning ${C_BOLD}${repo_name}${C_RESET}${C_CYAN} with Git...${C_RESET}"
  rm -rf "$dest_dir"
  git clone --depth 1 "$url" "$dest_dir"
  echo -e "${C_GREEN}✔ Cloned into: ${dest_dir}${C_RESET}\n"
}

# Menu
echo -e "${C_BOLD}Choose a download option:${C_RESET}"
echo -e "  ${C_CYAN}[1]${C_RESET} ${C_BOLD}Download ALL 10 Projects (.ZIP - Recommended for non-coders)${C_RESET}"
echo -e "  ${C_CYAN}[2]${C_RESET} ${C_BOLD}Download ALL 10 Projects via Git Clone${C_RESET}"
echo -e "  ${C_CYAN}[3]${C_RESET} Pick and choose individual project(s)"
echo -e "  ${C_CYAN}[4]${C_RESET} Exit"
echo ""
read -r -p "Enter selection [1-4, default: 1]: " choice
choice="${choice:-1}"

case "$choice" in
  1)
    echo -e "\n${C_MAGENTA}🚀 Downloading complete 10-project ecosystem to '${TARGET_DIR}'...${C_RESET}\n"
    for item in "${REPOS[@]}"; do
      repo="${item%%:*}"
      download_repo_zip "$repo"
    done
    ;;
  2)
    if ! command -v git >/dev/null 2>&1; then
      echo -e "${C_RED}Git is not installed. Falling back to ZIP download...${C_RESET}"
      for item in "${REPOS[@]}"; do
        repo="${item%%:*}"
        download_repo_zip "$repo"
      done
    else
      echo -e "\n${C_MAGENTA}🚀 Cloning all 10 projects to '${TARGET_DIR}'...${C_RESET}\n"
      for item in "${REPOS[@]}"; do
        repo="${item%%:*}"
        clone_repo_git "$repo"
      done
    fi
    ;;
  3)
    echo -e "\n${C_BOLD}Select a project to download:${C_RESET}"
    idx=1
    for item in "${REPOS[@]}"; do
      repo="${item%%:*}"
      desc="${item#*:}"
      echo -e "  ${C_CYAN}[$idx]${C_RESET} ${C_BOLD}${repo}${C_RESET} - ${desc}"
      ((idx++))
    done
    echo ""
    read -r -p "Enter project number [1-${#REPOS[@]}]: " pnum
    if [[ "$pnum" =~ ^[0-9]+$ ]] && [ "$pnum" -ge 1 ] && [ "$pnum" -le "${#REPOS[@]}" ]; then
      selected_item="${REPOS[$((pnum-1))]}"
      selected_repo="${selected_item%%:*}"
      echo ""
      download_repo_zip "$selected_repo"
    else
      echo -e "${C_RED}Invalid selection.${C_RESET}"
      exit 1
    fi
    ;;
  4)
    echo -e "${C_YELLOW}Cancelled.${C_RESET}"
    exit 0
    ;;
  *)
    echo -e "${C_RED}Invalid option.${C_RESET}"
    exit 1
    ;;
esac

echo -e "${C_GREEN}${C_BOLD}================================================================${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}🎉 All downloads completed successfully!${C_RESET}"
echo -e "${C_BOLD}📂 Location:${C_RESET} $(cd "$TARGET_DIR" 2>/dev/null && pwd || echo "$TARGET_DIR")"
echo -e "${C_CYAN}🌐 Web Hub:${C_RESET}  https://nff747.github.io/download"
echo -e "${C_YELLOW}📜 License:${C_RESET}  MIT (Free for commercial use with visible nff747 attribution)"
echo -e "${C_GREEN}${C_BOLD}================================================================${C_RESET}\n"
