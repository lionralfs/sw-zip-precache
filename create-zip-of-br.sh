# Creates a (non-compressed) zip of brotli-compressed files

# Remove all .br files in the public directory
find public -name '*.br' -delete &&
# In the precache directory, find everything except .woff2, .br and dotfiles and ...
find public/precache/* -type f \( ! -iname "*.woff2" ! -iname "*.br" ! -iname ".*" \) \
    -exec brotli --best {} \; && # ... run them through brotli with the best compression

# Additionally, use brotli for offline.html and meta.json
brotli --best public/meta.json &&

# Finally, zip them all up in a flat zip with no compression
zip --recurse-paths --junk-paths --no-dir-entries --compression-method store --filesync \
    public/package-of-br.zip \
    public/precache/*.br \
    public/precache/*.woff2 \
    public/meta.json.br
