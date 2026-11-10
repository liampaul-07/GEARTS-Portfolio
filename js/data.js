/* ------------------------------------------------------------------
   EVERYTHING YOU NEED TO EDIT LIVES IN THIS FILE.

   - works   : Part I cards
   - pieces  : Part II walk-through, its "Evidence of originality" pop-up, and the Appendices page
   - Text in [square brackets] is a placeholder. Replace it, brackets included.
   - src paths are the files you drop into the assets folders.
   - To add or remove an item, copy or delete one whole { ... }, block (keep the comma).

   Each Part I card shows:  Artwork, Title, Medium, Date, Type.
   Opening a card also shows the Description.

   artwork : the name of the assignment, e.g. "Scribble Art"
   title   : the name you gave your own piece (delete the line's text, "", to hide it)
   type    : "Individual" or "Group"  (this also sorts the Individual / Group tabs)
   format  : "image" or "video"       (how the file in src is shown)
   src     : a file path, OR for videos a YouTube link, e.g. "https://youtu.be/XXXXXXXXXXX"
             (watch, youtu.be and shorts links all work; add ?t=90 to start at 90 seconds).
             YouTube videos play once the site is online (GitHub Pages etc.), not from a double-clicked file.
------------------------------------------------------------------- */
window.PORTFOLIO = {
  name: "Liam Paul Raboy",

  /* ---------------- Part I: the artworks made in GEARTS ---------------- */
  works: [
    { artwork: "Scribble Art", title: "Joy & Laughter", medium: "Colored and Regular Pencil, Paper", date: "July 21, 2026", type: "Individual",
      format: "image", src: "assets/part-1/scribble-art.jpg", alt: "[Describe Scribble Art for someone who cannot see it]",
      description: "This art piece helped me rediscover the joy and wonder my younger self used to have." },

    { artwork: "Book Spine", title: "The Shape of Absence & The Garden Left Behind", medium: "Book Titles", date: "July 28, 2026", type: "Group",
      format: "image", src: "assets/part-1/book-spine.png", alt: "[Describe Book Spine]",
      description: "This activity helped me practice collaboration  with my groupmates to form a meaningful narrative artwork." },

    { artwork: "Coffee Painting", title: "Autumn", medium: "Coffee on Oslo Paper", date: "August 04, 2026", type: "Individual",
      format: "image", src: "assets/part-1/coffee-painting.jpg", alt: "[Describe Coffee Painting]",
      description: "This coffee painting, not only smelt incredible during the process, but also helped me understand and practice creating shadows on a painting by utilizing different shades of coffee." },

    { artwork: "Blackout Poetry", title: "Damaged Loop", medium: "Newspaper Clippings, Paper, and Pen", date: "September 01, 2026", type: "Individual",
      format: "image", src: "assets/part-1/blackout-poetry.jpg", alt: "[Describe Blackout Poetry]",
      description: "This art helped refine my vision, teaching me how to plan ahead and accurately translate what's in my mind onto the canvas." },

    { artwork: "Artwork Analysis Video", title: "Balota: Artwork Analysis", medium: "Video and Document", date: "September 29, 2026", type: "Individual",
      format: "video", src: "https://www.youtube.com/watch?v=l3SPF_kXB8c", alt: "A visual and thematic breakdown of Balota, examining Marian Rivera's career-defining performance and the film's tense cinematography in capturing the fragile state of democracy." },

    { artwork: "AI Art Appropriation", title: "God Reaching Us", medium: "Gemini, ChatGPT", date: "September 22, 2026", type: "Group",
      format: "image", src: "assets/part-1/ai-art-appropriation.png", alt: "[Describe AI Art Appropriation]",
      description: "Subverting the traditional view of The Creation of Adam, I placed myself in the painting to capture what draws me to Christianity—framing the iconic gap between fingers not as distant perfection, but as a deeply personal moment of God actively stepping down to meet humanity." },

    { artwork: "Painting", title: "Summer of 2012", medium: "Acrylic Paint on Paper", date: "October 12, 2026", type: "Individual",
      format: "image", src: "assets/part-1/painting.jpg", alt: "[Describe the Painting]",
      description: "My rendition of Starry Night weaves vibrant oranges into the traditional blues, reshaping the iconic night sky to mirror the glowing sunsets of my childhood in 2012. It captures a deeply personal memory of a time when the world felt simpler, richer, and full of color." },

    { artwork: "Multimedia Video", title: "Hope in Dark Times", medium: "Shot on iPhone 14", date: "October 13, 2026", type: "Group",
      format: "video", src: "https://youtu.be/nrrL06JlQpU", alt: "[Describe the Multimedia Video]",
      description: "This multimedia piece combines a sequence of photographs with AI-crafted music to explore the theme of faith through adversity. It serves as a visual and auditory meditation on trusting God when navigating life’s darkest moments." }
  ],

  /* ---------------- Part II: the pieces, with evidence ----------------
     origin : "New artwork" or "Older artwork" (shown on each piece)
     notes  : three short notes. Change the label of any of them to suit the piece.
     evidence : the pictures in the pop-up and on the Appendices page. Add or delete lines freely. */
  pieces: [
    {
      id: "bracelet", artwork: "Bracelet", title: "DNA Bracelet", medium: "Yarn", date: "November 08, 2026",
      origin: "New artwork",
      format: "image", src: "assets/part-2/bracelet.png", alt: "[Describe the bracelet]",
      notes: [
        { label: "What was your inspiration?", text: "I used to create bracelets when I was young, I was inspired by my sister learning to crochet so I learned to make bracelets out of yarn by doing knots. This artwork helped me rediscover that lost interest of mine." },
        { label: "What was new", text: "This was the first time I experimented with an advanced pattern that required more intricate knitting techniques." },
        { label: "What I'd do next", text: "I would explore different yarn textures and patterns which could add more depth and visual interest to the piece." }
      ],
      facts: {
        materials: "Yarn, Scissors, Tape", time: "It took about three to four hours for the final version", finished: "November 08, 2026"
      },
      evidence: [
        { kind: "Materials and tools", format: "image", src: "assets/evidence/bracelet-1.jpg", caption: "I used white and maroon yarn, scissors, and tape." },
        { kind: "Early stage", format: "image", src: "assets/evidence/bracelet-2.jpg", caption: "This is the early stage of the bracelet, it started with knots of multiple threads." },
        { kind: "Half-way point", format: "image", src: "assets/evidence/bracelet-3.png", caption: "This showed the bracelet at the half-way point, where the pattern was starting to emerge." },
        { kind: "Work in progress", format: "image", src: "assets/evidence/bracelet-4.png", caption: "This was the later stage, I was working on both ends of the bracelet" },
        { kind: "Finished piece", format: "image", src: "assets/evidence/bracelet-5.png", caption: "This was the finished bracelet, close up." }
      ]
    },
    {
      id: "photography", artwork: "Photography", title: "living life on colors", medium: "Digital photographs (iPhone)", date: "October - November, 2026",
      origin: "New artwork",
      /* Several pictures at once: add or delete lines in images. With one picture, use src instead. */
      images: [
        { src: "assets/part-2/photography-1.png", alt: "Cloud pictures I took during sunset, the beauty of the sky will always be breathtaking to me." },
        { src: "assets/part-2/photography-2.png", alt: "A sunset I took while out on a stroll, I found the sunset particularly stunning that day." },
        { src: "assets/part-2/photography-3.png", alt: "What was a originally a video, I took this photo trying to capture a frame within a frame style of photograph." }
      ],
      format: "image", src: "assets/part-2/photography-1.jpg", alt: "[Describe the first photograph]",
      notes: [
        { label: "About these photos", text: "These were taken by me, using my girlfriend's iPhone. I had a ton of shots taken, but these were the ones that captured the essence of the moment." },
        { label: "What was new", text: "When I was young I had no idea how to properly frame a shot, since then I have learned knowledge on composition and framing that helped me improve my photography. I still have a lot to learn, but I'm getting better." },
        { label: "What I'd do next", text: "Pursue more opportunities for street photography and expand my knowledge further." }
      ],
      facts: {
        materials: "iPhone camera", time: "These shots were taken over the course of a few weeks", finished: "November 2026",
        inspiration: "I'm always inspired by attempting to capture the beauty of nature, the complexities of the world, and how emotion can be conveyed through a single frame. I also wanted to challenge myself to capture moments that are often overlooked in everyday life.",
        file: "[Original file names, e.g. IMG_0000.HEIC]"
      },
      /* Evidence for photography is the metadata: screenshots of each photo's file details (date, time, camera). */
      evidence: [
        { kind: "Metadata, photo 1", format: "image", src: "assets/evidence/photography-1.jpg"},
        { kind: "Metadata, photo 2", format: "image", src: "assets/evidence/photography-2.jpg"},
        { kind: "Metadata, photo 3", format: "image", src: "assets/evidence/photography-3.jpg"}
      ]
    },
    {
      id: "music-cover", artwork: "Music Cover", title: "santa doesn't know you like i do", medium: "[Keyboard, Acoustic Guitar, Bass, and Drums]", date: "December 2026",
      origin: "Older artwork",
      format: "video", src: "https://youtu.be/4b5REKopzbg", alt: "[Describe the music cover]",
      notes: [
        { label: "About this piece", text: "This was made last year. I heard the song and thought it would be a great fit for a cover, especially since it was the season. I had fun learning how to play it on different instruments, and it made me practice ear training and guessing chords." },
        { label: "Why it's here", text: "The previous pieces was me discovering parts of myself I felt like I lost, it was me rediscovering outlets of art that I had neglected. This art piece however, represents a continuation of that journey. It's a pursuit of self-expression and artistic growth, using different instruments I learned during my journey." },
        { label: "What I'd do differently", text: "I would record the instruments with better quality and in a more controlled environment. I found that there are a lot of background noise that affected the audio quality." }
      ],
      facts: {
        materials: "Keyboard, Acoustic Guitar, Bass, and Drums", time: "Took the half the day to learn and record", finished: "December 2026",
        inspiration: "I was inspired by talented people being able to play multiple instruments and create music. I wanted to challenge myself to do the same, and this cover was a great way to do that.",
        file: "https://www.youtube.com/watch?v=4b5REKopzbg"
      },
      evidence: [
        { kind: "Outtakes folder", format: "image", src: "assets/evidence/music-cover-1.png", caption: "This was a screenshot of how many takes I did recording the whole thing." },
        { kind: "File with date", format: "image", src: "assets/evidence/music-cover-2.png", caption: "This was the metadata file showing when it was created." },
        { kind: "Timeline", format: "image", src: "assets/evidence/music-cover-3.png", caption: "This shows the editing timeline I had when I was editing the cover." }
      ]
    }
  ]
};
