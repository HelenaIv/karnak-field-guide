"""Build content/reading/names.json: every king whose names visitors meet at Karnak.
Spellings come from Wikipedia infobox <hiero> markup (Manuel de Codage), converted to Gardiner
codes with the WikiHiero phoneme table, so no sign is typed by hand.
Usage: python names2.py <images_dir> <repo_dir>"""
import json, re, sys, unicodedata
IMG, REPO = sys.argv[1], sys.argv[2]
ph = dict(re.findall(r'"([^"]+)"\s*=>\s*"([^"]+)"', open(IMG + '/wh-tables.php', encoding='utf-8').read().split('$wh_phonemes', 1)[1].split('];', 1)[0]))
CODE = re.compile(r'^([A-Z][a-z]?)(\d+)([A-Za-z]?)$')

def code_of(tok):
    tok = tok.strip().strip('\\')
    if not tok:
        return None
    if CODE.match(tok):
        c = tok
    elif tok in ph:
        c = ph[tok]
    else:
        raise ValueError('unknown token ' + tok)
    m = CODE.match(c)
    unicodedata.lookup('EGYPTIAN HIEROGLYPH ' + (m.group(1) + m.group(2).zfill(3) + m.group(3)).upper())
    return c

def parse(mdc):
    s = mdc
    if '<' in s:
        s = s.split('<', 1)[1].split('>', 1)[0]
    s = s.replace('\\', '').strip(' -')
    quads = []
    for q in re.split(r'[-\s]+', s):
        if not q:
            continue
        rows = []
        for r in q.split(':'):
            items = [code_of(t) for t in re.split(r'[*&]', r)]
            items = [i for i in items if i]
            if items:
                rows.append(items)
        if rows:
            quads.append(rows)
    return quads

A = lambda s, l: {'sourceId': s, 'locator': l}
WP = lambda k: A('wikipedia-' + k, 'Infobox royal names, hieroglyph spelling and reign')
OIP = lambda l: A('oip142-fulltext', l)

def N(name, meaning, mdc, look=''):
    d = {'name': name, 'meaning': meaning, 'look': look}
    if mdc:
        d['quads'] = parse(mdc)
        d['mdc'] = mdc
    return d

K = []
def king(id, name, reign, dynasty, inHall, places, role, throne, birth, spot, cites, **kw):
    d = {'id': id, 'name': name, 'reign': reign, 'dynasty': dynasty, 'inHall': inHall, 'places': places, 'role': role,
         'throne': throne, 'birth': birth, 'spot': spot, 'citations': cites}
    d.update(kw)
    K.append(d)

king('senusret-i', 'Senusret I', 'c. 1971–1926 BC', 'Middle Kingdom, 12th Dynasty', False, ['white-chapel'],
     'Built the White Chapel, a small limestone shrine decorated for his jubilee, now rebuilt in the Open Air Museum. It is one of the oldest buildings you can see at Karnak.',
     N('Kheperkare', 'The ka of Re comes into being', 'ra-xpr-kA', 'Sun disk, scarab beetle and the raised arms of the ka.'),
     N('Senusret', 'Man of the goddess Wosret', 'F12-s-D21:t-z:n', 'Starts with the canine head on a staff (user), the sign also used in Usermaatre.'),
     'His cartouches cover the pillars of the White Chapel. Nectanebo I later used the same throne name, Kheperkare.',
     [A('dk-white-chapel', 'White Chapel'), WP('senusret-i')])
king('amenhotep-i', 'Amenhotep I', 'c. 1525–1504 BC', 'New Kingdom, 18th Dynasty', False, ['amenhotep-i-calcite'],
     'Built a calcite (Egyptian alabaster) chapel for Amun’s sacred bark, now reconstructed.',
     N('Djeserkare', 'Holy is the ka of Re', '-N5-D45-D28-', 'Sun disk, an arm holding a wand (djeser, “holy”) and the ka arms.'),
     N('Amenhotep', 'Amun is satisfied', 'i-mn:n-R4:t*p', 'The Amun group with the offering table (hetep).'),
     'On the reconstructed calcite chapel.', [A('dk-amenhotep-i-calcite', 'Calcite chapel'), WP('amenhotep-i')])
king('thutmose-i', 'Thutmose I', 'c. 1506–1493 BC', 'New Kingdom, 18th Dynasty', False, ['fourth-pylon'],
     'Built the Fourth Pylon and an enclosure wall around the early temple of the 18th Dynasty.',
     N('Aakheperkare', 'Great is the form of the ka of Re', 'N5:O29-L1-D28', 'Sun disk over a column (aa, “great”), scarab and ka arms.'),
     N('Thutmose', 'Born of Thoth', 'G26-F31-S29', 'The ibis of Thoth followed by the three fox skins (mes, “born”).'),
     'Around the Fourth Pylon.', [A('dk-fourth-pylon', 'Fourth Pylon'), WP('thutmose-i')])
king('hatshepsut', 'Hatshepsut', 'c. 1479–1458 BC', 'New Kingdom, 18th Dynasty', False, ['hatshepsut-obelisks', 'red-chapel', 'central-bark-shrine'],
     'A woman who ruled as king. She raised granite obelisks for her jubilee and built the Red Chapel, a resting place for Amun’s bark. The chapel was later taken apart; its blocks have been rebuilt in the Open Air Museum.',
     N('Maatkare', 'Maat is the ka of Re', 'ra-mAat-kA', 'Sun disk, seated Maat and the ka arms.'),
     N('Khnemet-Amun Hatshepsut', 'Joined with Amun, foremost of noble women', 'i-mn:n-W9*t:F4-:t-A51', 'The Amun group, a jug, the front of a lion (hat, “foremost”) and a seated noble.'),
     'On her standing obelisk and on the Red Chapel blocks in the Open Air Museum. Her names often end in the feminine t.',
     [A('dk-hatshepsut-obelisks', 'Obelisks'), A('dk-red-chapel', 'Red Chapel'), WP('hatshepsut')])
king('thutmose-iii', 'Thutmose III', 'c. 1479–1425 BC', 'New Kingdom, 18th Dynasty', False, ['akhmenu', 'central-bark-shrine', 'sacred-lake'],
     'Built the Akhmenu festival hall in the east of the temple and reworked the sanctuary. His throne name Menkheperre is one of the most common at Karnak.',
     N('Menkheperre', 'Enduring are the forms of Re', 'ra-mn-xpr', 'Sun disk, game board and scarab: short and easy to spot.'),
     N('Thutmose-neferkheperu', 'Born of Thoth, beautiful of forms', 'G26-ms-nfr-xpr', 'The ibis of Thoth, fox skins, heart-and-windpipe (nefer) and scarab.'),
     'All over the Akhmenu and the central part of the temple.', [A('digital-karnak-akhmenu', 'Akhmenu'), WP('thutmose-iii')])
king('thutmose-iv', 'Thutmose IV', 'c. 1401–1391 BC', 'New Kingdom, 18th Dynasty', False, ['thutmose-iv-peristyle'],
     'Built a painted pillared court for a jubilee setting. It was later dismantled; its pillars have been rebuilt in the Open Air Museum.',
     N('Menkheperure', 'Enduring are the manifestations of Re', 'ra:mn-xpr-Z2', 'Like Thutmose III’s name, plus three plural strokes.'),
     N('Thutmose', 'Born of Thoth', 'G26-ms-s', 'The ibis of Thoth and the fox skins.'),
     'On the painted pillars in the Open Air Museum. Count the strokes to tell him from Thutmose III.', [A('dk-thutmose-iv-peristyle', 'Peristyle'), WP('thutmose-iv')])
king('amenhotep-iii', 'Amenhotep III', 'c. 1391–1353 BC', 'New Kingdom, 18th Dynasty', True, ['third-pylon'],
     'Built the Third Pylon, the eastern end of the Hypostyle Hall, filling its core with blocks from older monuments.',
     N('Nebmaatre', 'The lord of Maat is Re', 'ra-mAat-nb', 'Sun disk, Maat and the basket (neb). Ramesses VI’s name begins with the same three signs.'),
     N('Amenhotep-heqawaset', 'Amun is satisfied, ruler of Thebes', 'i-mn:n-R4-HqA-R19', 'The Amun group, offering table, crook (ruler) and the sceptre of Thebes.'),
     'On the Third Pylon at the east end of the Hall.', [A('dk-third-pylon', 'Third Pylon'), A('hypostyle-project-architecture', 'Third Pylon built by Amenhotep III'), WP('amenhotep-iii')])
king('akhenaten', 'Akhenaten', 'c. 1353–1336 BC', 'New Kingdom, 18th Dynasty', False, ['aten-temples'],
     'Began his reign as Amenhotep IV and built temples to the sun disk, the Aten, east of Karnak. They were pulled down after his death, and thousands of their small blocks (talatat) were reused, including in the foundations of the Hypostyle Hall.',
     N('Neferkheperure-waenre', 'Beautiful are the forms of Re, the unique one of Re', 'ra-nfr-xpr-Z3-ra-wa:n', 'Sun disk, nefer, scarab with plural strokes, a second sun disk.'),
     N('Akhenaten', 'Effective for the Aten', 'i-t:n:ra-G25-x:n', 'The Aten’s name (reed leaf, bread, water, sun disk) and the crested ibis (akh).'),
     'On talatat blocks from his temples; his names were often hacked out.', [A('dk-aten-temples', 'Aten temples'), A('memphis-restoration', 'Talatat in the Hall foundations'), WP('akhenaten')])
king('horemheb', 'Horemheb', 'c. 1319–1292 BC', 'New Kingdom, last king of the 18th Dynasty', True, ['second-pylon'],
     'Built the Second Pylon, the gateway you walk through into the Hall.',
     N('Djeserkheperure-setepenre', 'Holy are the manifestations of Re, chosen of Re', 'ra:Dsr-xpr:Z2-ra-stp:n', 'An arm with a wand (djeser), scarab with plural strokes, adze and water.'),
     N('Horemheb-meryamun', 'Horus is in festival, beloved of Amun', 'M17-Y5:N35-U6-G5-S3-Aa15:W3', 'The Amun group and hoe, the falcon of Horus and the festival bowl.'),
     'On the Second Pylon gateway at the west end of the Hall.', [A('dk-second-pylon', 'Second Pylon'), WP('horemheb')], stops=['entrance'])
king('ramesses-i', 'Ramesses I', 'c. 1292–1290 BC', 'New Kingdom, founder of the 19th Dynasty', True, ['hypostyle-hall'],
     'Father of Sety I. He reigned for about two years. Sety honoured him in scenes on the west wall of the Hall, and his names appear in their texts.',
     N('Menpehtyre', 'Enduring is the strength of Re', 'ra:mn-F9:t*t', 'Sun disk and game board with leopard heads (pehty, “strength”).'),
     N('Ramessu', 'Re is the one who bore him', 'ra-ms-s-sw-w', 'Sun disk, three fox skins, folded cloth: the basic Ramesses spelling.'),
     'In scenes where Sety I honours his late father on the west wall.', [OIP('Translations naming MENPEHTYRE RAMESSU'), A('memphis-interior', 'Sety I honoured Ramesses I'), WP('ramesses-i')])
king('sety-i', 'Sety I', 'c. 1294–1279 BC', 'New Kingdom, 19th Dynasty', True, ['hypostyle-hall', 'third-pylon'],
     'Builder of the Hall. All his carving inside it is in raised relief, mostly in the north half. He died before the decoration was finished.',
     N('Menmaatre', 'Enduring is the Maat of Re', 'ra-mAat-mn', 'Sun disk, seated Maat, game board: short and compact.'),
     N('Sety-merenptah', 'He of Seth, beloved of Ptah', 'p:t-H-C7-i-i-mr-i*i:n', 'Includes a small seated figure of the god Seth.'),
     'His Menmaatre is the easiest royal name in the Hall to recognise. Try it at stop 6, marker 6.',
     [OIP('Plate 48, p. 98; names of Sety I'), A('digital-karnak-hypostyle', 'Dates and decoration'), WP('seti-i')],
     stops=['four-jars'], photo={'mediaId': 'hall-study-fc2a1d41', 'x': 39, 'y': 74, 'w': 13, 'h': 12})
king('ramesses-ii', 'Ramesses II', 'c. 1279–1213 BC', 'New Kingdom, 19th Dynasty', True, ['hypostyle-hall'],
     'Sety’s son. He finished the Hall, converted the south half to sunk relief, and put his names on the central columns and almost everywhere else, sometimes over his father’s.',
     N('Usermaatre-setepenre', 'Strong is the Maat of Re, chosen of Re', 'ra-wsr-mAat-ra*stp:n', 'Sun disk, canine head (user), Maat, then adze and water with a second sun disk.'),
     N('Ramesses-meryamun', 'Re is the one who bore him, beloved of Amun', 'i-mn:n:N36-ra:Z1-ms-s-sw', 'The Amun group, sun disk, fox skins and folded cloth.'),
     'User + Maat + adze = Ramesses II. You will see it on the twelve central columns and on most of the south wall.',
     [A('memphis-interior', 'Early and final cartouches'), A('digital-karnak-hypostyle', 'Central columns'), WP('ramesses-ii')],
     stops=['four-jars'], photo={'mediaId': 'hall-study-97f47532', 'x': 20, 'y': 34, 'w': 58, 'h': 36},
     early='In his first year his names were shorter: Usermaatre alone, and Ramessu-meryamun. He settled on the final forms in his second year and had earlier cartouches in the south half recut.')
king('sety-ii', 'Sety II', 'c. 1203–1197 BC', 'New Kingdom, 19th Dynasty', False, ['sety-ii-shrine'],
     'Built a triple bark shrine for Amun, Mut and Khonsu in what is now the Great Court.',
     N('Userkheperure-setepenre', 'Powerful are the manifestations of Re, chosen of Re', 'ra-wsr-xpr:Z2-ra:stp:n', 'User, scarab with plural strokes, adze.'),
     N('Sety-merenptah', 'He of Seth, beloved of Ptah', 'p:t-V28-U6-C7-i-i-n', 'Like Sety I’s birth name, with the seated Seth figure.'),
     'On his bark shrine in the Great Court.', [A('dk-sety-ii-shrine', 'Sety II shrine'), WP('seti-ii')])
king('ramesses-iii', 'Ramesses III', 'c. 1186–1155 BC', 'New Kingdom, 20th Dynasty', True, ['ramesses-iii-temple', 'khonsu-temple', 'hypostyle-hall'],
     'Built a bark temple in the Great Court and began the Temple of Khonsu. In the Hall he added inscriptions and a small shrine for visitors against the outside of the north wall.',
     N('Usermaatre-meryamun', 'Strong is the Maat of Re, beloved of Amun', 'ra-wsr-mAat-N36-i-mn:n', 'Starts like Ramesses II’s name, but ends with the Amun group and hoe instead of the adze.'),
     N('Ramesses-heqaiunu', 'Re is the one who bore him, ruler of Heliopolis', 'C1-ms-z:z-HqA-q-iwn', 'A seated sun god, fox skins and the crook (ruler).'),
     'If you see Usermaatre without the adze, check whether it is Ramesses III.',
     [A('ucl-ramesses-iii', 'Names'), A('memphis-marginal', 'Shrine on the north wall'), A('dk-ramesses-iii-temple', 'Bark temple'), WP('ramesses-iii')])
king('ramesses-iv', 'Ramesses IV', 'c. 1153–1147 BC', 'New Kingdom, 20th Dynasty', True, ['hypostyle-hall'],
     'Filled most of the 134 columns with friezes of his cartouches and extra scenes. His names appear thousands of times. He also carved huge cartouches and Horus names at the bases of the central columns.',
     N('Heqamaatre-setepenamun', 'Re is the ruler of Maat, chosen of Amun', 'M23:t-L2:t-<-N5-S38-H6-U21:N35-M17-Y5:N35-G7->', 'Sun disk, crook (heqa), feather of Maat, adze and the Amun group. Early in his reign: Usermaatre-setepenamun.'),
     N('Ramesses-heqamaat-meryamun', 'Re is the one who bore him, ruler of Maat, beloved of Amun', 'U6-C12-C2-F31-O34:O34-N5-S38-C10', 'Figures of Amun and Re, fox skins, the crook and Maat.'),
     'Rows of identical small cartouches on the column shafts are usually his. He changed the spelling of his name and recut some of them.',
     [A('memphis-marginal', 'Cartouches on most columns'), A('hypostyle-project-columns', 'Large cartouches at the base of the great columns'), WP('ramesses-iv')])
king('ramesses-vi', 'Ramesses VI', 'c. 1143–1136 BC', 'New Kingdom, 20th Dynasty', True, ['hypostyle-hall'],
     'Took over some of Ramesses IV’s big cartouches at the bases of the central columns by carving his own names over them. Plaster hid the earlier names; where it has fallen, several names overlap.',
     N('Nebmaatre-meryamun', 'The lord of Maat is Re, beloved of Amun', 'M23:t-L2:t-<-N5 C12 C10 N36:V30->', 'Sun disk, a figure of Amun, Maat, hoe and basket.'),
     N('Ramesses-Amunherkhepeshef-netjerheqaiunu', 'Re is the one who bore him, Amun is his strength, god and ruler of Heliopolis', 'N5-C12-F31-O34:O34-R8-S38-O28', 'Sun disk, Amun figure, fox skins, god flag, crook and the column of Heliopolis.'),
     'At the bases of the central columns, a cartouche with a confusing jumble of signs may hold two or three kings’ names at once.',
     [A('hypostyle-project-columns', 'Ramesses VI usurped Ramesses IV’s cartouches'), WP('ramesses-vi')])
king('herihor', 'Herihor', 'c. 1080 BC', 'End of the 20th Dynasty', True, ['hypostyle-hall'],
     'High Priest of Amun at Karnak who took royal titles in the temple. He added bands of text low down on walls and columns, linking himself with Sety I and Ramesses II.',
     N('First Priest of Amun', 'His priestly title, written inside a cartouche', 'R8-U36-D1*p:n-i-mn:n', 'A cartouche that holds a priest’s title: the god flag, a club and a head (“first”), and the Amun group.'),
     N('Siamun-Herihor', 'Son of Amun, Horus is raised up', 'i-m:n-N1:H8*Z1-G5', 'The Amun group, the sky sign and the falcon of Horus.'),
     'Low bands of text at the bottom of the walls; many are worn or lost.',
     [OIP('Bandeau text of Herihor'), A('memphis-marginal', 'Herihor’s marginal inscriptions'), WP('herihor')])
king('shoshenq-i', 'Shoshenq I', 'c. 943–922 BC', 'Third Intermediate Period, 22nd Dynasty', False, ['bubastite-portal', 'great-court'],
     'A king of Libyan descent whose reliefs by the Bubastite Portal, in the Great Court, proclaim victories in Syria-Palestine.',
     N('Hedjkheperre-setepenre', 'Bright are the forms of Re, chosen of Re', 'M23:t-L2:t-<-N5-S1-L1-N5-U19:N35->', 'The white crown (hedj, “bright”), scarab and adze.'),
     N('Shoshenq-meryamun', 'Shoshenq, beloved of Amun', 'G39-N5-<-M17-Y5:N35:N36-M8:M8-N35:N29->', 'The Amun group and hoe, then lotus pools and a hill (the sounds sh-sh-n-q).'),
     'Beside the Bubastite Portal. His name ring is followed by rows of captives holding foreign place names.',
     [A('dk-bubastite-portal', 'Bubastite Portal'), WP('shoshenq-i')])
king('taharqo', 'Taharqo', '690–664 BC', 'Third Intermediate Period, 25th (Kushite) Dynasty', False, ['taharqo-kiosk', 'khonsu-temple', 'sacred-lake'],
     'A king from Kush (in today’s Sudan). He built a huge kiosk with ten columns in the Great Court; one column still stands.',
     N('Nefertemkhure', 'Nefertem is his protector', 'ra-nfr-U15-x-w', 'Sun disk, heart-and-windpipe (nefer) and a sledge (tem).'),
     N('Taharqo', 'Taharqo (his Kushite name)', 'N17:h-rw:q', 'Land sign, twisted wick (h), lion (rw) and hill (q): a foreign name spelled by sound.'),
     'In the Great Court around his standing column.', [A('dk-taharqo-kiosk', 'Kiosk'), WP('taharqa')])
king('hakoris', 'Hakoris', 'c. 392–379 BC', 'Late Period, 29th Dynasty', False, ['hakoris-chapel'],
     'Built a small bark station near the temple entrance, where Amun’s bark could rest.',
     N('Khnemmaatre', 'Who embraces the Maat of Re', 'M23:t-L2:t-<-ra-Xnm-C10->', 'Sun disk, a jug (khnem, “unite”) and Maat.'),
     N('Hakor', 'Hakor', 'G39-N5-<-h-k:r->', 'Spelled by sound: twisted wick (h), basket (k), mouth (r).'),
     'On his bark station at the entrance to the temple.', [A('dk-hakoris-chapel', 'Chapel of Hakoris'), WP('hakoris')])
king('nectanebo-i', 'Nectanebo I', 'c. 379–361 BC', 'Late Period, 30th Dynasty', False, ['first-pylon', 'great-court'],
     'One of the last native kings of Egypt. The unfinished First Pylon and the great mudbrick enclosure walls are linked with his building work.',
     N('Kheperkare', 'The ka of Re comes into being', 'N5-L1-D28', 'Sun disk, scarab and ka arms: the same throne name as Senusret I, 1,600 years earlier.'),
     N('Nakhtnebef', 'Strong one of his lord', 'n:M3-Aa1*t:D40-V30:f', 'A tree and sieve sign (nakht), an arm with a stick, and the basket (neb).'),
     'Around the entrance and the enclosure.', [A('digital-karnak-first-pylon', 'First Pylon'), A('dk-great-court', 'Great Court'), WP('nectanebo-i')])
king('philip-iii', 'Philip III Arrhidaeus', '323–317 BC', 'Macedonian Dynasty', False, ['central-bark-shrine'],
     'Half-brother of Alexander the Great. Egyptian craftsmen rebuilt the granite bark shrine at the heart of the temple in his name.',
     N('Setepenre-meryamun', 'Chosen of Re, beloved of Amun', None, 'A Greek king given an Egyptian throne name.'),
     N('Philip', 'Philippos, written in hieroglyphs', 'p:E23-p:Z7-i-i-Aa18', 'Stool (p), recumbent lion for l, stool again (p), reed leaves (i) and s: a Greek name spelled by sound.'),
     'In the granite bark shrine at the centre of the temple. Look for the lion used for the sound l, a late invention for Greek names.',
     [A('dk-central-bark-shrine', 'Bark shrine'), WP('philip-iii')])
king('ptolemy-viii', 'Ptolemy VIII', 'c. 170–116 BC (with interruptions)', 'Ptolemaic Dynasty', False, ['opet-temple'],
     'Decorated the Temple of Opet, with its raised sanctuary and crypts linked to Osiris.',
     N('Iwaennetjerwyperwy-setepenptah-irymaatre-sekhemankhenamun', 'Heir of the two gods who appear, chosen of Ptah, who does the Maat of Re, living image of Amun', 'nTr\\-N8-nTr-F44:n-p:t-H-stp:n-ir:Aa11-C2\\-C12-sxm-anx', 'A very long Ptolemaic throne name: look for Ptah’s name (stool, bread, twisted wick) and the adze.'),
     N('Ptolemy-ankhdjet-meryptah', 'Ptolemy, living forever, beloved of Ptah', 'p:t-wA-l:M-i-i-s-anx-D*t:N17-p:t*H:N36', 'Stool (p), bread (t), lasso (wa), lion (l), owl (m): Ptolemaios spelled by sound.'),
     'In the Temple of Opet. Late names like this are long and full of extra signs.', [A('dk-opet-temple', 'Temple of Opet'), WP('ptolemy-viii')])

for k in K:
    k['inHallNote'] = 'Names in the Hypostyle Hall' if k['inHall'] else 'Elsewhere at Karnak'
out = {'id': 'royal-names', 'language': 'en', 'updated': '2026-11-14', 'status': 'needs_source_check',
       'intro': 'Every king had five names. Two of them are written in cartouches: the throne name, taken at the coronation, and the birth name. The throne name follows “King of Upper and Lower Egypt” (sedge and bee); the birth name follows “Son of Re” (duck and sun disk). Inside, a god’s name is written first out of respect. The printed cartouches below follow standard spellings; on the walls the same names are often arranged differently.',
       'kings': K}
json.dump(out, open(REPO + '/content/reading/names.json', 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=2)
print(len(K), 'kings')
for k in K:
    print(k['id'], [len(k[p].get('quads', [])) for p in ('throne', 'birth')])
