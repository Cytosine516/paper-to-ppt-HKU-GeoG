import sys, re, zipfile, shutil
src=sys.argv[1]; tmp=src+'.tmp'
pat=re.compile(r'<a:pPr\b[^>]*?/>|<a:pPr\b[^>]*?>.*?</a:pPr>', re.S)
def fixp(m):
    body=m.group(0); seen=[0]
    def keep(mm):
        seen[0]+=1
        return mm.group(0) if seen[0]==1 else ''
    return pat.sub(keep, body)
with zipfile.ZipFile(src) as zi, zipfile.ZipFile(tmp,'w',zipfile.ZIP_DEFLATED) as zo:
    for it in zi.infolist():
        data=zi.read(it.filename)
        if re.match(r'ppt/slides/slide\d+\.xml$', it.filename):
            x=data.decode('utf8')
            x=re.sub(r'<a:p>.*?</a:p>', fixp, x, flags=re.S)
            data=x.encode('utf8')
        zo.writestr(it, data)
shutil.move(tmp, src)
print('fixed', src)
