# creates a (non-compressed) zip of brotli-compressed files

brotli --best public/offline.html public/dummy-assets/* &&
    zip --recurse-paths --junk-paths --no-dir-entries --compression-method store --filesync \
        public/package-of-br.zip public/dummy-assets/*.br public/offline.html.br &&
    find public -name '*.br' -delete
