# Creates a (non-compressed) zip of brotli-compressed files

# Remove all .br files in the public directory
find public -name '*.br' -delete &&
# In the dummy-assets directory, find everything except .woff2, .br and dotfiles and ...
find public/dummy-assets/* -type f \( ! -iname "*.woff2" ! -iname "*.br" ! -iname ".*" \) \
    -exec brotli --best {} \; && # ... run them through brotli with the best compression

# Additionally, use brotli for offline.html and meta.json
brotli --best public/offline.html public/meta.json &&

# Finally, zip them all up in a flat zip with no compression
zip --recurse-paths --junk-paths --no-dir-entries --compression-method store --filesync \
    public/package-of-br.zip \
    public/dummy-assets/*.br \
    public/dummy-assets/*.woff2 \
    public/offline.html.br \
    public/meta.json.br
