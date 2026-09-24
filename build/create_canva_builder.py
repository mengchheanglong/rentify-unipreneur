from pathlib import Path

root = Path(r'C:\Users\User\Downloads\rentify-national-challenge')
source = (root / 'build' / 'build_deck.mjs').read_text(encoding='utf-8')
source = source.replace(
    "const FINAL = path.join(ROOT, 'output', 'Rentify_UniPreneur_Pitch_v5.pptx');",
    "const FINAL = path.join(ROOT, 'output', 'Rentify_UniPreneur_Canva_Import.pptx');",
)
start = source.index('  const tb=s.tables.add(', source.index('// Appendix 11. Competitor evidence'))
end = source.index("  text(s,'Khmum overlaps", start)
replacement = '''  // Canva import copy: use editable text boxes and simple rectangles instead of a PowerPoint table.
  const widths=[205,465,466], xPositions=[72,277,742], tableTop=188, rowH=75.2;
  rows.forEach((row,r)=>{
    let x=xPositions[0], y=tableTop+r*rowH;
    row.forEach((value,c)=>{
      const fill=r===0?C.navy:C.pale;
      rect(s,x,y,widths[c],rowH,fill);
      text(s,value,x+14,y+13,widths[c]-26,rowH-19,22,r===0?C.white:C.ink,r===0);
      x+=widths[c];
    });
  });
  for(let r=0;r<=5;r++)rect(s,72,tableTop+r*rowH,1136,1,C.line);
  for(const x of [72,277,742,1208])rect(s,x,tableTop,1,rowH*5,C.line);
'''
source = source[:start] + replacement + source[end:]
source = source.replace("const candidate=path.join(stage,'candidate.pptx');", "const candidate=path.join(stage,'candidate-canva.pptx');")
source = source.replace("layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','11'],", "layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],")
source = source.replace('requiredNativeTableOwnerSlides:[11],requiredNativeChartOwnerSlides:[],', 'requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],')
source = source.replace('Rentify_UniPreneur_Pitch.validation-v5-team-portraits-cropped.json', 'Rentify_UniPreneur_Canva_Import.validation.json')
destination = root / 'build' / 'build_deck_canva.mjs'
destination.write_text(source, encoding='utf-8')
print(f'Created Canva import builder: {destination}')
