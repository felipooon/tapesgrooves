/**
 * TAPES & GROOVES
 * Interactive 3D Record Store Experience & Infinite Music Discovery Engine
 * Includes Mood Selector, 12 Expanded Genres, and Vintage Walkman/Discman Deck
 */

// ==========================================================================
// 1. PROCEDURAL SOUND SYNTHESIS ENGINE (Web Audio API)
// ==========================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientGain = null;
    this.ambientSource = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Melodic brass door chime when entering the store
  playDoorBell() {
    this.init();
    const now = this.ctx.currentTime;
    
    const notes = [
      { freq: 880, time: 0, dur: 1.2 },        // A5
      { freq: 1174.66, time: 0.12, dur: 1.5 }, // D6
      { freq: 1318.51, time: 0.28, dur: 1.8 }  // E6
    ];

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      gain.gain.setValueAtTime(0, now + note.time);
      gain.gain.linearRampToValueAtTime(0.18, now + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });
  }

  // Satisfying tactile clack sound when browsing through cases in the crate
  playCrateClack() {
    this.init();
    const now = this.ctx.currentTime;
    
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400 + Math.random() * 400, now);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Mechanical deck button push latch click (Walkman / Discman)
  playMechanicalClick() {
    this.init();
    const now = this.ctx.currentTime;

    // Heavy tactile click + spring release
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // High pitch rapid motor whirring (Tape rewind / fast-forward)
  playTapeRewind() {
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.18);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Smooth dramatic swoosh when pulling album from crate
  playSwoosh() {
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.25);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Ambient vinyl crackle & warm store atmosphere
  toggleAmbient() {
    this.init();
    if (this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      this.isAmbientPlaying = false;
      return false;
    } else {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const pop = Math.random() > 0.9994 ? (Math.random() * 1.5 - 0.75) : 0;
        output[i] = white * 0.015 + pop;
      }

      this.ambientSource = this.ctx.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.2);

      this.ambientSource.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientSource.start();
      this.isAmbientPlaying = true;
      return true;
    }
  }
}

const sounds = new SoundEngine();

// ==========================================================================
// 2. MASSIVE SEARCH SEED BANKS (12 Expanded Genres + Moods)
// ==========================================================================
const GENRE_SEEDS = {
  "rock": [
    "Nirvana",
    "Radiohead",
    "Pink Floyd",
    "Led Zeppelin",
    "The Beatles",
    "Queen",
    "David Bowie",
    "The Rolling Stones",
    "The Doors",
    "Fleetwood Mac",
    "The Clash",
    "The Smiths",
    "Joy Division",
    "The Cure",
    "Pixies",
    "Smashing Pumpkins",
    "R.E.M.",
    "Oasis",
    "Blur",
    "Arctic Monkeys",
    "Foo Fighters",
    "Red Hot Chili Peppers",
    "Deep Purple",
    "The Police",
    "Dire Straits",
    "U2",
    "Jimi Hendrix",
    "The Who",
    "King Crimson",
    "Soundgarden",
    "Alice in Chains",
    "Pearl Jam",
    "Audioslave",
    "The Strokes",
    "Interpol",
    "Rush",
    "Yes",
    "Genesis",
    "Cream",
    "The Velvet Underground",
    "Neil Young",
    "The Kinks",
    "Black Rebel Motorcycle Club",
    "Queens of the Stone Age",
    "White Stripes",
    "Franz Ferdinand",
    "Weezer",
    "Sonic Youth",
    "Jane's Addiction",
    "Faith No More",
    "Rage Against the Machine",
    "The Black Keys",
    "Muse",
    "Kasabian",
    "Pavement",
    "Pulp",
    "Suede",
    "The Killers",
    "The White Stripes",
    "Yeah Yeah Yeahs",
    "Bloc Party",
    "Foals",
    "The Libertines",
    "Television",
    "Talking Heads",
    "Gang of Four",
    "Wire",
    "Echo & the Bunnymen",
    "Siouxsie and the Banshees",
    "Bauhaus",
    "New Order",
    "Cocteau Twins",
    "Slowdive",
    "My Bloody Valentine",
    "Ride",
    "Lush",
    "The Jesus and Mary Chain",
    "Primal Scream",
    "The Stone Roses",
    "Happy Mondays",
    "The Charlatans",
    "Supergrass",
    "Manic Street Preachers",
    "Placebo",
    "The Verve",
    "Stereophonics",
    "Travis",
    "Coldplay",
    "Feeder",
    "Doves",
    "Elbow",
    "Kaiser Chiefs",
    "The Fratellis",
    "The Wombats",
    "The Kooks",
    "Razorlight",
    "The Subways",
    "The Vines",
    "The Hives",
    "The Datsuns",
    "Jet",
    "Wolfmother",
    "Silverchair",
    "Bush",
    "Stone Temple Pilots",
    "Temple of the Dog",
    "Mad Season",
    "Screaming Trees",
    "Mudhoney",
    "L7",
    "Babes in Toyland",
    "Hole",
    "Garbage",
    "No Doubt",
    "Skunk Anansie",
    "Guano Apes",
    "The Cranberries",
    "Alanis Morissette",
    "Patti Smith",
    "PJ Harvey",
    "Tori Amos",
    "Fiona Apple",
    "Liz Phair",
    "Courtney Barnett",
    "St. Vincent",
    "Sleater-Kinney",
    "Bikini Kill",
    "Le Tigre",
    "The Breeders",
    "Veruca Salt",
    "Dinosaur Jr.",
    "Meat Puppets",
    "Husker Du",
    "Minutemen",
    "Fugazi",
    "Rites of Spring",
    "Drive Like Jehu",
    "Jawbreaker",
    "Sunny Day Real Estate",
    "Jimmy Eat World",
    "American Football",
    "Modest Mouse",
    "Built to Spill",
    "Guided by Voices",
    "Neutral Milk Hotel",
    "Yo La Tengo",
    "Spiritualized",
    "The Brian Jonestown Massacre",
    "The Dandy Warhols",
    "The Black Angels",
    "King Gizzard & The Lizard Wizard",
    "Thee Oh Sees",
    "Ty Segall",
    "Fuzz",
    "Wand",
    "Allman Brothers Band",
    "Lynyrd Skynyrd",
    "Creedence Clearwater Revival",
    "The Band",
    "Crosby Stills Nash & Young",
    "Buffalo Springfield",
    "The Byrds",
    "Love",
    "Jefferson Airplane",
    "Janis Joplin",
    "Big Brother and the Holding Company",
    "Ten Years After",
    "Free",
    "Bad Company",
    "Foghat",
    "Grand Funk Railroad",
    "Mountain",
    "Blue Oyster Cult",
    "Thin Lizzy",
    "Wishbone Ash",
    "Uriah Heep",
    "Hawkwind",
    "UFO",
    "Scorpions",
    "Rainbow",
    "Whitesnake",
    "Def Leppard",
    "Boston",
    "Foreigner",
    "Journey",
    "Kansas",
    "Styx",
    "REO Speedwagon",
    "Cheap Trick",
    "Heart",
    "Pat Benatar",
    "Joan Jett"
  ],
  "latino": [
    "Soda Stereo",
    "Gustavo Cerati",
    "Charly Garcia",
    "Fito Paez",
    "Luis Alberto Spinetta",
    "Pescado Rabioso",
    "Los Prisioneros",
    "Los Tres",
    "La Ley",
    "Virus",
    "Sumo",
    "Los Fabulosos Cadillacs",
    "Enanitos Verdes",
    "Caifanes",
    "Cafe Tacvba",
    "Molotov",
    "Heroes del Silencio",
    "Enrique Bunbury",
    "Andres Calamaro",
    "Los Rodriguez",
    "Babasonicos",
    "Jorge Drexler",
    "Mon Laferte",
    "Los Bunkers",
    "Illya Kuryaki and the Valderramas",
    "Seru Giran",
    "Pappo",
    "Rata Blanca",
    "El Cuarteto de Nos",
    "Aterciopelados",
    "Santana",
    "Spinetta Jade",
    "Invisible Spinetta",
    "Mercedes Sosa",
    "Silvio Rodriguez",
    "Buena Vista Social Club",
    "Los Jaivas",
    "Lucybell",
    "Javier Calamaro",
    "Attaque 77",
    "La Renga",
    "Divididos",
    "Bersuit Vergarabat",
    "Mano Negra",
    "Plastilina Mosh",
    "Control Machete",
    "Zoe",
    "Mikel Erentxun",
    "Duncan Dhu",
    "Radio Futura",
    "Nacha Pop",
    "Los Secretos",
    "Hombres G",
    "El Ultimo de la Fila",
    "Manolo Garcia",
    "Jarabe de Palo",
    "La Union",
    "Mecano",
    "Amaral",
    "Los Planetas",
    "Vetusta Morla",
    "Love of Lesbian",
    "Dorian",
    "Leiva",
    "Bunbury",
    "Calamaro",
    "Kany Garcia",
    "Cultura Profetica",
    "Los Amigos Invisibles",
    "Desorden Publico",
    "Caramelos de Cianuro",
    "La Gusana Ciega",
    "Fobia",
    "Jumbo",
    "Kinky",
    "DLD",
    "Porter",
    "Hello Seahorse!",
    "Enjambre",
    "Siddhartha",
    "Little Jesus",
    "Reyno",
    "Camilo Septimo",
    "Los Mesoneros",
    "Bandalos Chinos",
    "Conociendo Rusia",
    "El Mato a un Policia Motorizado",
    "Usted Señalemelo",
    "Las Ligas Menores",
    "Bestia Bebe",
    "Los Espiritus",
    "La Maquina de Hacer Pajaros",
    "Vox Dei",
    "Almendra",
    "Manal",
    "Color Humano",
    "Aquelarre",
    "Crucis",
    "Mia",
    "La Portuaria",
    "Los Pericos",
    "Los Autenticos Decadentes",
    "Kapanga",
    "Catupecu Machu",
    "Massacre",
    "Carajo",
    "Cabezones",
    "Santos Inocentes",
    "Juana La Loca",
    "Suarez",
    "Electrodomesticos",
    "Congreso",
    "Aguaturbia",
    "Los Blops",
    "Sol y Lluvia",
    "Schwenke & Nilo",
    "Weichafe",
    "Chancho en Piedra",
    "Tiro de Gracia",
    "Makiza",
    "Gondwana",
    "Saiko",
    "Gepe",
    "Javiera Mena",
    "Alex Anwandter",
    "Pedropiedra",
    "Ases Falsos",
    "Denise Rosenthal",
    "Chico Trujillo",
    "Santaferia",
    "La Floripondio",
    "Moral Distraida",
    "Manuel Garcia",
    "Violeta Parra",
    "Victor Jara",
    "Inti-Illimani",
    "Quilapayun",
    "Patricio Manns"
  ],
  "synth": [
    "Michael Jackson",
    "Prince",
    "Madonna",
    "Depeche Mode",
    "New Order",
    "Tears For Fears",
    "Duran Duran",
    "The Human League",
    "A-ha",
    "Pet Shop Boys",
    "Wham",
    "George Michael",
    "Cyndi Lauper",
    "Whitney Houston",
    "Eurythmics",
    "Talking Heads",
    "Blondie",
    "Daft Punk",
    "Kavinsky",
    "The Weeknd",
    "Giorgio Moroder",
    "Bee Gees",
    "ABBA",
    "Donna Summer",
    "Earth Wind & Fire",
    "Chic",
    "Kool & The Gang",
    "Rick James",
    "Steely Dan",
    "Hall & Oates",
    "Kraftwerk",
    "Gary Numan",
    "Orchestral Manoeuvres in the Dark",
    "Simple Minds",
    "Ultravox",
    "Spandau Ballet",
    "Thompson Twins",
    "Modern Talking",
    "Erasure",
    "Soft Cell",
    "Alphaville",
    "Bronski Beat",
    "Dead or Alive",
    "Boy George",
    "Culture Club",
    "Talk Talk",
    "INXS",
    "Heaven 17",
    "Blancmange",
    "Visage",
    "Yazoo",
    "Yello",
    "Art of Noise",
    "Propaganda",
    "Frankie Goes to Hollywood",
    "The Buggles",
    "Kim Wilde",
    "Nik Kershaw",
    "Howard Jones",
    "Belinda Carlisle",
    "Rick Astley",
    "Kylie Minogue",
    "Samantha Fox",
    "Bananarama",
    "Sandra",
    "C.C. Catch",
    "Bad Boys Blue",
    "Fancy",
    "Silent Circle",
    "Gazebo",
    "Baltimora",
    "Ken Laszlo",
    "Den Harrow",
    "Radiorama",
    "Scotch",
    "Sabrina",
    "Mitch Murder",
    "Lazerhawk",
    "Com Truise",
    "Miami Nights 1984",
    "Timecop1983",
    "The Midnight",
    "Gunship",
    "FM-84",
    "Carpenter Brut",
    "Perturbator",
    "Dance With the Dead",
    "Dynatron",
    "Trevor Something",
    "College",
    "Electric Youth",
    "Desire",
    "Chromatics",
    "Glass Candy",
    "Ladytron",
    "Goldfrapp",
    "Roisin Murphy",
    "Moloko",
    "La Roux",
    "Chvrches",
    "Empire of the Sun"
  ],
  "jazz": [
    "Miles Davis",
    "John Coltrane",
    "Bill Evans",
    "Chet Baker",
    "Thelonious Monk",
    "Dave Brubeck",
    "Charles Mingus",
    "Herbie Hancock",
    "Ella Fitzgerald",
    "Billie Holiday",
    "Nina Simone",
    "Louis Armstrong",
    "Stevie Wonder",
    "Marvin Gaye",
    "Aretha Franklin",
    "Otis Redding",
    "Sam Cooke",
    "Ray Charles",
    "Amy Winehouse",
    "Norah Jones",
    "Erykah Badu",
    "D'Angelo",
    "Lauryn Hill",
    "B.B. King",
    "Muddy Waters",
    "Kamasi Washington",
    "Robert Glasper",
    "Stan Getz",
    "Wayne Shorter",
    "Lee Morgan",
    "Grant Green",
    "Dexter Gordon",
    "Sonny Rollins",
    "Cannonball Adderley",
    "Art Blakey",
    "McCoy Tyner",
    "Wes Montgomery",
    "Oscar Peterson",
    "Sarah Vaughan",
    "Al Green",
    "Curtis Mayfield",
    "Donny Hathaway",
    "Duke Ellington",
    "Count Basie",
    "Charlie Parker",
    "Dizzy Gillespie",
    "Bud Powell",
    "Clifford Brown",
    "Max Roach",
    "Horace Silver",
    "Freddie Hubbard",
    "Joe Henderson",
    "Woody Shaw",
    "Donald Byrd",
    "Kenny Burrell",
    "Jimmy Smith",
    "Stanley Turrentine",
    "Bobby Hutcherson",
    "Jackie McLean",
    "Hank Mobley",
    "Gerry Mulligan",
    "Paul Desmond",
    "Stan Kenton",
    "Gil Evans",
    "Sun Ra",
    "Pharoah Sanders",
    "Alice Coltrane",
    "Ornette Coleman",
    "Albert Ayler",
    "Don Cherry",
    "Archie Shepp",
    "Cecil Taylor",
    "Weather Report",
    "Return to Forever",
    "Mahavishnu Orchestra",
    "Chick Corea",
    "Al Di Meola",
    "John McLaughlin",
    "Pat Metheny",
    "Jaco Pastorius",
    "Michael Brecker",
    "Steps Ahead",
    "Roy Hargrove",
    "Christian McBride",
    "Brad Mehldau",
    "Esperanza Spalding",
    "Snarky Puppy",
    "Hiatus Kaiyote",
    "Yussef Dayes",
    "Alfa Mist",
    "Nubya Garcia",
    "Shabaka Hutchings",
    "Moses Boyd",
    "Kokoroko",
    "Ezra Collective",
    "GoGo Penguin",
    "BADBADNOTGOOD"
  ],
  "electronic": [
    "Massive Attack",
    "Portishead",
    "Tricky",
    "The Prodigy",
    "The Chemical Brothers",
    "Fatboy Slim",
    "Underworld",
    "Aphex Twin",
    "Boards of Canada",
    "Moby",
    "Gorillaz",
    "Bjork",
    "Justice",
    "Kraftwerk",
    "Daft Punk",
    "Four Tet",
    "Burial",
    "Bonobo",
    "Bicep",
    "Caribou",
    "Laurent Garnier",
    "Squarepusher",
    "Royksopp",
    "Air",
    "Morcheeba",
    "Zero 7",
    "Thievery Corporation",
    "Faithless",
    "Orbital",
    "Leftfield",
    "Groove Armada",
    "DJ Shadow",
    "Nightmares on Wax",
    "Kruder & Dorfmeister",
    "Tycho",
    "Jon Hopkins",
    "Moderat",
    "Apparat",
    "Modeselektor",
    "Nicolas Jaar",
    "Darkside",
    "Floating Points",
    "Mount Kimbie",
    "Kieran Hebden",
    "Jamie xx",
    "The xx",
    "Caribou",
    "Maribou State",
    "Ross from Friends",
    "DJ Seinfeld",
    "Mall Grab",
    "Peggy Gou",
    "Bicep",
    "Overmono",
    "Fred again..",
    "Paul Kalkbrenner",
    "Booka Shade",
    "Trentemoller",
    "Gui Boratto",
    "Stephan Bodzin",
    "Tale of Us",
    "Mind Against",
    "Maceo Plex",
    "Solomun",
    "Sven Vath",
    "Richie Hawtin",
    "Carl Cox",
    "Jeff Mills",
    "Derrick May",
    "Juan Atkins",
    "Kevin Saunderson",
    "Robert Hood",
    "Basic Channel",
    "Deepchord",
    "Gas",
    "The Orb",
    "Future Sound of London",
    "Shpongle",
    "Infected Mushroom",
    "Hallucinogen",
    "Ott",
    "Carbon Based Lifeforms",
    "Solar Fields",
    "St Germain",
    "Gotan Project",
    "Wax Poetic",
    "Tosca",
    "Peace Orchestra",
    "Fila Brazillia"
  ],
  "hiphop": [
    "2Pac",
    "The Notorious B.I.G.",
    "Wu-Tang Clan",
    "Nas",
    "A Tribe Called Quest",
    "Outkast",
    "Dr. Dre",
    "Snoop Dogg",
    "Eminem",
    "Jay-Z",
    "MF DOOM",
    "Kendrick Lamar",
    "J Dilla",
    "Cypress Hill",
    "The Fugees",
    "Beastie Boys",
    "Lauryn Hill",
    "Mos Def",
    "Public Enemy",
    "De La Soul",
    "Common",
    "Slick Rick",
    "Big L",
    "N.W.A.",
    "Rakim",
    "KRS-One",
    "Mobb Deep",
    "Gang Starr",
    "Method Man",
    "Ghostface Killah",
    "Busta Rhymes",
    "Ice Cube",
    "The Roots",
    "Digable Planets",
    "Souls of Mischief",
    "Talib Kweli",
    "Black Star",
    "Raekwon",
    "GZA",
    "Ol Dirty Bastard",
    "Redman",
    "Pete Rock & C.L. Smooth",
    "Big Daddy Kane",
    "EPMD",
    "Eric B. & Rakim",
    "Boogie Down Productions",
    "Brand Nubian",
    "Main Source",
    "Lord Finesse",
    "O.C.",
    "Showbiz & A.G.",
    "D.I.T.C.",
    "Pharoahe Monch",
    "Organized Konfusion",
    "Smif-N-Wessun",
    "Black Moon",
    "Heltah Skeltah",
    "Boot Camp Clik",
    "Jeru the Damaja",
    "Group Home",
    "Cella Dwellas",
    "Non Phixion",
    "Necro",
    "Jedi Mind Tricks",
    "Dilated Peoples",
    "Jurassic 5",
    "Blackalicious",
    "Hieroglyphics",
    "Del the Funky Homosapien",
    "Lootpack",
    "Madlib",
    "Quasimoto",
    "Freddie Gibbs",
    "Danny Brown",
    "Earl Sweatshirt",
    "Tyler, The Creator",
    "Joey Bada$$",
    "Action Bronson",
    "Roc Marciano",
    "Westside Gunn",
    "Conway the Machine",
    "Benny the Butcher"
  ],
  "funk": [
    "Earth Wind & Fire",
    "Chic",
    "Kool & The Gang",
    "Rick James",
    "Parliament",
    "Funkadelic",
    "Stevie Wonder",
    "James Brown",
    "Sly & The Family Stone",
    "The Gap Band",
    "George Clinton",
    "Curtis Mayfield",
    "Tower of Power",
    "The Commodores",
    "Chaka Khan",
    "The Meters",
    "Bootsy Collins",
    "Average White Band",
    "War",
    "The Isley Brothers",
    "Ohio Players",
    "Zapp & Roger",
    "Jamiroquai",
    "Maceo Parker",
    "The Bar-Kays",
    "Rufus",
    "Kassav",
    "Fela Kuti",
    "Manu Dibango",
    "William Onyeabor",
    "Tony Allen",
    "Ebo Taylor",
    "Labi Siffre",
    "Roy Ayers",
    "Donny Hathaway",
    "Gil Scott-Heron",
    "Shuggie Otis",
    "Betty Davis",
    "Marva Whitney",
    "Lyn Collins",
    "Sharon Jones & the Dap-Kings",
    "Charles Bradley",
    "Lee Fields",
    "The Budos Band",
    "Menahan Street Band",
    "El Michels Affair",
    "Orgone",
    "The New Mastersounds",
    "Monophonics",
    "Vulfpeck",
    "The Fearless Flyers",
    "Cory Wong",
    "Lettuce",
    "Galactic",
    "Dumpstaphunk",
    "Soulive",
    "Greyboy Allstars"
  ],
  "metal": [
    "Iron Maiden",
    "Judas Priest",
    "Metallica",
    "Megadeth",
    "Slayer",
    "Pantera",
    "Motorhead",
    "Black Sabbath",
    "Ozzy Osbourne",
    "Dio",
    "Rammstein",
    "Slipknot",
    "Sepultura",
    "Ghost",
    "Mastodon",
    "Gojira",
    "Sex Pistols",
    "The Ramones",
    "Bad Religion",
    "Green Day",
    "Blink-182",
    "The Offspring",
    "Tool",
    "System of a Down",
    "Deftones",
    "Korn",
    "Anthrax",
    "Avenged Sevenfold",
    "Soundgarden",
    "Alice in Chains",
    "Death",
    "Opeth",
    "Machine Head",
    "Testament",
    "Kreator",
    "Helloween",
    "Accept",
    "Saxon",
    "Mercyful Fate",
    "King Diamond",
    "Venom",
    "Celtic Frost",
    "Bathory",
    "Possessed",
    "Morbid Angel",
    "Cannibal Corpse",
    "Obituary",
    "Deicide",
    "Carcass",
    "Napalm Death",
    "At the Gates",
    "In Flames",
    "Dark Tranquillity",
    "Soilwork",
    "Arch Enemy",
    "Children of Bodom",
    "Amorphis",
    "Paradise Lost",
    "My Dying Bride",
    "Anathema",
    "Katatonia",
    "Moonspell",
    "Type O Negative",
    "Danzig",
    "Misfits",
    "Samhain",
    "Ministry",
    "Nine Inch Nails",
    "Fear Factory",
    "Static-X",
    "Rob Zombie",
    "White Zombie",
    "Prong",
    "Helmet",
    "Biohazard",
    "Madball",
    "Agnostic Front",
    "Sick of It All",
    "Hatebreed",
    "Terror",
    "Converge",
    "The Dillinger Escape Plan",
    "Botch",
    "Neurosis",
    "Isis",
    "Cult of Luna"
  ],
  "reggae": [
    "Bob Marley",
    "Peter Tosh",
    "Jimmy Cliff",
    "Burning Spear",
    "Black Uhuru",
    "Toots and the Maytals",
    "Lee Scratch Perry",
    "Sublime",
    "Manu Chao",
    "Los Fabulosos Cadillacs",
    "Cultura Profetica",
    "Gondwana",
    "Steel Pulse",
    "Dennis Brown",
    "Gregory Isaacs",
    "Max Romeo",
    "Horace Andy",
    "Bitty McLean",
    "Alborosie",
    "Chronixx",
    "Damian Marley",
    "Third World",
    "Yellowman",
    "Jacob Miller",
    "Israel Vibration",
    "Augustus Pablo",
    "King Tubby",
    "Scientist",
    "Mad Professor",
    "Prince Jammy",
    "Sly & Robbie",
    "The Congos",
    "The Abyssinians",
    "The Gladiators",
    "Culture",
    "Mighty Diamonds",
    "Israel Vibration",
    "Wailing Souls",
    "The Heptones",
    "The Paragons",
    "Alton Ellis",
    "Ken Boothe",
    "John Holt",
    "Delroy Wilson",
    "Sugar Minott",
    "Barrington Levy",
    "Frankie Paul",
    "Half Pint",
    "Tenor Saw",
    "Super Cat",
    "Buju Banton",
    "Capleton",
    "Sizzla",
    "Anthony B",
    "Protoje",
    "Kabaka Pyramid",
    "Koffee"
  ],
  "citypop": [
    "Tatsuro Yamashita",
    "Mariya Takeuchi",
    "Casiopea",
    "Anri",
    "Miki Matsubara",
    "Taeko Onuki",
    "Tame Impala",
    "Khruangbin",
    "Men I Trust",
    "Mac DeMarco",
    "Unknown Mortal Orchestra",
    "Mild High Club",
    "Ginger Root",
    "Cortex",
    "T-Square",
    "Junko Ohashi",
    "Minako Yoshida",
    "Meiko Nakahara",
    "Kiyotaka Sugiyama",
    "Omega Tribe",
    "Yellow Magic Orchestra",
    "Haruomi Hosono",
    "Ryuichi Sakamoto",
    "Masayoshi Takanaka",
    "Yukihiro Takahashi",
    "Akiko Yano",
    "EPO",
    "Hitomi Tohyama",
    "Cindy",
    "Tomoko Aran",
    "Yasuha",
    "Chika Asamoto",
    "Piper",
    "Pacific Breeze",
    "Hiroshi Sato",
    "Makoto Matsushita",
    "Noriki",
    "Ken Muramatsu",
    "Jiro Inagaki",
    "Ryo Kawasaki",
    "Kazumi Watanabe",
    "BOY PABLO",
    "Cuco",
    "Crumb",
    "Homeshake",
    "Sunset Rollercoaster",
    "Phum Viphurit",
    "HYUKOH",
    "SE SO NEON",
    "ADOY",
    "Yogee New Waves",
    "Never Young Beach",
    "Suchmos"
  ],
  "bossa": [
    "Stan Getz",
    "Astrud Gilberto",
    "Antonio Carlos Jobim",
    "Joao Gilberto",
    "Caetano Veloso",
    "Gal Costa",
    "Gilberto Gil",
    "Vinicius de Moraes",
    "Baden Powell",
    "Elis Regina",
    "Kings of Convenience",
    "Nick Drake",
    "Nara Leao",
    "Chico Buarque",
    "Jorge Ben Jor",
    "Milton Nascimento",
    "Marcos Valle",
    "Toquinho",
    "Maria Bethania",
    "Edu Lobo",
    "Sergio Mendes",
    "Seu Jorge",
    "Bebel Gilberto",
    "Lucas Arruda",
    "Dorival Caymmi",
    "Ary Barroso",
    "Luiz Bonfa",
    "Bola Sete",
    "Rosinha de Valenca",
    "Tamba Trio",
    "Zimbo Trio",
    "Os Cariocas",
    "Quarteto em Cy",
    "Wilson Simonal",
    "Elza Soares",
    "Clara Nunes",
    "Beth Carvalho",
    "Cartola",
    "Nelson Cavaquinho",
    "Paulinho da Viola",
    "Martinho da Vila",
    "Joao Bosco",
    "Djavan",
    "Ivan Lins",
    "Gonzaguinha",
    "Alceu Valenca",
    "Geraldo Azevedo",
    "Ze Ramalho",
    "Fagner",
    "Arthur Verocai",
    "Hermeto Pascoal",
    "Egberto Gismonti",
    "Naná Vasconcelos",
    "Airto Moreira"
  ],
  "all": [
    "Nirvana",
    "Radiohead",
    "Pink Floyd",
    "Led Zeppelin",
    "The Beatles",
    "Queen",
    "David Bowie",
    "The Rolling Stones",
    "The Doors",
    "Fleetwood Mac",
    "The Clash",
    "The Smiths",
    "Joy Division",
    "The Cure",
    "Pixies",
    "Smashing Pumpkins",
    "R.E.M.",
    "Oasis",
    "Blur",
    "Arctic Monkeys",
    "Foo Fighters",
    "Red Hot Chili Peppers",
    "Deep Purple",
    "The Police",
    "Dire Straits",
    "U2",
    "Jimi Hendrix",
    "The Who",
    "King Crimson",
    "Soundgarden",
    "Alice in Chains",
    "Pearl Jam",
    "Audioslave",
    "The Strokes",
    "Interpol",
    "Rush",
    "Yes",
    "Genesis",
    "Cream",
    "The Velvet Underground",
    "Neil Young",
    "The Kinks",
    "Black Rebel Motorcycle Club",
    "Queens of the Stone Age",
    "White Stripes",
    "Franz Ferdinand",
    "Weezer",
    "Sonic Youth",
    "Jane's Addiction",
    "Faith No More",
    "Rage Against the Machine",
    "The Black Keys",
    "Muse",
    "Kasabian",
    "Pavement",
    "Pulp",
    "Suede",
    "The Killers",
    "The White Stripes",
    "Yeah Yeah Yeahs",
    "Bloc Party",
    "Foals",
    "The Libertines",
    "Television",
    "Talking Heads",
    "Gang of Four",
    "Wire",
    "Echo & the Bunnymen",
    "Siouxsie and the Banshees",
    "Bauhaus",
    "New Order",
    "Cocteau Twins",
    "Slowdive",
    "My Bloody Valentine",
    "Ride",
    "Lush",
    "The Jesus and Mary Chain",
    "Primal Scream",
    "The Stone Roses",
    "Happy Mondays",
    "The Charlatans",
    "Supergrass",
    "Manic Street Preachers",
    "Placebo",
    "The Verve",
    "Stereophonics",
    "Travis",
    "Coldplay",
    "Feeder",
    "Doves",
    "Elbow",
    "Kaiser Chiefs",
    "The Fratellis",
    "The Wombats",
    "The Kooks",
    "Razorlight",
    "The Subways",
    "The Vines",
    "The Hives",
    "The Datsuns",
    "Jet",
    "Wolfmother",
    "Silverchair",
    "Bush",
    "Stone Temple Pilots",
    "Temple of the Dog",
    "Mad Season",
    "Screaming Trees",
    "Mudhoney",
    "L7",
    "Babes in Toyland",
    "Hole",
    "Garbage",
    "No Doubt",
    "Skunk Anansie",
    "Guano Apes",
    "The Cranberries",
    "Alanis Morissette",
    "Patti Smith",
    "PJ Harvey",
    "Tori Amos",
    "Fiona Apple",
    "Liz Phair",
    "Courtney Barnett",
    "St. Vincent",
    "Sleater-Kinney",
    "Bikini Kill",
    "Le Tigre",
    "The Breeders",
    "Veruca Salt",
    "Dinosaur Jr.",
    "Meat Puppets",
    "Husker Du",
    "Minutemen",
    "Fugazi",
    "Rites of Spring",
    "Drive Like Jehu",
    "Jawbreaker",
    "Sunny Day Real Estate",
    "Jimmy Eat World",
    "American Football",
    "Modest Mouse",
    "Built to Spill",
    "Guided by Voices",
    "Neutral Milk Hotel",
    "Yo La Tengo",
    "Spiritualized",
    "The Brian Jonestown Massacre",
    "The Dandy Warhols",
    "The Black Angels",
    "King Gizzard & The Lizard Wizard",
    "Thee Oh Sees",
    "Ty Segall",
    "Fuzz",
    "Wand",
    "Allman Brothers Band",
    "Lynyrd Skynyrd",
    "Creedence Clearwater Revival",
    "The Band",
    "Crosby Stills Nash & Young",
    "Buffalo Springfield",
    "The Byrds",
    "Love",
    "Jefferson Airplane",
    "Janis Joplin",
    "Big Brother and the Holding Company",
    "Ten Years After",
    "Free",
    "Bad Company",
    "Foghat",
    "Grand Funk Railroad",
    "Mountain",
    "Blue Oyster Cult",
    "Thin Lizzy",
    "Wishbone Ash",
    "Uriah Heep",
    "Hawkwind",
    "UFO",
    "Scorpions",
    "Rainbow",
    "Whitesnake",
    "Def Leppard",
    "Boston",
    "Foreigner",
    "Journey",
    "Kansas",
    "Styx",
    "REO Speedwagon",
    "Cheap Trick",
    "Heart",
    "Pat Benatar",
    "Joan Jett",
    "Soda Stereo",
    "Gustavo Cerati",
    "Charly Garcia",
    "Fito Paez",
    "Luis Alberto Spinetta",
    "Pescado Rabioso",
    "Los Prisioneros",
    "Los Tres",
    "La Ley",
    "Virus",
    "Sumo",
    "Los Fabulosos Cadillacs",
    "Enanitos Verdes",
    "Caifanes",
    "Cafe Tacvba",
    "Molotov",
    "Heroes del Silencio",
    "Enrique Bunbury",
    "Andres Calamaro",
    "Los Rodriguez",
    "Babasonicos",
    "Jorge Drexler",
    "Mon Laferte",
    "Los Bunkers",
    "Illya Kuryaki and the Valderramas",
    "Seru Giran",
    "Pappo",
    "Rata Blanca",
    "El Cuarteto de Nos",
    "Aterciopelados",
    "Santana",
    "Spinetta Jade",
    "Invisible Spinetta",
    "Mercedes Sosa",
    "Silvio Rodriguez",
    "Buena Vista Social Club",
    "Los Jaivas",
    "Lucybell",
    "Javier Calamaro",
    "Attaque 77",
    "La Renga",
    "Divididos",
    "Bersuit Vergarabat",
    "Mano Negra",
    "Plastilina Mosh",
    "Control Machete",
    "Zoe",
    "Mikel Erentxun",
    "Duncan Dhu",
    "Radio Futura",
    "Nacha Pop",
    "Los Secretos",
    "Hombres G",
    "El Ultimo de la Fila",
    "Manolo Garcia",
    "Jarabe de Palo",
    "La Union",
    "Mecano",
    "Amaral",
    "Los Planetas",
    "Vetusta Morla",
    "Love of Lesbian",
    "Dorian",
    "Leiva",
    "Bunbury",
    "Calamaro",
    "Kany Garcia",
    "Cultura Profetica",
    "Los Amigos Invisibles",
    "Desorden Publico",
    "Caramelos de Cianuro",
    "La Gusana Ciega",
    "Fobia",
    "Jumbo",
    "Kinky",
    "DLD",
    "Porter",
    "Hello Seahorse!",
    "Enjambre",
    "Siddhartha",
    "Little Jesus",
    "Reyno",
    "Camilo Septimo",
    "Los Mesoneros",
    "Bandalos Chinos",
    "Conociendo Rusia",
    "El Mato a un Policia Motorizado",
    "Usted Señalemelo",
    "Las Ligas Menores",
    "Bestia Bebe",
    "Los Espiritus",
    "La Maquina de Hacer Pajaros",
    "Vox Dei",
    "Almendra",
    "Manal",
    "Color Humano",
    "Aquelarre",
    "Crucis",
    "Mia",
    "La Portuaria",
    "Los Pericos",
    "Los Autenticos Decadentes",
    "Kapanga",
    "Catupecu Machu",
    "Massacre",
    "Carajo",
    "Cabezones",
    "Santos Inocentes",
    "Juana La Loca",
    "Suarez",
    "Electrodomesticos",
    "Congreso",
    "Aguaturbia",
    "Los Blops",
    "Sol y Lluvia",
    "Schwenke & Nilo",
    "Weichafe",
    "Chancho en Piedra",
    "Tiro de Gracia",
    "Makiza",
    "Gondwana",
    "Saiko",
    "Gepe",
    "Javiera Mena",
    "Alex Anwandter",
    "Pedropiedra",
    "Ases Falsos",
    "Denise Rosenthal",
    "Chico Trujillo",
    "Santaferia",
    "La Floripondio",
    "Moral Distraida",
    "Manuel Garcia",
    "Violeta Parra",
    "Victor Jara",
    "Inti-Illimani",
    "Quilapayun",
    "Patricio Manns",
    "Michael Jackson",
    "Prince",
    "Madonna",
    "Depeche Mode",
    "Tears For Fears",
    "Duran Duran",
    "The Human League",
    "A-ha",
    "Pet Shop Boys",
    "Wham",
    "George Michael",
    "Cyndi Lauper",
    "Whitney Houston",
    "Eurythmics",
    "Blondie",
    "Daft Punk",
    "Kavinsky",
    "The Weeknd",
    "Giorgio Moroder",
    "Bee Gees",
    "ABBA",
    "Donna Summer",
    "Earth Wind & Fire",
    "Chic",
    "Kool & The Gang",
    "Rick James",
    "Steely Dan",
    "Hall & Oates",
    "Kraftwerk",
    "Gary Numan",
    "Orchestral Manoeuvres in the Dark",
    "Simple Minds",
    "Ultravox",
    "Spandau Ballet",
    "Thompson Twins",
    "Modern Talking",
    "Erasure",
    "Soft Cell",
    "Alphaville",
    "Bronski Beat",
    "Dead or Alive",
    "Boy George",
    "Culture Club",
    "Talk Talk",
    "INXS",
    "Heaven 17",
    "Blancmange",
    "Visage",
    "Yazoo",
    "Yello",
    "Art of Noise",
    "Propaganda",
    "Frankie Goes to Hollywood",
    "The Buggles",
    "Kim Wilde",
    "Nik Kershaw",
    "Howard Jones",
    "Belinda Carlisle",
    "Rick Astley",
    "Kylie Minogue",
    "Samantha Fox",
    "Bananarama",
    "Sandra",
    "C.C. Catch",
    "Bad Boys Blue",
    "Fancy",
    "Silent Circle",
    "Gazebo",
    "Baltimora",
    "Ken Laszlo",
    "Den Harrow",
    "Radiorama",
    "Scotch",
    "Sabrina",
    "Mitch Murder",
    "Lazerhawk",
    "Com Truise",
    "Miami Nights 1984",
    "Timecop1983",
    "The Midnight",
    "Gunship",
    "FM-84",
    "Carpenter Brut",
    "Perturbator",
    "Dance With the Dead",
    "Dynatron",
    "Trevor Something",
    "College",
    "Electric Youth",
    "Desire",
    "Chromatics",
    "Glass Candy",
    "Ladytron",
    "Goldfrapp",
    "Roisin Murphy",
    "Moloko",
    "La Roux",
    "Chvrches",
    "Empire of the Sun",
    "Miles Davis",
    "John Coltrane",
    "Bill Evans",
    "Chet Baker",
    "Thelonious Monk",
    "Dave Brubeck",
    "Charles Mingus",
    "Herbie Hancock",
    "Ella Fitzgerald",
    "Billie Holiday",
    "Nina Simone",
    "Louis Armstrong",
    "Stevie Wonder",
    "Marvin Gaye",
    "Aretha Franklin",
    "Otis Redding",
    "Sam Cooke",
    "Ray Charles",
    "Amy Winehouse",
    "Norah Jones",
    "Erykah Badu",
    "D'Angelo",
    "Lauryn Hill",
    "B.B. King",
    "Muddy Waters",
    "Kamasi Washington",
    "Robert Glasper",
    "Stan Getz",
    "Wayne Shorter",
    "Lee Morgan",
    "Grant Green",
    "Dexter Gordon",
    "Sonny Rollins",
    "Cannonball Adderley",
    "Art Blakey",
    "McCoy Tyner",
    "Wes Montgomery",
    "Oscar Peterson",
    "Sarah Vaughan",
    "Al Green",
    "Curtis Mayfield",
    "Donny Hathaway",
    "Duke Ellington",
    "Count Basie",
    "Charlie Parker",
    "Dizzy Gillespie",
    "Bud Powell",
    "Clifford Brown",
    "Max Roach",
    "Horace Silver",
    "Freddie Hubbard",
    "Joe Henderson",
    "Woody Shaw",
    "Donald Byrd",
    "Kenny Burrell",
    "Jimmy Smith",
    "Stanley Turrentine",
    "Bobby Hutcherson",
    "Jackie McLean",
    "Hank Mobley",
    "Gerry Mulligan",
    "Paul Desmond",
    "Stan Kenton",
    "Gil Evans",
    "Sun Ra",
    "Pharoah Sanders",
    "Alice Coltrane",
    "Ornette Coleman",
    "Albert Ayler",
    "Don Cherry",
    "Archie Shepp",
    "Cecil Taylor",
    "Weather Report",
    "Return to Forever",
    "Mahavishnu Orchestra",
    "Chick Corea",
    "Al Di Meola",
    "John McLaughlin",
    "Pat Metheny",
    "Jaco Pastorius",
    "Michael Brecker",
    "Steps Ahead",
    "Roy Hargrove",
    "Christian McBride",
    "Brad Mehldau",
    "Esperanza Spalding",
    "Snarky Puppy",
    "Hiatus Kaiyote",
    "Yussef Dayes",
    "Alfa Mist",
    "Nubya Garcia",
    "Shabaka Hutchings",
    "Moses Boyd",
    "Kokoroko",
    "Ezra Collective",
    "GoGo Penguin",
    "BADBADNOTGOOD",
    "Massive Attack",
    "Portishead",
    "Tricky",
    "The Prodigy",
    "The Chemical Brothers",
    "Fatboy Slim",
    "Underworld",
    "Aphex Twin",
    "Boards of Canada",
    "Moby",
    "Gorillaz",
    "Bjork",
    "Justice",
    "Four Tet",
    "Burial",
    "Bonobo",
    "Bicep",
    "Caribou",
    "Laurent Garnier",
    "Squarepusher",
    "Royksopp",
    "Air",
    "Morcheeba",
    "Zero 7",
    "Thievery Corporation",
    "Faithless",
    "Orbital",
    "Leftfield",
    "Groove Armada",
    "DJ Shadow",
    "Nightmares on Wax",
    "Kruder & Dorfmeister",
    "Tycho",
    "Jon Hopkins",
    "Moderat",
    "Apparat",
    "Modeselektor",
    "Nicolas Jaar",
    "Darkside",
    "Floating Points",
    "Mount Kimbie",
    "Kieran Hebden",
    "Jamie xx",
    "The xx",
    "Maribou State",
    "Ross from Friends",
    "DJ Seinfeld",
    "Mall Grab",
    "Peggy Gou",
    "Overmono",
    "Fred again..",
    "Paul Kalkbrenner",
    "Booka Shade",
    "Trentemoller",
    "Gui Boratto",
    "Stephan Bodzin",
    "Tale of Us",
    "Mind Against",
    "Maceo Plex",
    "Solomun",
    "Sven Vath",
    "Richie Hawtin",
    "Carl Cox",
    "Jeff Mills",
    "Derrick May",
    "Juan Atkins",
    "Kevin Saunderson",
    "Robert Hood",
    "Basic Channel",
    "Deepchord",
    "Gas",
    "The Orb",
    "Future Sound of London",
    "Shpongle",
    "Infected Mushroom",
    "Hallucinogen",
    "Ott",
    "Carbon Based Lifeforms",
    "Solar Fields",
    "St Germain",
    "Gotan Project",
    "Wax Poetic",
    "Tosca",
    "Peace Orchestra",
    "Fila Brazillia",
    "2Pac",
    "The Notorious B.I.G.",
    "Wu-Tang Clan",
    "Nas",
    "A Tribe Called Quest",
    "Outkast",
    "Dr. Dre",
    "Snoop Dogg",
    "Eminem",
    "Jay-Z",
    "MF DOOM",
    "Kendrick Lamar",
    "J Dilla",
    "Cypress Hill",
    "The Fugees",
    "Beastie Boys",
    "Mos Def",
    "Public Enemy",
    "De La Soul",
    "Common",
    "Slick Rick",
    "Big L",
    "N.W.A.",
    "Rakim",
    "KRS-One",
    "Mobb Deep",
    "Gang Starr",
    "Method Man",
    "Ghostface Killah",
    "Busta Rhymes",
    "Ice Cube",
    "The Roots",
    "Digable Planets",
    "Souls of Mischief",
    "Talib Kweli",
    "Black Star",
    "Raekwon",
    "GZA",
    "Ol Dirty Bastard",
    "Redman",
    "Pete Rock & C.L. Smooth",
    "Big Daddy Kane",
    "EPMD",
    "Eric B. & Rakim",
    "Boogie Down Productions",
    "Brand Nubian",
    "Main Source",
    "Lord Finesse",
    "O.C.",
    "Showbiz & A.G.",
    "D.I.T.C.",
    "Pharoahe Monch",
    "Organized Konfusion",
    "Smif-N-Wessun",
    "Black Moon",
    "Heltah Skeltah",
    "Boot Camp Clik",
    "Jeru the Damaja",
    "Group Home",
    "Cella Dwellas",
    "Non Phixion",
    "Necro",
    "Jedi Mind Tricks",
    "Dilated Peoples",
    "Jurassic 5",
    "Blackalicious",
    "Hieroglyphics",
    "Del the Funky Homosapien",
    "Lootpack",
    "Madlib",
    "Quasimoto",
    "Freddie Gibbs",
    "Danny Brown",
    "Earl Sweatshirt",
    "Tyler, The Creator",
    "Joey Bada$$",
    "Action Bronson",
    "Roc Marciano",
    "Westside Gunn",
    "Conway the Machine",
    "Benny the Butcher",
    "Parliament",
    "Funkadelic",
    "James Brown",
    "Sly & The Family Stone",
    "The Gap Band",
    "George Clinton",
    "Tower of Power",
    "The Commodores",
    "Chaka Khan",
    "The Meters",
    "Bootsy Collins",
    "Average White Band",
    "War",
    "The Isley Brothers",
    "Ohio Players",
    "Zapp & Roger",
    "Jamiroquai",
    "Maceo Parker",
    "The Bar-Kays",
    "Rufus",
    "Kassav",
    "Fela Kuti",
    "Manu Dibango",
    "William Onyeabor",
    "Tony Allen",
    "Ebo Taylor",
    "Labi Siffre",
    "Roy Ayers",
    "Gil Scott-Heron",
    "Shuggie Otis",
    "Betty Davis",
    "Marva Whitney",
    "Lyn Collins",
    "Sharon Jones & the Dap-Kings",
    "Charles Bradley",
    "Lee Fields",
    "The Budos Band",
    "Menahan Street Band",
    "El Michels Affair",
    "Orgone",
    "The New Mastersounds",
    "Monophonics",
    "Vulfpeck",
    "The Fearless Flyers",
    "Cory Wong",
    "Lettuce",
    "Galactic",
    "Dumpstaphunk",
    "Soulive",
    "Greyboy Allstars",
    "Iron Maiden",
    "Judas Priest",
    "Metallica",
    "Megadeth",
    "Slayer",
    "Pantera",
    "Motorhead",
    "Black Sabbath",
    "Ozzy Osbourne",
    "Dio",
    "Rammstein",
    "Slipknot",
    "Sepultura",
    "Ghost",
    "Mastodon",
    "Gojira",
    "Sex Pistols",
    "The Ramones",
    "Bad Religion",
    "Green Day",
    "Blink-182",
    "The Offspring",
    "Tool",
    "System of a Down",
    "Deftones",
    "Korn",
    "Anthrax",
    "Avenged Sevenfold",
    "Death",
    "Opeth",
    "Machine Head",
    "Testament",
    "Kreator",
    "Helloween",
    "Accept",
    "Saxon",
    "Mercyful Fate",
    "King Diamond",
    "Venom",
    "Celtic Frost",
    "Bathory",
    "Possessed",
    "Morbid Angel",
    "Cannibal Corpse",
    "Obituary",
    "Deicide",
    "Carcass",
    "Napalm Death",
    "At the Gates",
    "In Flames",
    "Dark Tranquillity",
    "Soilwork",
    "Arch Enemy",
    "Children of Bodom",
    "Amorphis",
    "Paradise Lost",
    "My Dying Bride",
    "Anathema",
    "Katatonia",
    "Moonspell",
    "Type O Negative",
    "Danzig",
    "Misfits",
    "Samhain",
    "Ministry",
    "Nine Inch Nails",
    "Fear Factory",
    "Static-X",
    "Rob Zombie",
    "White Zombie",
    "Prong",
    "Helmet",
    "Biohazard",
    "Madball",
    "Agnostic Front",
    "Sick of It All",
    "Hatebreed",
    "Terror",
    "Converge",
    "The Dillinger Escape Plan",
    "Botch",
    "Neurosis",
    "Isis",
    "Cult of Luna",
    "Bob Marley",
    "Peter Tosh",
    "Jimmy Cliff",
    "Burning Spear",
    "Black Uhuru",
    "Toots and the Maytals",
    "Lee Scratch Perry",
    "Sublime",
    "Manu Chao",
    "Steel Pulse",
    "Dennis Brown",
    "Gregory Isaacs",
    "Max Romeo",
    "Horace Andy",
    "Bitty McLean",
    "Alborosie",
    "Chronixx",
    "Damian Marley",
    "Third World",
    "Yellowman",
    "Jacob Miller",
    "Israel Vibration",
    "Augustus Pablo",
    "King Tubby",
    "Scientist",
    "Mad Professor",
    "Prince Jammy",
    "Sly & Robbie",
    "The Congos",
    "The Abyssinians",
    "The Gladiators",
    "Culture",
    "Mighty Diamonds",
    "Wailing Souls",
    "The Heptones",
    "The Paragons",
    "Alton Ellis",
    "Ken Boothe",
    "John Holt",
    "Delroy Wilson",
    "Sugar Minott",
    "Barrington Levy",
    "Frankie Paul",
    "Half Pint",
    "Tenor Saw",
    "Super Cat",
    "Buju Banton",
    "Capleton",
    "Sizzla",
    "Anthony B",
    "Protoje",
    "Kabaka Pyramid",
    "Koffee",
    "Tatsuro Yamashita",
    "Mariya Takeuchi",
    "Casiopea",
    "Anri",
    "Miki Matsubara",
    "Taeko Onuki",
    "Tame Impala",
    "Khruangbin",
    "Men I Trust",
    "Mac DeMarco",
    "Unknown Mortal Orchestra",
    "Mild High Club",
    "Ginger Root",
    "Cortex",
    "T-Square",
    "Junko Ohashi",
    "Minako Yoshida",
    "Meiko Nakahara",
    "Kiyotaka Sugiyama",
    "Omega Tribe",
    "Yellow Magic Orchestra",
    "Haruomi Hosono",
    "Ryuichi Sakamoto",
    "Masayoshi Takanaka",
    "Yukihiro Takahashi",
    "Akiko Yano",
    "EPO",
    "Hitomi Tohyama",
    "Cindy",
    "Tomoko Aran",
    "Yasuha",
    "Chika Asamoto",
    "Piper",
    "Pacific Breeze",
    "Hiroshi Sato",
    "Makoto Matsushita",
    "Noriki",
    "Ken Muramatsu",
    "Jiro Inagaki",
    "Ryo Kawasaki",
    "Kazumi Watanabe",
    "BOY PABLO",
    "Cuco",
    "Crumb",
    "Homeshake",
    "Sunset Rollercoaster",
    "Phum Viphurit",
    "HYUKOH",
    "SE SO NEON",
    "ADOY",
    "Yogee New Waves",
    "Never Young Beach",
    "Suchmos",
    "Astrud Gilberto",
    "Antonio Carlos Jobim",
    "Joao Gilberto",
    "Caetano Veloso",
    "Gal Costa",
    "Gilberto Gil",
    "Vinicius de Moraes",
    "Baden Powell",
    "Elis Regina",
    "Kings of Convenience",
    "Nick Drake",
    "Nara Leao",
    "Chico Buarque",
    "Jorge Ben Jor",
    "Milton Nascimento",
    "Marcos Valle",
    "Toquinho",
    "Maria Bethania",
    "Edu Lobo",
    "Sergio Mendes",
    "Seu Jorge",
    "Bebel Gilberto",
    "Lucas Arruda",
    "Dorival Caymmi",
    "Ary Barroso",
    "Luiz Bonfa",
    "Bola Sete",
    "Rosinha de Valenca",
    "Tamba Trio",
    "Zimbo Trio",
    "Os Cariocas",
    "Quarteto em Cy",
    "Wilson Simonal",
    "Elza Soares",
    "Clara Nunes",
    "Beth Carvalho",
    "Cartola",
    "Nelson Cavaquinho",
    "Paulinho da Viola",
    "Martinho da Vila",
    "Joao Bosco",
    "Djavan",
    "Ivan Lins",
    "Gonzaguinha",
    "Alceu Valenca",
    "Geraldo Azevedo",
    "Ze Ramalho",
    "Fagner",
    "Arthur Verocai",
    "Hermeto Pascoal",
    "Egberto Gismonti",
    "Naná Vasconcelos",
    "Airto Moreira"
  ]
};

// Mood presets connected to the Disquero Clerk
const MOOD_PRESETS = {
  "heartbreak": {
    "title": "CORAZÓN ROTO & MELANCOLÍA",
    "clerkMsg": "A veces la música melancólica es el mejor abrazo. Te preparé una batea con grabaciones íntimas, acústicas y letras desgarradoras de múltiples artistas.",
    "seeds": [
      "Radiohead",
      "Mazzy Star",
      "The Cure",
      "Cigarettes After Sex",
      "Elliott Smith",
      "Joy Division",
      "Spinetta",
      "Portishead",
      "Nirvana",
      "Phoebe Bridgers",
      "Jeff Buckley",
      "Bon Iver",
      "Sufjan Stevens",
      "Damien Rice",
      "Fiona Apple",
      "Nick Cave",
      "Cat Power",
      "The National",
      "Daughter",
      "Slowdive",
      "Cocteau Twins",
      "Sinead O'Connor",
      "Leonard Cohen",
      "Tom Waits",
      "Tracy Chapman",
      "Joni Mitchell",
      "Chet Baker",
      "Low",
      "Nick Drake",
      "Spinetta Jade",
      "Iron & Wine",
      "Sun Kil Moon",
      "Red House Painters",
      "Mount Eerie",
      "Sparklehorse",
      "Bright Eyes",
      "Julien Baker",
      "Lucy Dacus",
      "Angel Olsen",
      "Sharon Van Etten",
      "Mitski",
      "Big Thief",
      "Adrianne Lenker",
      "Keaton Henson",
      "City and Colour"
    ]
  },
  "adrenaline": {
    "title": "ADRENALINA & REBELDÍA",
    "clerkMsg": "¡A romper la rutina! Te acabo de seleccionar una batea con furia pura, guitarras encendidas y decibelios al máximo.",
    "seeds": [
      "Rage Against the Machine",
      "The Prodigy",
      "Metallica",
      "The Clash",
      "Beastie Boys",
      "Sex Pistols",
      "Slipknot",
      "Motorhead",
      "Bad Religion",
      "System of a Down",
      "Audioslave",
      "Foo Fighters",
      "Queens of the Stone Age",
      "Pantera",
      "The Offspring",
      "White Zombie",
      "Refused",
      "Fugazi",
      "Dead Kennedys",
      "The Hives",
      "IDLES",
      "The Stooges",
      "Black Flag",
      "Slayer",
      "Judas Priest",
      "Iron Maiden",
      "Rammstein",
      "Green Day",
      "Soundgarden",
      "At the Drive-In",
      "Misfits",
      "Minor Threat",
      "Descendents",
      "Pennywise",
      "NOFX",
      "Rancid",
      "Dropkick Murphys",
      "Social Distortion",
      "Rise Against",
      "The Distillers",
      "Bikini Kill",
      "Amyl and the Sniffers",
      "Fontaines D.C.",
      "Shame",
      "Viagra Boys"
    ]
  },
  "party": {
    "title": "FIESTA & BAILE RETRO",
    "clerkMsg": "¡A mover el cuerpo! Aquí tienes puro ritmo disco, synthpop de los 80s y bajos funk con una selección súper variada.",
    "seeds": [
      "Daft Punk",
      "Michael Jackson",
      "Chic",
      "Donna Summer",
      "New Order",
      "Bee Gees",
      "Earth Wind & Fire",
      "Kool & The Gang",
      "Madonna",
      "Kavinsky",
      "Prince",
      "ABBA",
      "Giorgio Moroder",
      "Sister Sledge",
      "Rick James",
      "KC and The Sunshine Band",
      "The Chemical Brothers",
      "Fatboy Slim",
      "Justice",
      "LCD Soundsystem",
      "Jamiroquai",
      "Boney M",
      "Wham",
      "Gloria Gaynor",
      "The Trammps",
      "Diana Ross",
      "Kylie Minogue",
      "Pet Shop Boys",
      "Depeche Mode",
      "Talk Talk",
      "Sylvester",
      "The Pointer Sisters",
      "Heatwave",
      "Shalamar",
      "Chaka Khan",
      "Grace Jones",
      "Baccara",
      "Lipps Inc.",
      "Village People",
      "Ottawan"
    ]
  },
  "chill": {
    "title": "LLUVIA, CAFÉ & RELAJO",
    "clerkMsg": "Perfecto para bajar las revoluciones, tomarte un café y mirar la lluvia. Esta selección es pura calma, swing y elegancia.",
    "seeds": [
      "Miles Davis",
      "Chet Baker",
      "Bill Evans",
      "Erykah Badu",
      "Norah Jones",
      "Tom Jobim",
      "Stan Getz",
      "Khruangbin",
      "D'Angelo",
      "Sade",
      "Nick Drake",
      "Air",
      "Bonobo",
      "Zero 7",
      "Thievery Corporation",
      "Morcheeba",
      "Astrud Gilberto",
      "Leon Bridges",
      "Lianne La Havas",
      "Corinne Bailey Rae",
      "Jose Gonzalez",
      "Kings of Convenience",
      "Jack Johnson",
      "Men I Trust",
      "Mac DeMarco",
      "Tycho",
      "Billie Holiday",
      "Nina Simone",
      "Caetano Veloso",
      "Jorge Drexler",
      "Marcos Valle",
      "Joao Gilberto",
      "Arlo Parks",
      "Laufey",
      "Bruno Major",
      "Cigarettes After Sex"
    ]
  },
  "trippy": {
    "title": "VIAJE MENTAL & PSICODELIA",
    "clerkMsg": "Prepárate para un viaje extrasensorial. Esta selección tiene texturas hipnóticas, rock progresivo y sonidos de otra dimensión.",
    "seeds": [
      "Pink Floyd",
      "Massive Attack",
      "Tame Impala",
      "King Crimson",
      "The Doors",
      "Boards of Canada",
      "Aphex Twin",
      "Can",
      "Porcupine Tree",
      "Kraftwerk",
      "Tool",
      "The Flaming Lips",
      "Animal Collective",
      "Brian Eno",
      "Neu!",
      "Hawkwind",
      "Gong",
      "Yes",
      "Genesis",
      "Jimi Hendrix",
      "Jefferson Airplane",
      "Grateful Dead",
      "Spacemen 3",
      "Spiritualized",
      "Unknown Mortal Orchestra",
      "Mild High Club",
      "The Velvet Underground",
      "Cocteau Twins",
      "Slowdive",
      "Caribou",
      "King Gizzard & The Lizard Wizard",
      "Kikagaku Moyo",
      "The Black Angels",
      "Dungen",
      "GOAT"
    ]
  },
  "latin_bohemia": {
    "title": "BOHEMIA & ROCK LATINO",
    "clerkMsg": "La sangre latina y la poesía popular. Aquí están los discos que marcaron la historia y las noches bohemias de nuestro continente.",
    "seeds": [
      "Charly Garcia",
      "Soda Stereo",
      "Silvio Rodriguez",
      "Mercedes Sosa",
      "Los Jaivas",
      "Pescado Rabioso",
      "Caifanes",
      "Buena Vista Social Club",
      "Fito Paez",
      "Los Tres",
      "Seru Giran",
      "Luis Alberto Spinetta",
      "Gustavo Cerati",
      "Los Prisioneros",
      "La Ley",
      "Virus",
      "Sumo",
      "Los Fabulosos Cadillacs",
      "Enanitos Verdes",
      "Cafe Tacvba",
      "Molotov",
      "Heroes del Silencio",
      "Andres Calamaro",
      "Jorge Drexler",
      "Mon Laferte",
      "Los Bunkers",
      "Aterciopelados",
      "Pappo",
      "Rata Blanca",
      "El Cuarteto de Nos",
      "Chico Trujillo",
      "Congreso",
      "Inti-Illimani",
      "Quilapayun",
      "Victor Jara",
      "Violeta Parra"
    ]
  }
};

// ==========================================================================
// 3. CURATED MASTERPIECE FALLBACK CATALOG (Offline Safety)
// ==========================================================================
const CURATED_FALLBACK = [
  {
    title: "Nevermind",
    artist: "Nirvana",
    year: "1991",
    genre: "Grunge / Alt Rock",
    format: "cd",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7b/09/b8/7b09b83b-967a-1122-2615-56faeaee6b15/13UAAIM41940.rgb.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/97/9d/91979d3c-95b6-75be-ca2b-34a11f26a798/mzaf_13508658804364121404.plus.aac.p.m4a",
    sampleTrack: "Smells Like Teen Spirit",
    review: "El disco que definió la rabia y melancolía de toda una generación. Producido por Butch Vig, cambió la historia del rock para siempre en 1991.",
    spotifyQuery: "Nirvana Nevermind",
    spineColor: "#004466"
  },
  {
    title: "Canción Animal",
    artist: "Soda Stereo",
    year: "1990",
    genre: "Rock en Español",
    format: "cd",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/11/49/a7/1149a712-45e7-2965-f9ea-5471da32454f/886443610997.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e5/23/bf/e523bfd6-bb40-1e5b-b934-2e64ca65ee81/mzaf_12411993213076722880.plus.aac.p.m4a",
    sampleTrack: "De Música Ligera",
    review: "El cenit del rock en español. Riffs crudos, melodías celestiales compuestas por Gustavo Cerati y un sonido que conquistó todo el continente.",
    spotifyQuery: "Soda Stereo Cancion Animal",
    spineColor: "#e67300"
  },
  {
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    year: "1973",
    genre: "Progressive Rock",
    format: "cassette",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4a/14/b4/4a14b4c4-725d-4f10-ff34-e4612948bc54/0094638241755.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3c/cf/7b/3ccf7be8-a3be-ca34-ce92-ea9b60da8490/mzaf_1130666060132332617.plus.aac.p.m4a",
    sampleTrack: "Money",
    review: "Grabado en Abbey Road con Alan Parsons. Un viaje sonoro ininterrumpido sobre el tiempo, el dinero, la locura y la existencia humana.",
    spotifyQuery: "Pink Floyd The Dark Side of the Moon",
    spineColor: "#111111"
  },
  {
    title: "Discovery",
    artist: "Daft Punk",
    year: "2001",
    genre: "French Touch / Electronic",
    format: "cd",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6b/0e/e7/6b0ee736-2ee9-7db7-24a9-847e09ea8368/0724384960655.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/05/17/74/051774c8-5dc6-d44a-9351-4e7805d762e9/mzaf_6886475653063851509.plus.aac.p.m4a",
    sampleTrack: "One More Time",
    review: "Nostalgia retrofuturista, samples setenteros filtrados y una producción legendaria que convirtió a los robots franceses en íconos mundiales.",
    spotifyQuery: "Daft Punk Discovery",
    spineColor: "#2a2a2a"
  },
  {
    title: "Clics Modernos",
    artist: "Charly García",
    year: "1983",
    genre: "New Wave / Synthpop",
    format: "cassette",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/90/19/2d/90192d24-3f7c-40ad-a567-28fc76402ec9/886443603418.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/92/ff/9192ffd1-591b-a50e-a9b0-9b62649a2123/mzaf_15024479502283020967.plus.aac.p.m4a",
    sampleTrack: "Nos Siguen Pegando Abajo",
    review: "Grabado en Nueva York con Joe Blaney. Charly introdujo samplers y cajas de ritmos para crear un manifiesto de libertad bailable e irrepetible.",
    spotifyQuery: "Charly Garcia Clics Modernos",
    spineColor: "#d4a017"
  },
  {
    title: "Kind of Blue",
    artist: "Miles Davis",
    year: "1959",
    genre: "Modal Jazz",
    format: "cd",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/85/65/56/856556cf-7a32-9694-8149-6f9aa0a67117/886443603425.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/71/6a/02/716a02b1-1d54-1563-7e28-1efc39ee3fe1/mzaf_16156107386820295627.plus.aac.p.m4a",
    sampleTrack: "So What",
    review: "El testamento definitivo de la elegancia y la improvisación modal con John Coltrane y Bill Evans. Una joya eterna para la historia humana.",
    spotifyQuery: "Miles Davis Kind of Blue",
    spineColor: "#0d2b45"
  }
];

function getSpineColorForTitle(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 45%, 22%)`;
}

function generateEditorialBlurb(artist, title, genre, year) {
  const praises = [
    `Una obra cumbre en la trayectoria de ${artist}. Grabado con la magia sonora de ${year}, encapsula a la perfección el espíritu de ${genre}.`,
    `Considerado por críticos y coleccionistas como uno de los lanzamientos más inspirados de ${artist}. Las composiciones de este disco envejecieron como el buen vino.`,
    `Una joya imprescindible del universo de ${genre}. Lanzado en ${year}, este álbum redefinió la estética y el sonido característico de ${artist}.`,
    `Un tesoro rescatado de las bateas. Cada compás de este álbum de ${artist} refleja autenticidad, producción artesanal y maestría lírica.`,
    `Si buscas una recomendación que te sorprenda hoy, este trabajo de ${artist} (${year}) ofrece una experiencia auditiva envolvente de principio a fin.`
  ];
  return praises[Math.abs(artist.length + title.length) % praises.length];
}

// ==========================================================================
// 4. APPLICATION STATE & CONTROLLER
// ==========================================================================
class RecordStoreApp {
  constructor() {
    this.currentScene = 'exterior';
    this.currentCategory = 'all';
    this.crateItems = [];
    this.selectedAlbum = null;
    this.audioElement = new Audio();
    this.isPlayingAudio = false;
    this.currentSearchTerm = '';
    this.batchCount = 1;
    this.vuInterval = null;

    // Cache DOM Elements
    this.scenes = {
      exterior: document.getElementById('scene-exterior'),
      interior: document.getElementById('scene-interior'),
      crate: document.getElementById('scene-crate'),
      inspect: document.getElementById('scene-inspect')
    };

    this.crateRack = document.getElementById('crate-rack');
    this.crateLabelTag = document.getElementById('crate-label-tag');
    this.ambientBtn = document.getElementById('ambient-btn');
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.clerkMsg = document.getElementById('clerk-msg');

    // Walkman / Discman Deck Elements
    this.deviceModelBadge = document.getElementById('device-model-badge');
    this.lcdModeText = document.getElementById('lcd-mode-text');
    this.statusLedDot = document.getElementById('status-led-dot');
    this.playPauseBtn = document.getElementById('play-pause-btn');
    this.btnRewind = document.getElementById('btn-rewind');
    this.btnForward = document.getElementById('btn-forward');
    this.btnStop = document.getElementById('btn-stop');
    this.vuFills = document.querySelectorAll('.vu-fill');

    this.initEventListeners();
    this.loadCrateCategory('all');
  }

  // Bind UI Events
  initEventListeners() {
    // Ambient sound toggle
    this.ambientBtn.addEventListener('click', () => {
      const active = sounds.toggleAmbient();
      if (active) {
        this.ambientBtn.classList.add('active');
        this.ambientBtn.innerHTML = '<span>🔊</span><span>Vinilo / Lofi: ON</span>';
      } else {
        this.ambientBtn.classList.remove('active');
        this.ambientBtn.innerHTML = '<span>📻</span><span>Sonido Ambiente</span>';
      }
    });

    // Brand Logo Return to Exterior
    document.getElementById('brand-home-btn').addEventListener('click', () => {
      this.stopAudioPreview();
      this.switchScene('exterior');
    });

    // Scene Transitions
    document.getElementById('enter-store-btn').addEventListener('click', () => {
      sounds.playDoorBell();
      this.switchScene('interior');
    });

    document.getElementById('back-to-street-btn').addEventListener('click', () => {
      this.switchScene('exterior');
    });

    document.getElementById('approach-crate-btn').addEventListener('click', () => {
      sounds.playSwoosh();
      this.switchScene('crate');
    });

    document.getElementById('back-to-interior-btn').addEventListener('click', () => {
      this.switchScene('interior');
    });

    // Mood Selector Buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const moodKey = btn.dataset.mood;
        const mood = MOOD_PRESETS[moodKey];
        if (mood) {
          sounds.playCrateClack();
          if (this.clerkMsg) {
            this.clerkMsg.textContent = mood.clerkMsg;
          }
          // Smooth transition directly to crate with this mood loaded!
          setTimeout(() => {
            sounds.playSwoosh();
            this.switchScene('crate');
            this.loadCustomMood(mood);
          }, 350);
        }
      });
    });

    // Crate Search Form
    const searchForm = document.getElementById('crate-search-form');
    const searchInput = document.getElementById('crate-search-input');
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        this.searchCustomQuery(query);
      }
    });

    // Shuffle Crate (Fetch fresh batch of 20 random records)
    document.getElementById('crate-shuffle-btn').addEventListener('click', () => {
      sounds.playCrateClack();
      this.batchCount++;
      if (this.currentSearchTerm) {
        this.searchCustomQuery(this.currentSearchTerm);
      } else {
        this.loadCrateCategory(this.currentCategory, true);
      }
    });

    // Random Pick from Crate
    document.getElementById('dig-random-btn').addEventListener('click', () => {
      this.pickRandomFromCrate();
    });

    // Category Tabs (12 Expanded Genres)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSearchTerm = '';
        searchInput.value = '';
        const cat = btn.dataset.category;
        sounds.playCrateClack();
        this.loadCrateCategory(cat);
      });
    });

    // Crate horizontal scroll arrows
    document.getElementById('crate-left-arrow').addEventListener('click', () => {
      this.crateRack.scrollBy({ left: -240, behavior: 'smooth' });
      sounds.playCrateClack();
    });

    document.getElementById('crate-right-arrow').addEventListener('click', () => {
      this.crateRack.scrollBy({ left: 240, behavior: 'smooth' });
      sounds.playCrateClack();
    });

    // Inspect Card Actions
    document.getElementById('close-inspect-btn').addEventListener('click', () => {
      this.closeInspect();
    });

    document.getElementById('return-crate-btn').addEventListener('click', () => {
      this.closeInspect();
    });

    document.getElementById('pick-another-btn').addEventListener('click', () => {
      this.closeInspect();
      setTimeout(() => {
        this.pickRandomFromCrate();
      }, 350);
    });

    // Vintage Deck Mechanical Controls (Walkman / Discman)
    this.playPauseBtn.addEventListener('click', () => {
      sounds.playMechanicalClick();
      this.toggleAudioPreview();
    });

    this.btnRewind.addEventListener('click', () => {
      sounds.playMechanicalClick();
      sounds.playTapeRewind();
      this.audioElement.currentTime = Math.max(0, this.audioElement.currentTime - 5);
      this.updateAudioProgress();
    });

    this.btnForward.addEventListener('click', () => {
      sounds.playMechanicalClick();
      sounds.playTapeRewind();
      if (this.audioElement.duration) {
        this.audioElement.currentTime = Math.min(this.audioElement.duration, this.audioElement.currentTime + 5);
        this.updateAudioProgress();
      }
    });

    this.btnStop.addEventListener('click', () => {
      sounds.playMechanicalClick();
      this.stopAudioPreview();
    });

    // Progress Bar Click Seek
    document.getElementById('player-progress-container').addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (this.audioElement.duration) {
        this.audioElement.currentTime = clickPos * this.audioElement.duration;
        this.updateAudioProgress();
      }
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.updateAudioProgress();
    });

    this.audioElement.addEventListener('ended', () => {
      this.onAudioEnded();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentScene === 'inspect') {
        this.closeInspect();
      } else if (e.code === 'Space' && this.currentScene === 'inspect') {
        e.preventDefault();
        sounds.playMechanicalClick();
        this.toggleAudioPreview();
      } else if (this.currentScene === 'crate') {
        if (e.key === 'ArrowRight') {
          this.crateRack.scrollBy({ left: 160, behavior: 'smooth' });
          sounds.playCrateClack();
        } else if (e.key === 'ArrowLeft') {
          this.crateRack.scrollBy({ left: -160, behavior: 'smooth' });
          sounds.playCrateClack();
        }
      }
    });
  }

  // Switch between visual stages
  switchScene(sceneName) {
    Object.keys(this.scenes).forEach(name => {
      this.scenes[name].classList.remove('active');
    });

    this.currentScene = sceneName;
    if (this.scenes[sceneName]) {
      this.scenes[sceneName].classList.add('active');
    }

    if (sceneName === 'crate') {
      setTimeout(() => {
        this.crateRack.scrollLeft = 0;
      }, 100);
    }
  }

  // Helper to normalize artist names for strict unique-artist crate deduplication
  normalizeArtist(name) {
    if (!name) return '';
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/^(the|los|las|el|la)\s+/i, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  // Load crate with custom Mood preset (Strict Artist Diversity)
  async loadCustomMood(mood) {
    this.showLoading(true, `Alistando la batea para: ${mood.title}...`);

    // Pick 24 diverse seeds from the expanded mood pool
    const pickedSeeds = [...mood.seeds].sort(() => Math.random() - 0.5).slice(0, 24);

    let collectedAlbums = [];
    const secondaryAlbums = [];
    const seenTitles = new Set();
    const seenArtists = new Set();

    try {
      // Query iTunes for each seed with limit=12 for discography breadth
      const fetchPromises = pickedSeeds.map(seed => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(seed)}&entity=song&limit=12`;
        return fetch(url).then(r => r.json()).catch(() => ({ results: [] }));
      });

      const responses = await Promise.all(fetchPromises);

      responses.forEach((data, seedIdx) => {
        if (data.results && data.results.length > 0) {
          // Group songs by album to allow picking albums and tracks at random
          const albumGroups = new Map();
          for (const song of data.results) {
            const albumTitle = song.collectionName;
            if (!albumTitle) continue;
            if (!albumGroups.has(albumTitle)) {
              albumGroups.set(albumTitle, []);
            }
            albumGroups.get(albumTitle).push(song);
          }

          // Filter out already seen album titles in this crate
          const availableAlbums = Array.from(albumGroups.keys()).filter(title => !seenTitles.has(title.toLowerCase()));

          if (availableAlbums.length > 0) {
            // Pick a RANDOM album from this artist's available releases!
            const chosenAlbumTitle = availableAlbums[Math.floor(Math.random() * availableAlbums.length)];
            const tracksInAlbum = albumGroups.get(chosenAlbumTitle);
            // Pick a RANDOM track from this album for the 30s preview!
            const chosenTrack = tracksInAlbum[Math.floor(Math.random() * tracksInAlbum.length)];

            const normArtist = this.normalizeArtist(chosenTrack.artistName);

            const highResArt = chosenTrack.artworkUrl100
              ? chosenTrack.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
              : 'assets/crate_close_up.jpg';

            const releaseYear = chosenTrack.releaseDate
              ? new Date(chosenTrack.releaseDate).getFullYear().toString()
              : '199X';

            const format = (collectedAlbums.length + seedIdx) % 2 === 0 ? 'cd' : 'cassette';

            const albumObj = {
              title: chosenAlbumTitle,
              artist: chosenTrack.artistName,
              year: releaseYear,
              genre: chosenTrack.primaryGenreName || 'Rock & Pop',
              format: format,
              artwork: highResArt,
              previewUrl: chosenTrack.previewUrl,
              sampleTrack: chosenTrack.trackName || 'Pista Destacada',
              review: generateEditorialBlurb(chosenTrack.artistName, chosenAlbumTitle, chosenTrack.primaryGenreName || 'este género', releaseYear),
              spotifyQuery: `${chosenTrack.artistName} ${chosenAlbumTitle}`,
              spineColor: getSpineColorForTitle(chosenTrack.artistName + chosenAlbumTitle)
            };

            // STRICT: At most 1 album per artist in primary selection for 100% unique artists
            if (!seenArtists.has(normArtist)) {
              seenArtists.add(normArtist);
              seenTitles.add(chosenAlbumTitle.toLowerCase());
              collectedAlbums.push(albumObj);
            } else if (!seenTitles.has(chosenAlbumTitle.toLowerCase())) {
              secondaryAlbums.push(albumObj);
            }

            // Also keep other unselected albums as backup secondary candidates
            for (const otherTitle of availableAlbums) {
              if (otherTitle !== chosenAlbumTitle && !seenTitles.has(otherTitle.toLowerCase())) {
                const otherTracks = albumGroups.get(otherTitle);
                const otherTrack = otherTracks[0];
                secondaryAlbums.push({
                  title: otherTitle,
                  artist: otherTrack.artistName,
                  year: otherTrack.releaseDate ? new Date(otherTrack.releaseDate).getFullYear().toString() : '199X',
                  genre: otherTrack.primaryGenreName || 'Rock & Pop',
                  format: (secondaryAlbums.length % 2 === 0) ? 'cd' : 'cassette',
                  artwork: otherTrack.artworkUrl100 ? otherTrack.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg') : 'assets/crate_close_up.jpg',
                  previewUrl: otherTrack.previewUrl,
                  sampleTrack: otherTrack.trackName || 'Pista Destacada',
                  review: generateEditorialBlurb(otherTrack.artistName, otherTitle, otherTrack.primaryGenreName || 'este género', '199X'),
                  spotifyQuery: `${otherTrack.artistName} ${otherTitle}`,
                  spineColor: getSpineColorForTitle(otherTrack.artistName + otherTitle)
                });
              }
            }
          }
        }
      });

      // If we have under 20 due to any empty seed response, backfill with secondary unique titles
      if (collectedAlbums.length < 20 && secondaryAlbums.length > 0) {
        for (const extra of secondaryAlbums) {
          if (collectedAlbums.length >= 24) break;
          if (!seenTitles.has(extra.title.toLowerCase())) {
            seenTitles.add(extra.title.toLowerCase());
            collectedAlbums.push(extra);
          }
        }
      }
    } catch (err) {
      console.warn("Mood fetch error", err);
    }

    this.showLoading(false);

    if (collectedAlbums.length >= 8) {
      this.crateItems = collectedAlbums.sort(() => Math.random() - 0.5).slice(0, 24);
    } else {
      const fallbackFiltered = CURATED_FALLBACK.filter(a => !seenArtists.has(this.normalizeArtist(a.artist)));
      this.crateItems = [...collectedAlbums, ...fallbackFiltered].sort(() => Math.random() - 0.5).slice(0, 24);
    }

    if (this.crateLabelTag) {
      this.crateLabelTag.textContent = `BATEA: ${mood.title}`;
    }

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.renderCrate();
  }

  // Fetch a massive, random collection of albums with strict artist diversity (no repetitive artists)
  async loadCrateCategory(cat, isShuffle = false) {
    this.currentCategory = cat;
    this.showLoading(true, "Abriendo cajas nuevas del almacén...");

    const seeds = GENRE_SEEDS[cat] || GENRE_SEEDS.all;
    // Pick 24 random seeds from the large pool of artists
    const pickedSeeds = [...seeds].sort(() => Math.random() - 0.5).slice(0, 24);

    let collectedAlbums = [];
    const secondaryAlbums = [];
    const seenTitles = new Set();
    const seenArtists = new Set();

    try {
      // Query iTunes for each seed with limit=12 for discography breadth
      const fetchPromises = pickedSeeds.map(seed => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(seed)}&entity=song&limit=12`;
        return fetch(url).then(r => r.json()).catch(() => ({ results: [] }));
      });

      const responses = await Promise.all(fetchPromises);

      responses.forEach((data, seedIdx) => {
        if (data.results && data.results.length > 0) {
          // Group songs by album to allow picking albums and tracks at random
          const albumGroups = new Map();
          for (const song of data.results) {
            const albumTitle = song.collectionName;
            if (!albumTitle) continue;
            if (!albumGroups.has(albumTitle)) {
              albumGroups.set(albumTitle, []);
            }
            albumGroups.get(albumTitle).push(song);
          }

          // Filter out already seen album titles in this crate
          const availableAlbums = Array.from(albumGroups.keys()).filter(title => !seenTitles.has(title.toLowerCase()));

          if (availableAlbums.length > 0) {
            // Pick a RANDOM album from this artist's available releases!
            const chosenAlbumTitle = availableAlbums[Math.floor(Math.random() * availableAlbums.length)];
            const tracksInAlbum = albumGroups.get(chosenAlbumTitle);
            // Pick a RANDOM track from this album for the 30s preview!
            const chosenTrack = tracksInAlbum[Math.floor(Math.random() * tracksInAlbum.length)];

            const normArtist = this.normalizeArtist(chosenTrack.artistName);

            const highResArt = chosenTrack.artworkUrl100
              ? chosenTrack.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
              : 'assets/crate_close_up.jpg';

            const releaseYear = chosenTrack.releaseDate
              ? new Date(chosenTrack.releaseDate).getFullYear().toString()
              : '199X';

            const format = (collectedAlbums.length + seedIdx) % 2 === 0 ? 'cd' : 'cassette';

            const albumObj = {
              title: chosenAlbumTitle,
              artist: chosenTrack.artistName,
              year: releaseYear,
              genre: chosenTrack.primaryGenreName || 'Rock & Pop',
              format: format,
              artwork: highResArt,
              previewUrl: chosenTrack.previewUrl,
              sampleTrack: chosenTrack.trackName || 'Pista Destacada',
              review: generateEditorialBlurb(chosenTrack.artistName, chosenAlbumTitle, chosenTrack.primaryGenreName || 'este género', releaseYear),
              spotifyQuery: `${chosenTrack.artistName} ${chosenAlbumTitle}`,
              spineColor: getSpineColorForTitle(chosenTrack.artistName + chosenAlbumTitle)
            };

            // STRICT: At most 1 album per artist in primary selection for 100% unique artists
            if (!seenArtists.has(normArtist)) {
              seenArtists.add(normArtist);
              seenTitles.add(chosenAlbumTitle.toLowerCase());
              collectedAlbums.push(albumObj);
            } else if (!seenTitles.has(chosenAlbumTitle.toLowerCase())) {
              secondaryAlbums.push(albumObj);
            }

            // Also keep other unselected albums as backup secondary candidates
            for (const otherTitle of availableAlbums) {
              if (otherTitle !== chosenAlbumTitle && !seenTitles.has(otherTitle.toLowerCase())) {
                const otherTracks = albumGroups.get(otherTitle);
                const otherTrack = otherTracks[0];
                secondaryAlbums.push({
                  title: otherTitle,
                  artist: otherTrack.artistName,
                  year: otherTrack.releaseDate ? new Date(otherTrack.releaseDate).getFullYear().toString() : '199X',
                  genre: otherTrack.primaryGenreName || 'Rock & Pop',
                  format: (secondaryAlbums.length % 2 === 0) ? 'cd' : 'cassette',
                  artwork: otherTrack.artworkUrl100 ? otherTrack.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg') : 'assets/crate_close_up.jpg',
                  previewUrl: otherTrack.previewUrl,
                  sampleTrack: otherTrack.trackName || 'Pista Destacada',
                  review: generateEditorialBlurb(otherTrack.artistName, otherTitle, otherTrack.primaryGenreName || 'este género', '199X'),
                  spotifyQuery: `${otherTrack.artistName} ${otherTitle}`,
                  spineColor: getSpineColorForTitle(otherTrack.artistName + otherTitle)
                });
              }
            }
          }
        }
      });

      // If we have under 20 albums due to any fetch miss, backfill with secondary albums
      if (collectedAlbums.length < 20 && secondaryAlbums.length > 0) {
        for (const extra of secondaryAlbums) {
          if (collectedAlbums.length >= 24) break;
          if (!seenTitles.has(extra.title.toLowerCase())) {
            seenTitles.add(extra.title.toLowerCase());
            collectedAlbums.push(extra);
          }
        }
      }
    } catch (err) {
      console.warn("iTunes API live search error, using fallback catalog", err);
    }

    this.showLoading(false);

    if (collectedAlbums.length >= 8) {
      this.crateItems = collectedAlbums.sort(() => Math.random() - 0.5).slice(0, 24);
    } else {
      const fallbackFiltered = CURATED_FALLBACK.filter(a => !seenArtists.has(this.normalizeArtist(a.artist)));
      this.crateItems = [...collectedAlbums, ...fallbackFiltered].sort(() => Math.random() - 0.5).slice(0, 24);
    }

    const catLabels = {
      all: 'MEZCLA UNIVERSAL',
      rock: 'ROCK CLÁSICO & GRUNGE',
      latino: 'ROCK & POP EN ESPAÑOL',
      synth: '80s POP & SYNTHWAVE',
      jazz: 'JAZZ, SOUL & BLUES',
      electronic: 'ELECTRÓNICA & TRIP-HOP',
      hiphop: 'HIP-HOP & RAP 90s',
      funk: 'FUNK, DISCO & MOTOWN',
      metal: 'METAL & PUNK ROCK',
      reggae: 'REGGAE, DUB & SKA',
      citypop: 'CITY POP & NEO-PSICODELIA',
      bossa: 'BOSSA NOVA & ACÚSTICO'
    };

    if (this.crateLabelTag) {
      this.crateLabelTag.textContent = `${catLabels[cat] || 'TESOROS'} • LOTE #${this.batchCount}`;
    }

    this.renderCrate();
  }

  // Search literally ANY artist or genre in the world on demand with smart artist distribution
  async searchCustomQuery(query) {
    this.currentSearchTerm = query;
    this.showLoading(true, `Revolviendo las bateas en busca de "${query}"...`);

    let foundAlbums = [];
    const secondaryFound = [];
    const seenTitles = new Set();
    const artistCounts = new Map();
    const normQuery = this.normalizeArtist(query);

    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=60`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        // If the user queried a specific band/artist, allow browsing multiple albums from them
        const isSpecificArtistQuery = data.results.some(s => {
          const a = this.normalizeArtist(s.artistName);
          return a === normQuery || (normQuery.length >= 4 && a.includes(normQuery));
        });

        const maxPerArtist = isSpecificArtistQuery ? 8 : 1;

        data.results.forEach((song, idx) => {
          const albumTitle = song.collectionName;
          if (!albumTitle || seenTitles.has(albumTitle.toLowerCase())) return;

          const normArtist = this.normalizeArtist(song.artistName);
          const currentCount = artistCounts.get(normArtist) || 0;

          const highResArt = song.artworkUrl100
            ? song.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
            : 'assets/crate_close_up.jpg';

          const releaseYear = song.releaseDate
            ? new Date(song.releaseDate).getFullYear().toString()
            : '199X';

          const format = idx % 2 === 0 ? 'cd' : 'cassette';

          const albumObj = {
            title: albumTitle,
            artist: song.artistName,
            year: releaseYear,
            genre: song.primaryGenreName || 'Universal',
            format: format,
            artwork: highResArt,
            previewUrl: song.previewUrl,
            sampleTrack: song.trackName || 'Pista Principal',
            review: generateEditorialBlurb(song.artistName, albumTitle, song.primaryGenreName || 'música', releaseYear),
            spotifyQuery: `${song.artistName} ${albumTitle}`,
            spineColor: getSpineColorForTitle(song.artistName + albumTitle)
          };

          if (currentCount < maxPerArtist) {
            seenTitles.add(albumTitle.toLowerCase());
            artistCounts.set(normArtist, currentCount + 1);
            foundAlbums.push(albumObj);
          } else {
            secondaryFound.push(albumObj);
          }
        });

        // If results are few, allow filling up to 20 with secondary results
        if (foundAlbums.length < 16 && secondaryFound.length > 0) {
          for (const extra of secondaryFound) {
            if (foundAlbums.length >= 24) break;
            if (!seenTitles.has(extra.title.toLowerCase())) {
              seenTitles.add(extra.title.toLowerCase());
              foundAlbums.push(extra);
            }
          }
        }
      }
    } catch (err) {
      console.warn("Custom search error", err);
    }

    this.showLoading(false);

    if (foundAlbums.length > 0) {
      this.crateItems = foundAlbums.slice(0, 24);
      if (this.crateLabelTag) {
        this.crateLabelTag.textContent = `BÚSQUEDA: "${query.toUpperCase()}" (${foundAlbums.length} DISCOS)`;
      }
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.renderCrate();
    } else {
      alert(`No encontramos discos específicos de "${query}". Volviendo a la selección universal.`);
      this.loadCrateCategory('all');
    }
  }

  // Render physical jewel cases & cassettes in the crate
  renderCrate() {
    this.crateRack.innerHTML = '';

    this.crateItems.forEach((album, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = `crate-item format-${album.format}`;
      itemEl.dataset.index = idx;

      const formatLabel = album.format === 'cd' ? 'COMPACT DISC' : 'CASSETTE TAPE';
      const spineStyle = album.spineColor
        ? `style="background: linear-gradient(90deg, #101015 0%, ${album.spineColor} 50%, #151520 100%);"`
        : '';

      itemEl.innerHTML = `
        <div class="item-spine" ${spineStyle}>
          <span class="item-badge-top">${formatLabel}</span>
          <span class="item-spine-title">${album.artist} • ${album.title}</span>
          <span class="item-badge-bottom">${album.year}</span>
        </div>
      `;

      itemEl.addEventListener('mouseenter', () => {
        sounds.playCrateClack();
      });

      itemEl.addEventListener('click', () => {
        sounds.playSwoosh();
        itemEl.classList.add('active-choice');
        setTimeout(() => {
          this.inspectAlbum(album);
          itemEl.classList.remove('active-choice');
        }, 300);
      });

      this.crateRack.appendChild(itemEl);
    });

    this.crateRack.scrollLeft = 0;
  }

  // Pick random album from the current crate
  pickRandomFromCrate() {
    if (this.crateItems.length === 0) return;
    const randomIdx = Math.floor(Math.random() * this.crateItems.length);
    const chosen = this.crateItems[randomIdx];

    const itemElements = this.crateRack.querySelectorAll('.crate-item');
    if (itemElements[randomIdx]) {
      itemElements[randomIdx].scrollIntoView({ behavior: 'smooth', inline: 'center' });
      itemElements[randomIdx].classList.add('active-choice');
    }

    sounds.playSwoosh();
    setTimeout(() => {
      this.inspectAlbum(chosen);
      if (itemElements[randomIdx]) {
        itemElements[randomIdx].classList.remove('active-choice');
      }
    }, 400);
  }

  // Open Album Reveal View (Modal Showcase)
  async inspectAlbum(album) {
    this.selectedAlbum = album;

    // Populate Modal UI
    document.getElementById('inspect-album-title').textContent = album.title;
    document.getElementById('inspect-artist-name').textContent = album.artist;
    document.getElementById('inspect-genre').textContent = album.genre;
    document.getElementById('inspect-year').textContent = album.year;
    document.getElementById('inspect-review-text').textContent = album.review;
    document.getElementById('track-sample-title').textContent = `🎵 ${album.sampleTrack || 'Muestra de Audio'}`;

    const caseImage = document.getElementById('inspect-case-art');
    caseImage.src = album.artwork;

    const physicalCase = document.getElementById('inspect-physical-case');
    const formatPill = document.getElementById('inspect-format-pill');
    const discEl = document.getElementById('inspect-compact-disc');

    // Adapt Walkman vs Discman Branding & Mode
    if (album.format === 'cassette') {
      physicalCase.className = 'physical-case format-cassette';
      formatPill.className = 'format-pill pill-cassette';
      formatPill.textContent = '📼 CASSETTE VINTAGE';
      discEl.style.display = 'none';

      this.deviceModelBadge.textContent = 'WALKMAN WM-EX1 • AUTO REVERSE';
      this.lcdModeText.textContent = 'TAPE 1';
    } else {
      physicalCase.className = 'physical-case format-cd';
      formatPill.className = 'format-pill pill-cd';
      formatPill.textContent = '💿 COMPACT DISC';
      discEl.style.display = 'block';

      this.deviceModelBadge.textContent = 'DISCMAN D-E305 • ESP DIGITAL AUDIO';
      this.lcdModeText.textContent = 'CD-DA 01';
    }

    // External Streaming Search Links
    const encodedQuery = encodeURIComponent(`${album.artist} ${album.title}`);
    document.getElementById('link-spotify').href = `https://open.spotify.com/search/${encodedQuery}`;
    document.getElementById('link-apple').href = `https://music.apple.com/us/search?term=${encodedQuery}`;
    document.getElementById('link-youtube').href = `https://www.youtube.com/results?search_query=${encodedQuery}`;

    // Reset Audio Player
    this.stopAudioPreview();
    if (album.previewUrl) {
      this.audioElement.src = album.previewUrl;
      document.getElementById('preview-status-text').textContent = 'Pulsa PLAY para escuchar muestra (30s)';
      this.playPauseBtn.disabled = false;
      this.playPauseBtn.style.opacity = '1';
    } else {
      document.getElementById('preview-status-text').textContent = 'Escucha el álbum completo con los enlaces directos';
      this.playPauseBtn.disabled = true;
      this.playPauseBtn.style.opacity = '0.4';
    }

    this.switchScene('inspect');
  }

  // Audio Preview Controls
  toggleAudioPreview() {
    if (!this.selectedAlbum || !this.selectedAlbum.previewUrl) return;

    if (this.isPlayingAudio) {
      this.audioElement.pause();
      this.isPlayingAudio = false;
      this.playPauseBtn.querySelector('.deck-key').textContent = '▶';
      this.playPauseBtn.querySelector('.deck-label').textContent = 'PLAY';
      this.lcdModeText.textContent = 'PAUSE';
      this.statusLedDot.classList.remove('playing');
      this.setReelsSpinning(false);
      this.stopVuMeterAnimation();
      document.getElementById('preview-status-text').textContent = 'Pausado';
    } else {
      this.audioElement.play().then(() => {
        this.isPlayingAudio = true;
        this.playPauseBtn.querySelector('.deck-key').textContent = '⏸';
        this.playPauseBtn.querySelector('.deck-label').textContent = 'PAUSE';
        this.lcdModeText.textContent = 'PLAY';
        this.statusLedDot.classList.add('playing');
        this.setReelsSpinning(true);
        this.startVuMeterAnimation();
        document.getElementById('preview-status-text').textContent = 'Reproduciendo en auriculares (30s)...';
      }).catch(err => {
        console.warn('Autoplay prevented or audio load error:', err);
      });
    }
  }

  stopAudioPreview() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPlayingAudio = false;
    this.playPauseBtn.querySelector('.deck-key').textContent = '▶';
    this.playPauseBtn.querySelector('.deck-label').textContent = 'PLAY';
    this.lcdModeText.textContent = 'STOP';
    this.statusLedDot.classList.remove('playing');
    this.setReelsSpinning(false);
    this.stopVuMeterAnimation();
    document.getElementById('player-progress-bar').style.width = '0%';
    document.getElementById('player-time-badge').textContent = '00:00';
    document.getElementById('preview-status-text').textContent = 'Detenido';
  }

  updateAudioProgress() {
    if (!this.audioElement.duration) return;
    const current = this.audioElement.currentTime;
    const dur = this.audioElement.duration;
    const pct = (current / dur) * 100;
    document.getElementById('player-progress-bar').style.width = `${pct}%`;

    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60).toString().padStart(2, '0');
    document.getElementById('player-time-badge').textContent = `0${mins}:${secs}`;
  }

  onAudioEnded() {
    this.isPlayingAudio = false;
    this.playPauseBtn.querySelector('.deck-key').textContent = '▶';
    this.playPauseBtn.querySelector('.deck-label').textContent = 'PLAY';
    this.lcdModeText.textContent = 'END';
    this.statusLedDot.classList.remove('playing');
    this.setReelsSpinning(false);
    this.stopVuMeterAnimation();
    document.getElementById('player-progress-bar').style.width = '100%';
    document.getElementById('preview-status-text').textContent = 'Fin de la cinta (¿te gustó? búscala en Spotify)';
  }

  // Realistic Equalizer Spectrum Animation
  startVuMeterAnimation() {
    this.stopVuMeterAnimation();
    this.vuInterval = setInterval(() => {
      this.vuFills.forEach((bar, idx) => {
        const rand = 20 + Math.random() * 75;
        bar.style.height = `${rand}%`;
      });
    }, 120);
  }

  stopVuMeterAnimation() {
    if (this.vuInterval) {
      clearInterval(this.vuInterval);
      this.vuInterval = null;
    }
    this.vuFills.forEach(bar => {
      bar.style.height = '15%';
    });
  }

  setReelsSpinning(isSpinning) {
    const disc = document.getElementById('inspect-compact-disc');
    const spools = document.querySelectorAll('.cassette-spool');

    if (isSpinning) {
      disc.classList.add('spinning');
      spools.forEach(s => s.classList.add('spinning'));
    } else {
      disc.classList.remove('spinning');
      spools.forEach(s => s.classList.remove('spinning'));
    }
  }

  closeInspect() {
    this.stopAudioPreview();
    sounds.playSwoosh();
    this.switchScene('crate');
  }

  showLoading(show, message = "Cargando...") {
    if (show) {
      document.getElementById('loading-text').textContent = message;
      this.loadingIndicator.classList.add('visible');
    } else {
      this.loadingIndicator.classList.remove('visible');
    }
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new RecordStoreApp();
});
