#!/bin/bash

# Set the base color for the favicon
COLOR="#5E3CD1"

# Create public directory if it doesn't exist
mkdir -p public

# Generate different sizes
sizes=(16 32 48 64 96 128 256 180)

for size in "${sizes[@]}"; do
  magick -background transparent -fill "$COLOR" -size "${size}x${size}" xc:transparent -font Arial -pointsize $((size/2)) -gravity center -annotate 0 "🔑" "public/favicon-${size}x${size}.png"
done

# Create .ico file with multiple sizes
magick \
  public/favicon-16x16.png \
  public/favicon-32x32.png \
  public/favicon-48x48.png \
  public/favicon-64x64.png \
  public/favicon-96x96.png \
  public/favicon-128x128.png \
  public/favicon-256x256.png \
  public/favicon.ico

# Create apple touch icon
cp public/favicon-180x180.png public/apple-touch-icon.png

# List created files
ls -l public/favicon*
