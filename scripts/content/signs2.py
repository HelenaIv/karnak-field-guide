"""Add signs to content/reading/signs.json (idempotent) and write content/reading/alphabet.json.
Usage: python signs2.py <repo>"""
import json, sys
REPO = sys.argv[1]
A = lambda s, l: {'sourceId': s, 'locator': l}
GL = A('wiki-gardiner', 'Sign list entry')
p = REPO + '/content/reading/signs.json'
d = json.load(open(p, encoding='utf-8'))
groups = {g['id'] for g in d['groups']}
for g in [
    {'id': 'spirit', 'title': 'Soul, spirit and life force', 'intro': 'Egyptians saw a person as several parts. These signs name them, and you meet them in royal names and gods’ blessings.'},
    {'id': 'crowns', 'title': 'Crowns and regalia', 'intro': 'What the king and gods wear and hold tells you who they are and what they claim.'},
    {'id': 'world', 'title': 'Sky, land, temple', 'intro': 'Signs for the world around the king: the sky above, the horizon, cities, foreign lands and the temple itself.'},
    {'id': 'body', 'title': 'Body and action', 'intro': 'Parts of the body are used both as words and for their sounds. They also show what someone is doing.'},
]:
    if g['id'] not in groups:
        # insert after 'gods'
        i = [x['id'] for x in d['groups']].index('gods') + 1 if g['id'] == 'spirit' else len(d['groups'])
        d['groups'].insert(i, g); groups.add(g['id'])

def S(id, code, name, group, reading, meaning, why, where, cites=None, photo=None, stops=None):
    x = {'id': id, 'code': code, 'name': name, 'group': group, 'reading': reading, 'meaning': meaning, 'why': why, 'where': where, 'citations': cites or [GL]}
    if photo: x['photo'] = photo
    if stops: x['stops'] = stops
    return x

new = [
 S('ka', 'D28', 'Raised arms (ka)', 'spirit', 'ka', 'the ka: life force, a person’s double',
   'Two arms raised from the elbows. The ka is the life force that is passed from the gods to the king and from father to son. Offerings were made “for the ka” of the gods and the dead. It appears in many royal names, such as Hatshepsut’s Maatkare and Senusret I’s Kheperkare.',
   'In throne names (Maatkare, Kheperkare, Djeserkare) and in phrases about offerings.'),
 S('ba', 'G53', 'Human-headed bird (ba)', 'spirit', 'ba', 'the ba: a person’s mobile spirit',
   'A bird with a human head. The ba was the part of a person that could move freely after death, in and out of the tomb.',
   'Mostly in funerary texts; less common on temple walls.'),
 S('akh', 'G25', 'Crested ibis (akh)', 'spirit', 'akh', 'akh: transfigured spirit; effective, glorious',
   'A crested ibis. Akh is the blessed, effective spirit of the dead, and as an adjective means “useful, effective”. Akhenaten’s name means “effective for the Aten”. The Akhmenu, Thutmose III’s festival hall, is named with it too.',
   'In the name Akhenaten and in the name of the Akhmenu.'),
 S('ib', 'F34', 'Heart', 'spirit', 'ib', 'heart; mind, will',
   'A heart shaped like a jar. Egyptians thought with the heart. Gods say their heart is glad because of the king.',
   'In gods’ speeches (“my heart is glad for love of you”).'),
 S('white-crown', 'S1', 'White Crown', 'crowns', 'hedjet', 'the White Crown of Upper (southern) Egypt; “bright, white”',
   'A tall crown shaped like a bowling pin. It stands for the south. As a sign it also writes hedj, “bright”, as in Shoshenq I’s throne name.',
   'On kings and on the god Osiris, often combined with the Red Crown.'),
 S('red-crown', 'S3', 'Red Crown', 'crowns', 'deshret; also n', 'the Red Crown of Lower (northern) Egypt',
   'A flat-topped crown with a tall back and a curl. It stands for the north. As a sign it is also used for the sound n.',
   'On kings and on the goddess Neith; combined with the White Crown as the Double Crown.'),
 S('double-crown', 'S5', 'Double Crown', 'crowns', 'sekhemty', 'the Double Crown: “the two powerful ones”',
   'The White Crown set inside the Red Crown: the king rules both halves of Egypt. The goddess Mut also wears it.',
   'On kings in many scenes and on Mut, Amun’s wife.'),
 S('blue-crown', 'S7', 'Blue Crown (khepresh)', 'crowns', 'khepresh', 'the Blue Crown',
   'A rounded helmet-like crown, often covered with small discs. New Kingdom kings wear it in war scenes and many rituals.',
   'On Ramesses II in many scenes in the Hall.'),
 S('flail', 'S45', 'Flail', 'crowns', 'nekhakha', 'flail: a royal emblem',
   'Carried with the crook by kings and by Osiris. Crook and flail together mean royal rule.',
   'In the hands of kings and of Osiris.'),
 S('sema-tawy', 'F36', 'Lungs and windpipe (sema)', 'crowns', 'sema', 'to unite; with plants: “the union of the Two Lands”',
   'Lungs and windpipe write the word “unite”. Gods tie the papyrus of the north and the lily or sedge of the south around it: Egypt united under one king.',
   'On the sides of royal thrones and on statue bases.'),
 S('sistrum', 'Y8', 'Sistrum', 'crowns', 'sesheshet', 'sistrum: a sacred rattle',
   'A rattle shaken in rituals to please the gods, especially Hathor. Queens and priestesses hold it.',
   'In offering scenes, held by queens and goddesses.'),
 S('amun-figure', 'C12', 'God with two tall plumes', 'gods', 'imn', 'Amun',
   'A seated god wearing a flat crown with two very tall plumes: Amun. In some royal names the figure replaces the spelled-out Amun group.',
   'In Ramesses IV’s and VI’s names, and as the god himself in almost every scene.'),
 S('thoth', 'G26', 'Ibis on a standard', 'gods', 'djehuty', 'Thoth, god of writing',
   'The sacred ibis of Thoth, god of writing and counting. It begins the name Thutmose, “born of Thoth”.',
   'In the names of Thutmose I, III and IV; Thoth writes the king’s years in the scene next to stop 6.'),
 S('seth', 'E20', 'Seth animal', 'gods', 'sth', 'Seth',
   'A strange animal with a curved snout, square-topped ears and a forked tail. It stands for Seth, god of storms and the desert. Sety I’s name means “he of Seth”.',
   'In the names of Sety I and Sety II, and as Seth purifying the king.'),
 S('anubis', 'E15', 'Lying jackal', 'gods', 'inpw', 'Anubis, guardian of the dead',
   'A jackal lying on a shrine or on its belly. Anubis protects the dead and guides them.',
   'In funerary texts and offering formulas.'),
 S('papyrus', 'M13', 'Papyrus stem', 'world', 'wadj', 'green, fresh; the north',
   'A papyrus stem. It writes “green, flourishing” and stands for the papyrus marshes of the north. The Hall’s columns are carved as papyrus.',
   'In texts and as the shape of every column in the Hall.'),
 S('sky', 'N1', 'Sky', 'world', 'pet', 'sky, heaven',
   'A flat slab with turned-down ends: the sky resting on its supports. A sky sign often runs along the top of a scene like a roof.',
   'Along the top of scenes and in “lord of heaven”.'),
 S('star', 'N14', 'Star', 'world', 'seba', 'star',
   'A five-pointed star. Temple ceilings were painted with stars, and the sign also writes words such as “door” and “teach” by sound.',
   'On ceilings and in texts.'),
 S('horizon', 'N27', 'Sun between two hills', 'world', 'akhet', 'horizon',
   'The sun rising between two mountains. Temples were thought of as the horizon where the god appears.',
   'In names of temples and gods, such as Horakhty, “Horus of the horizon”.'),
 S('hill-country', 'N25', 'Three hills', 'world', 'khaset', 'foreign land, desert',
   'Three hills: the deserts and foreign countries, as opposed to the flat Nile valley. On battle walls it marks the enemy’s land.',
   'On the outer battle walls and in place names of foreign lands.'),
 S('city', 'O49', 'Crossroads in a circle', 'world', 'niwt', 'city, town',
   'A round town with crossing streets. It ends the names of towns and cities, including Thebes.',
   'After place names in texts.'),
 S('house', 'O1', 'House plan', 'world', 'per', 'house; the sound p-r',
   'A simple house plan. Per-aa, “great house”, is the origin of the word pharaoh.',
   'In words for buildings and in temple names.'),
 S('mansion', 'O6', 'Enclosure (hut)', 'world', 'hut', 'mansion, temple enclosure',
   'A rectangular enclosure. Hut writes “mansion” or temple; the Hall was called a temple in its own right.',
   'In temple names and dedication texts.'),
 S('arm', 'D36', 'Forearm', 'body', 'a (ꜥ)', 'arm; the sound ꜥ (a deep a)',
   'A forearm with the hand open, used for a sound that does not exist in English, written ꜥ.',
   'In many words, including ankh when spelled out.'),
 S('hand', 'D46', 'Hand', 'body', 'd', 'hand; the sound d',
   'A hand, used for the sound d. It is the second sign in djed medu, “words spoken”.',
   'At the start of speeches.'),
 S('eye', 'D4', 'Eye', 'body', 'ir', 'eye; to do, to make',
   'A human eye. As a word it means “eye”; for its sound ir it writes “to do, to make”: “he made it as his monument”.',
   'In the name of Osiris and in dedication texts.'),
 S('praise', 'A30', 'Man with raised hands', 'body', 'dua', 'to praise, to worship',
   'A man raising both hands in front of him: worship.',
   'In scenes of praise and at the end of the word dua, “adore”.'),
 S('censer', 'R7', 'Incense bowl with smoke', 'gifts', 'senetjer', 'incense',
   'A bowl with smoke rising: incense. Burning incense is one of the most common offerings in the Hall.',
   'In offering scenes and labels like “offering incense”.'),
 S('lotus', 'M9', 'Lotus flower', 'gifts', 'seshen', 'lotus (water lily)',
   'The blue water lily, which opens at sunrise. Kings and gods are offered bouquets of lotus and papyrus.',
   'In offering scenes with flowers.'),
]
have = {s['id'] for s in d['signs']}
for s in new:
    if s['id'] not in have:
        d['signs'].append(s)
# photo examples from new Karnak photos
for s in d['signs']:
    if s['id'] == 'heh':
        s['photo'] = {'mediaId': 'white-chapel-heh', 'x': 10, 'y': 5, 'w': 80, 'h': 90}
        s['where'] = 'On the year staves in the scene next to stop 6 (B93), and large on the White Chapel of Senusret I.'
    if s['id'] == 'bity':
        s['photo'] = {'mediaId': 'hall-bee-hieroglyph', 'x': 30, 'y': 5, 'w': 45, 'h': 70}
json.dump(d, open(p, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=2)
print('signs', len(d['signs']))

# ---------------- Alphabet ----------------
L = lambda code, translit, sound, say, obj, note='': {'code': code, 'translit': translit, 'sound': sound, 'say': say, 'object': obj, 'note': note}
letters = [
 L('G1', 'ꜣ', 'a glottal stop, like the break in “uh-oh”', 'a', 'Egyptian vulture'),
 L('M17', 'i', 'i or y', 'i', 'flowering reed'),
 L('M17-M17', 'y', 'y', 'y', 'two reeds', 'Also written with two strokes.'),
 L('D36', 'ꜥ', 'a deep “a” from the throat', 'a', 'forearm'),
 L('G43', 'w', 'w or u', 'w / u', 'quail chick', 'Often replaced by a small coil (Z7).'),
 L('D58', 'b', 'b', 'b', 'foot'),
 L('Q3', 'p', 'p', 'p', 'stool'),
 L('I9', 'f', 'f', 'f', 'horned viper'),
 L('G17', 'm', 'm', 'm', 'owl'),
 L('N35', 'n', 'n', 'n', 'ripple of water'),
 L('D21', 'r', 'r', 'r', 'mouth'),
 L('O4', 'h', 'h', 'h', 'reed shelter'),
 L('V28', 'ḥ', 'an emphatic h', 'h', 'twisted wick of flax'),
 L('Aa1', 'ḫ', 'kh, as in Scottish “loch”', 'kh', 'sieve or placenta'),
 L('F32', 'ẖ', 'a softer kh, as in German “ich”', 'kh', 'animal belly with udder'),
 L('O34', 's (z)', 's (originally z)', 's / z', 'door bolt'),
 L('S29', 's', 's', 's', 'folded cloth'),
 L('N37', 'š', 'sh', 'sh', 'pool'),
 L('N29', 'q (ḳ)', 'a k made further back, like q', 'q', 'sandy hill slope'),
 L('V31', 'k', 'k', 'k', 'basket with handle'),
 L('W11', 'g', 'g, as in “go”', 'g', 'jar stand'),
 L('X1', 't', 't', 't', 'loaf of bread'),
 L('V13', 'ṯ', 'tj, close to “ch” in “church”', 'tj / ch', 'tethering rope'),
 L('D46', 'd', 'd', 'd', 'hand'),
 L('I10', 'ḏ', 'dj, close to “j” in “jam”', 'dj / j', 'cobra'),
]
extra = [
 {'code': 'E23', 'translit': 'rw / l', 'sound': 'used for l in Greek names', 'say': 'l', 'object': 'recumbent lion', 'note': 'Egyptian had no separate l. Scribes used the lion for l in names like Philippos and Ptolemaios, which you can see at Karnak.'},
]
alpha = {'id': 'alphabet', 'language': 'en', 'updated': '2026-11-14', 'status': 'needs_source_check',
  'intro': 'Hieroglyphs are not an alphabet, but about 25 signs stand for a single consonant each. Scribes used them to spell sounds, to help read longer signs, and to write foreign names. Vowels were not written: Egyptologists add an “e” between consonants so the words can be spoken.',
  'letters': letters, 'extra': extra,
  'nameTool': {'note': 'This is a modern game, not ancient practice: Egyptians did not write vowels, and English sounds do not all have Egyptian equivalents. Scribes used similar tricks to write foreign names in hieroglyphs.',
    'map': {'a': 'G1', 'b': 'D58', 'c': 'V31', 'd': 'D46', 'e': 'M17', 'f': 'I9', 'g': 'W11', 'h': 'O4', 'i': 'M17', 'j': 'I10', 'k': 'V31', 'l': 'E23', 'm': 'G17', 'n': 'N35', 'o': 'G43', 'p': 'Q3', 'q': 'N29', 'r': 'D21', 's': 'S29', 't': 'X1', 'u': 'G43', 'v': 'I9', 'w': 'G43', 'x': 'V31-S29', 'y': 'M17-M17', 'z': 'O34', 'ch': 'V13', 'sh': 'N37', 'kh': 'Aa1', 'th': 'V13'}},
  'citations': [A('wiki-gardiner', 'Uniliteral signs and their sound values'), A('wikipedia-philip-iii', 'Philippos written with the lion for l')]}
json.dump(alpha, open(REPO + '/content/reading/alphabet.json', 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=2)
print('alphabet', len(letters))
