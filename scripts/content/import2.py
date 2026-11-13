"""Import selected Commons photos into the repo and attach them to reading content.
Usage: python import2.py <images_dir> <repo>"""
import json, sys, shutil, hashlib, os
IMG, REPO = sys.argv[1], sys.argv[2]
idx = {s['idx']: s for s in json.load(open(IMG + '/kc-index.json', encoding='utf-8'))}
LIC = {'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/', 'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
       'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/', 'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
       'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/', 'CC0': 'https://creativecommons.org/publicdomain/zero/1.0/',
       'Public domain': 'https://creativecommons.org/publicdomain/mark/1.0/'}
PICK = {
 4: ('karnak-hatshepsut-obelisk-cartouche', ['hatshepsut-obelisks'], 'Hatshepsut’s birth name on her obelisk, with “son of Re” (sun disk and duck) above it.', 'Granite obelisk surface carved with a sun disk and a duck above a tall cartouche of Hatshepsut.', 'Commons description: cartouche of Queen Hatshepsut on the obelisk at Karnak.'),
 114: ('karnak-lintel-mirrored-titles', [], 'A painted lintel: royal titles and names written in mirror image either side of a central ankh.', 'Painted lintel underside with bees, sedge plants, ankhs, ducks, sun disks and four cartouches arranged symmetrically.', 'Commons description: underside of a lintel at Karnak. King not identified here.'),
 102: ('karnak-lintel-ramesses-ii-titles', [], 'A painted frieze with Ramesses II’s throne name between “King of Upper and Lower Egypt” and “given life”.', 'Two painted rows, each with an ankh, sedge plant, bee, cartouche, cone of bread and ankh.', 'Commons description: cartouches of Ramses II, Karnak.'),
 23: ('white-chapel-senusret-relief', ['white-chapel'], 'Relief on the White Chapel of Senusret I: an ankh held up to a face.', 'Limestone relief of two standing figures, one in the White Crown and one with tall plumes, with an ankh between their faces and hieroglyphs around them.', 'Commons description: relief showing Kheperkare Senusret I, Karnak.'),
 20: ('white-chapel-heh', ['white-chapel'], 'The god Heh, “millions”, kneeling with raised arms on the White Chapel.', 'Relief of a kneeling god with a long wig and both arms raised.', 'Commons description: the deity Heh, symbol of eternity, White Chapel, Karnak.'),
 42: ('sety-ii-obelisk-base', [], 'Cartouches of Sety II on an obelisk base at Karnak.', 'Weathered stone base carved with a row of cartouches.', 'Commons description: obelisk base of Sety II.'),
 88: ('heraldic-pillar-thutmose-iii', [], 'Thutmose III on the south heraldic pillar in the Hall of Annals, with his cartouche below.', 'Tall granite pillar carved with a king and a goddess and columns of hieroglyphs with a cartouche.', 'Commons description: Thutmose III with his wife on the south heraldic pillar in the Hall of Annals.'),
 147: ('karnak-column-rekhyt-cartouches', [], 'Ramesses II’s two cartouches with a rekhyt bird, a star and a basket: “all the people adore”.', 'Column relief with two cartouches, a lapwing with human arms raised, a star and baskets.', 'Commons categories: Cartouches of Ramses II; Rekhyt bird; Reliefs in Karnak temple complex.'),
 127: ('karnak-bee-hieroglyph', [], 'A carved bee, the sign for the King of Lower Egypt.', 'Black-and-white close-up of a carved bee hieroglyph and other signs.', 'Commons description: bee hieroglyph, Karnak (scanned slide, 1985).'),
 100: ('hall-ceiling-ramesses-ii-nomen', ['hypostyle-hall'], 'Ramesses II’s birth name painted on a ceiling block of the Hall.', 'Brightly painted cartouche with a reed leaf, game board, water, sun disk, fox skins and folded cloths.', 'Commons description: Great Hypostyle Hall, ceiling. Matched to the standard spelling of Ramesses-meryamun.'),
 60: ('karnak-shoshenq-relief', ['bubastite-portal'], 'Relief in the name of Shoshenq I and his son, the High Priest of Amun Iuput.', 'Weathered wall relief with figures and columns of hieroglyphs, with small cartouches near the top.', 'Commons description: relief in the name of Shoshenq I and his son Iuput, temple of Amun-Re, Karnak.'),
}
MP = REPO + '/content/media.json'
md = json.load(open(MP, encoding='utf-8'))
md['media'] = [m for m in md['media'] if m['id'] != 'karnak-roof-sety-cartouches']
for f in ('assets/photos/karnak-roof-sety-cartouches.jpg', 'research/media-provenance/karnak-roof-sety-cartouches.json'):
    if os.path.exists(REPO + '/' + f): os.remove(REPO + '/' + f)
have = {m['id'] for m in md['media']}
for i, (mid, places, cap, alt, ident) in PICK.items():
    s = idx[i]
    src = IMG + '/' + s['file']
    ext = os.path.splitext(s['file'])[1]
    dst = 'assets/photos/' + mid + ext
    shutil.copyfile(src, REPO + '/' + dst)
    b = open(REPO + '/' + dst, 'rb').read()
    sha = hashlib.sha256(b).hexdigest()
    creator = s['artist'].split('\n')[0].strip() or 'Unknown'
    lic = s['license']
    rec = {'id': mid, 'path': dst, 'title': s['title'].replace('File:', ''), 'creator': creator, 'sourcePage': s['desc'],
           'originalUrl': s['url'], 'downloadUrl': s['dl'], 'license': lic, 'licenseUrl': LIC.get(lic, s['desc']),
           'attribution': f'{creator}, {lic}, via Wikimedia Commons.', 'attributionPlacement': 'Beside image and in downloadable credits; link source and licence.',
           'changes': 'Wikimedia-generated rendition (1280px or original); no editorial crop, annotation or colour change.' if lic != 'Public domain' else 'Wikimedia rendition; no changes.',
           'retrieved': '2026-11-14', 'sha256': sha, 'bytes': len(b), 'placeIds': places, 'subjectGroup': 'read-the-walls',
           'caption': cap, 'alt': alt, 'identificationStatus': ident, 'distributionStatus': 'Commercial reuse permitted subject to the recorded licence conditions.'}
    if mid in have:
        md['media'] = [rec if m['id'] == mid else m for m in md['media']]
    else:
        md['media'].append(rec)
    json.dump({'sourcePage': s['desc'], 'originalUrl': s['url'], 'downloadUrl': s['dl'], 'creator': creator, 'license': lic, 'date': s['date'],
               'description': s['description'], 'retrieved': '2026-11-14', 'sha256': sha, 'retrievalMethod': 'curl on owner’s computer via watch.cmd'},
              open(REPO + '/research/media-provenance/' + mid + '.json', 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=2)
json.dump(md, open(MP, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=2)
print('media', len(md['media']))

# ---- signs: photo examples ----
SP = REPO + '/content/reading/signs.json'
sg = json.load(open(SP, encoding='utf-8'))
ph = lambda m, x, y, w, h: {'mediaId': m, 'x': x, 'y': y, 'w': w, 'h': h}
for s in sg['signs']:
    if s['id'] == 'bity': s['photo'] = ph('karnak-bee-hieroglyph', 28, 20, 32, 30)
    if s['id'] == 'heh': s['photo'] = ph('white-chapel-heh', 8, 3, 84, 94)
    if s['id'] == 'rekhyt':
        s['photo'] = ph('karnak-column-rekhyt-cartouches', 44, 15, 38, 40)
        s['where'] = 'At the bases of many of the 122 smaller columns, and on other columns at Karnak, as in the photo.'
    if s['id'] == 'star': s['photo'] = ph('karnak-column-rekhyt-cartouches', 44, 40, 11, 12)
    if s['id'] == 'neb': s['photo'] = ph('karnak-column-rekhyt-cartouches', 47, 55, 30, 16)
    if s['id'] == 'sa': s['photo'] = ph('karnak-hatshepsut-obelisk-cartouche', 26, 0, 46, 30)
    if s['id'] == 'nswt': s['photo'] = ph('karnak-lintel-ramesses-ii-titles', 11, 10, 10, 30)
    if s['id'] == 'give': s['photo'] = ph('karnak-lintel-ramesses-ii-titles', 76, 14, 12, 32)
    if s['id'] == 'mes': s['photo'] = ph('hall-ceiling-ramesses-ii-nomen', 46, 25, 10, 45)
    if s['id'] == 'mansion': pass
for s in sg['signs']:
    if s['id'] == 'star':
        s['why'] = 'A five-pointed star. Temple ceilings were painted with stars. The star also writes dua, “to adore, praise”: next to the rekhyt birds it means “adore”.'
json.dump(sg, open(SP, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=2)

# ---- names: photos per king ----
NP = REPO + '/content/reading/names.json'
nm = json.load(open(NP, encoding='utf-8'))
P = {
 'hatshepsut': [ph('karnak-hatshepsut-obelisk-cartouche', 27, 31, 46, 68) | {'label': 'Birth name on her obelisk'}],
 'sety-i': [ph('hall-study-fc2a1d41', 39, 74, 13, 12) | {'label': 'Throne name, Menmaatre, at stop 6'}, ph('hypostyle-reliefs-5c1c875e', 29, 34, 32, 18) | {'label': 'Birth name, painted on a roof fragment, with the seated Seth figure'}],
 'ramesses-ii': [ph('hall-study-97f47532', 20, 34, 58, 36) | {'label': 'Throne name on a column'}, ph('hall-ceiling-ramesses-ii-nomen', 2, 20, 75, 60) | {'label': 'Birth name painted on the Hall ceiling'}, ph('karnak-column-rekhyt-cartouches', 17, 18, 27, 42) | {'label': 'Both names side by side'}],
 'thutmose-iii': [ph('heraldic-pillar-thutmose-iii', 36, 84, 18, 16) | {'label': 'Cartouche on the heraldic pillar'}],
 'senusret-i': [ph('white-chapel-senusret-relief', 38, 0, 24, 15) | {'label': 'Part of a cartouche on the White Chapel'}],
 'sety-ii': [ph('sety-ii-obelisk-base', 20, 44, 66, 26) | {'label': 'Cartouches on an obelisk base'}],
 'shoshenq-i': [ph('karnak-shoshenq-relief', 40, 29, 30, 13) | {'label': 'Small cartouches at the top of the relief'}],
}
for k in nm['kings']:
    if k['id'] in P:
        k['photos'] = P[k['id']]
    k.pop('photo', None)
json.dump(nm, open(NP, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=2)

# ---- practice: more exercises ----
PP = REPO + '/content/reading/practice.json'
pr = json.load(open(PP, encoding='utf-8'))
A = lambda s, l: {'sourceId': s, 'locator': l}
st = lambda x, y, l, t: {'x': x, 'y': y, 'label': l, 'text': t}
new = [
 {'id': 'royal-frieze', 'title': 'Read a royal frieze', 'mediaId': 'karnak-lintel-ramesses-ii-titles',
  'steps': [st(7, 30, '1', 'Ankh: “life”. At the start of a royal name it means “may he live”.'),
            st(16, 28, '2', 'Sedge plant: nesu, King of Upper Egypt.'),
            st(27, 28, '3', 'Bee: bity, King of Lower Egypt. Sedge and bee: the title before the throne name.'),
            st(43, 32, '4', 'Sun disk: Re, written first inside the cartouche.'),
            st(55, 30, '5', 'User and Maat: “strong is the Maat (of Re)”.'),
            st(66, 30, '6', 'Adze, water and sun disk: setep-en-Re, “chosen of Re”.'),
            st(82, 34, '7', 'Cone of bread: di, “given”.'),
            st(93, 34, '8', 'Ankh: “life”. Cone and ankh together: “given life”.')],
  'answer': '“(Long) live the King of Upper and Lower Egypt, Usermaatre-setepenre, given life.” The throne name of Ramesses II, framed by two common formulas.',
  'citations': [A('wikipedia-ramesses-ii', 'Throne name'), A('oip142-fulltext', '“given life” after royal names')]},
 {'id': 'mirror-lintel', 'title': 'One text, written twice in mirror image', 'mediaId': 'karnak-lintel-mirrored-titles',
  'steps': [st(55, 35, '1', 'The ankh in the middle of the top row. The texts on each side start from here and face away from it.'),
            st(43, 35, '2', 'Bee and sedge on the left side: “King of Upper and Lower Egypt”, facing left.'),
            st(68, 35, '3', 'The same title on the right side, facing right. Each half reads outwards, towards its own cartouche.'),
            st(48, 70, '4', 'Bottom row: a duck and sun disk, “son of Re”, on each side of a second ankh.'),
            st(20, 70, '5', 'The birth-name cartouche follows “son of Re”.'),
            st(20, 37, '6', 'The throne-name cartouche follows “King of Upper and Lower Egypt”.')],
  'answer': 'The same royal titles and names, written twice so that they face out from the centre of the doorway. Egyptian could be written in either direction; here the symmetry suits the architecture.',
  'citations': [A('ucl-art-script', 'Direction of writing')]},
 {'id': 'ramesses-birth-name', 'title': 'Spell out Ramesses II’s birth name', 'mediaId': 'hall-ceiling-ramesses-ii-nomen',
  'steps': [st(14, 45, '1', 'Reed leaf: the sound i.'),
            st(25, 30, '2', 'Game board: mn. Reed leaf + game board + water = Imen, Amun.'),
            st(25, 47, '3', 'Water: n.'),
            st(25, 64, '4', 'Canal: mer, “beloved”. Amun is written first out of respect: “beloved of Amun”.'),
            st(40, 30, '5', 'Sun disk: Ra.'),
            st(52, 47, '6', 'Three fox skins: mes, “born”.'),
            st(62, 47, '7', 'Folded cloths and the last sign: s, su.')],
  'answer': 'Meryamun Ra-mes-su: Ramesses-meryamun, “Re is the one who bore him, beloved of Amun”, the birth name of Ramesses II, painted on the ceiling of the Hall.',
  'citations': [A('wikipedia-ramesses-ii', 'Birth name and spelling')]},
 {'id': 'all-the-people', 'title': 'All the people adore the king', 'mediaId': 'karnak-column-rekhyt-cartouches',
  'steps': [st(23, 40, '1', 'Throne name of Ramesses II: sun disk at the top.'),
            st(37, 42, '2', 'Birth name of Ramesses II: look for the fox skins.'),
            st(63, 32, '3', 'A lapwing (rekhyt) with human arms raised: the common people.'),
            st(49, 45, '4', 'Star: dua, “adore”.'),
            st(60, 66, '5', 'Basket: neb, “all”.')],
  'answer': '“All the people adore” the king’s names. Columns in the Hall carry this design at their bases, telling ordinary visitors they were welcome to worship here.',
  'citations': [A('memphis-small-columns', 'Rekhyt birds on neb signs worshipping the cartouches of Ramesses II'), A('wiki-gardiner', 'G23, N14, V30')]},
 {'id': 'obelisk-name', 'title': 'Whose name is on this obelisk?', 'mediaId': 'karnak-hatshepsut-obelisk-cartouche',
  'steps': [st(37, 7, '1', 'Sun disk.'),
            st(55, 18, '2', 'Duck: sa, “son”. Sun and duck: “son of Re”, so the birth name follows.'),
            st(48, 45, '3', 'Reed leaf, game board and water: Amun.'),
            st(38, 62, '4', 'The front of a lion: hat, “foremost”.'),
            st(46, 80, '5', 'A seated noble lady: the name is about a woman.'),
            st(63, 87, '6', 'Small loaf (t): the feminine ending.')],
  'answer': 'Khnemet-Amun Hatshepsut, “joined with Amun, foremost of noble women”: the birth name of Hatshepsut, a woman who ruled as king. The feminine signs give her away.',
  'citations': [A('wikipedia-hatshepsut', 'Birth name and spelling'), A('dk-hatshepsut-obelisks', 'Obelisks')]},
 {'id': 'breath-of-life', 'title': 'Find the gift of life', 'mediaId': 'white-chapel-senusret-relief',
  'steps': [st(50, 41, '1', 'An ankh held up to a face: giving the breath of life.'),
            st(37, 22, '2', 'Ankh in the text above.'),
            st(45, 25, '3', 'Cone of bread: di. With the ankh: “given life”.'),
            st(20, 25, '4', 'The White Crown of Upper Egypt.'),
            st(62, 20, '5', 'Two tall plumes: the crown of Amun.'),
            st(95, 36, '6', 'Owl: the sound m.')],
  'answer': 'A scene on the White Chapel of Senusret I, one of the oldest buildings you can see at Karnak. The ankh at the face and the words “given life” say the same thing twice: in picture and in writing.',
  'citations': [A('dk-white-chapel', 'White Chapel'), A('wiki-gardiner', 'S34, X8, S1, G17')]},
]
have = {p['id'] for p in pr['items']}
for n in new:
    if n['id'] not in have: pr['items'].append(n)
json.dump(pr, open(PP, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=2)
print('practice', len(pr['items']))
