# Repack an unpacked .pptx folder: python build/pack.py <src_dir> <out.pptx>
import os, sys, zipfile

src, out = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(os.path.join(src, '[Content_Types].xml'), '[Content_Types].xml')
    for root, _, files in os.walk(src):
        for f in files:
            full = os.path.join(root, f)
            arc = os.path.relpath(full, src).replace(os.sep, '/')
            if arc != '[Content_Types].xml':
                z.write(full, arc)
print(out, os.path.getsize(out))
