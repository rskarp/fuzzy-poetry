<script lang="ts">
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <div class="context">
    <h1 class="text-violet-500 text-2xl">Context</h1>
    <ul>
      <li>
        <h2 class="text-pink-400 text-xl">Websites</h2>
        <ul class="ml-4">
          <li>
            <h3 class="text-green-400 text-l">
              <a class="link" href="https://the-next.eliterature.org/">The Next</a>
            </h3>
            <p class="py-1">
              The Next has a wide array of digital and physical media related to born-digital art
              and digital writing, including the source files of the works; artist's notes; ephemera
              associated with performances, exhibitions, and publications; and scholarship in the
              original language and in translation. Its purpose is to make what Maria Lind describes
              as “contact surfaces" between works of art, curated projects, and people about various
              forms and intensities of communicating about and around art. The fragility of digital
              art The NEXT possesses indicates that it allows us to inhabit the past and adventure
              into the future.
            </p>
          </li>
          <li>
            <h3 class="text-l">
              <a class="link" href="https://ubu.com/resources/about.html">Ubuweb</a>
            </h3>
            <p class="py-1">
              Founded in 1996, UbuWeb is a pirate shadow library composed of hundreds of thousands
              of freely downloadable avant-garde artifacts. By the letter of the law, the site is
              questionable; it openly violates copyright norms and rarely asks for permission. Most
              everything on the site is swiped from other places, then reposted. UbuWeb is a
              non-profit which they are proud of, but importantly UbuWeb has always been and will
              always be free and open to the public: All labor is volunteered; their server space
              and bandwidth are donated by a like-minded group of intellectual custodians who
              believe in free access to knowledge. This website showcases the history of electronic
              poetry.
            </p>
          </li>
          <li>
            <h3 class="text-l">
              <a class="link" href="http://glia.ca/index_Digital_Poetry.html"
                >Glia Digital Poetry</a
              >
            </h3>
            <p class="py-1">
              Glia digital poetry is a website run by Jhave, a poet based in Montreal, formerly
              working in Hong Kong, experimenting with language images, videos, theories, poems, and
              code. Glia refers to a Neurological Substance (a brain jelly); it is more common than
              neurons. Additionally, Jhave is a nickname created by combining the 'jh' from Johnston
              with the 'ave' from Dave.
            </p>
          </li>
        </ul>
      </li>
      <li>
        <h2 class="text-pink-400 text-xl">Online Journals</h2>
        <ul class="ml-4">
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/beehiveThumbnail.png" />
              </div>
              <span class="px-1"
                ><h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/16">BeeHive</a>
                </h3>
                <p>
                  BeeHive is a journal that debuted on the World Wide Web in May of 1998 and
                  provided a venue for creative literary content that explored the potential of
                  network-based creativity. It was edited by prominent electronic literature artist
                  Talan Memmott and endeavored to produce quality online literary content.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/bleuOrangeThumbnail.png" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/29"
                    >BleuOrange</a
                  >
                </h3>
                <p>
                  BleuOrange was founded in 2008 by Alice Van Klei, reviewing more than fifty
                  original hypermedia works in French or in translation. Supported by the NT2
                  Laboratory and Figura, the text and imagination research center, the tenth and
                  final issue of the journal was published in February 2021.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/cauldronAndNetThumbnail.png" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/4"
                    >Cauldron & Net</a
                  >
                </h3>
                <p>
                  Cauldron & Net was founded by author Claire Dinsmore, featuring four volumes of
                  electronic literature published between 1997-2002.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/frameThumbnail.png" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/15">frAME</a>
                </h3>
                <p>
                  frAME ​​was a pioneering community founded by Sue Thomas at Nottingham Trace
                  University, UK. From 1995-2005 it hosted conferences, online forums, competitions,
                  exhibitions, and online courses and published journals, books, and catalogs.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/poemsThatGoThumbnail.png" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/14"
                    >Poems that Go</a
                  >
                </h3>
                <p>
                  Poems that Go was edited by Megan Sapnar Ankerson and Ingrid Ankerson and explored
                  the intersections between motion, sound, image, text, and code. The journal
                  featured kinetic poetry in each of its five issues and remained one of the premier
                  journals of the period.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/ridingTheMeridianThumbnail.png" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/13"
                    >Riding the Meridian</a
                  >
                </h3>
                <p>
                  Riding the Meridian is a premier online journal founded by Jennifer Ley,
                  publishing over 350 works of electronic literature and net art from 1999-2000.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/irwThumbnail.png" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/8"
                    >The Iowa Review Web</a
                  >
                </h3>
                <p>
                  The Iowa Review Web began publishing electronic literature in 1999, establishing a
                  reputation for a commitment to new writing, encouraging the investigation of text
                  and hypertext in theory and practice at their deepest levels. The collection
                  contains 89 works published in its nine volumes.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/newRiverThumbnail.jpeg" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/42"
                    >The New River is a Journal of Digital Writing and Art</a
                  >
                </h3>
                <p>
                  The New River is a Journal of Digital Writing and Art was founded by author Ed
                  Falco in 1999 and is among the first and longest-running literary journals in the
                  United States dedicated to electronic literature and art. Serving initially as a
                  home for experiments both in hypertext and hypermedia art, the scope of the
                  journal’s archives has grown to encompass video and performance art, sound art,
                  augmented reality, playable media, and programmable sculptures, among others.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/vectorsThumbnail.jpeg" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/31">Vectors</a>
                </h3>
                <p>
                  Vectors mapped the multiple contours of daily life in a digital era, crystallizing
                  around themes of our increasingly technologically-mediated existence. As such, the
                  journal speaks both implicitly and explicitly to key debates across varied
                  disciplines, including issues of globalization, mobility, power, and access.
                </p>
              </span>
            </div>
          </li>
          <li>
            <div class="flex flex-row py-1">
              <div class="w-16 rounded shrink-0 grow-0">
                <img src="../assets/images/wordCircuitsThumbnail.png" />
              </div>
              <span class="px-1">
                <h3 class="text-green-400 text-l">
                  <a class="link" href="https://the-next.eliterature.org/collections/1"
                    >Word Circuits
                  </a>
                </h3>
                <p>
                  Word Circuits was founded in 1997 by e-lit pioneer Robert Kendall, with an
                  all-star editorial team that included Marjorie C. Luesebrink (M.D. Coverley), Rob
                  Swigart, Deena Larsen, Jean Hughes-Réty, and Nancy Smith. It was described as the
                  watering hole for electronic literature and featured 85 works by 51 artists.
                </p>
              </span>
            </div>
          </li>
        </ul>
      </li>
      <li>
        <h2 class="text-pink-400 text-xl">Anthologies</h2>
        <p class="py-1">
          The Anthologies are formal collections of born-digital works selected by an editor or
          editorial team for publication. Those found here currently—Electronic Literature
          Collections 1 (2005), 2 (2001), and 3 (2016)—represent the efforts by the Electronic
          Literature Organization to document a specific moment in time occurring across continents,
          languages, and platforms during the second decade of the twenty-first century.
        </p>
        <ul class="ml-4">
          <li>
            <h3 class="text-green-400 text-l">
              <a class="link" href="https://the-next.eliterature.org/collections/5"
                >Electronic Literature Collection Volume One</a
              >
            </h3>
            <p class="py-1">
              Electronic Literature Collection Volume One is an anthology of 62 works of electronic
              literature published both on CD-ROM and the web by the Electronic Literature
              Organization in 2006. It was edited by N. Katherine Hayles, Nick Montfort, Scott
              Rettberg, and Stephanie Strickland.
            </p>
          </li>
          <li>
            <h3 class="text-l">
              <a class="link" href="https://the-next.eliterature.org/collections/6"
                >Electronic Literature Collection Volume Two</a
              >
            </h3>
            <p class="py-1">
              Electronic Literature Collection Volume Two is an anthology of 61 works of electronic
              literature published both on flash drive and the web by the Electronic Literature
              Organization in 2011. It was edited by Laura Borràs, Talan Memmot, Rita Raley, and
              Brian Stefans.
            </p>
          </li>
          <li>
            <h3 class="text-l">
              <a class="link" href="https://the-next.eliterature.org/collections/7"
                >Electronic Literature Collection Volume Three</a
              >
            </h3>
            <p class="py-1">
              Electronic Literature Collection Volume Three is a collection of 115 works published
              in 2016 by the Electronic Literature Organization. It features works from 26
              countries, 13 languages and includes a wide range of platforms from physical
              interfaces and iPhone apps to Twitter bots and Twine games to concrete Flash poetry
              and alternate reality games to newly performed netprov and classic hypertext fiction.
            </p>
          </li>
        </ul>
      </li>
      <li>
        <h2 class="text-pink-400 text-xl">Scholarly Essays</h2>
        <p class="py-1">
          Scholarly Essays includes critical writing, artists papers, documentary video, and other
          forms of scholarly publications, created both for digital and print contexts. Accessible
          currently are the archives from Computing Literature (2010-2017), and Pathfinders:
          Documenting the Experience of Early Digital Literature (2013-2015).
        </p>
        <ul class="ml-4">
          <li>
            <h3 class="text-green-400 text-l">
              <a class="link">Computing Literature</a>
            </h3>
            <p class="py-1">
              Computing Literature is a book series published by the Center for Literary Computing
              at West Virginia University in collaboration with the Laboratories Paragraphe at
              Université Paris 8 and with a distribution agreement with the West Virginia University
              Press. Founded by Sandy Baldwin, the press produced eight volumes of books from
              2010-2017 authored by some of the most renowned artists and scholars in the field. The
              eighth volume, #WomenTechLit edited by María Mencía, was awarded the prestigious N.
              Katherine Hayles Prize for Electronic Literature Criticism in 2018.
            </p>
            <ul class="indent-4 list-disc list-inside">
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1604/0/0/"
                  >Bootz, Philippe, et al. Computing Literature Vol. 1: Regards Croisés:
                  Perspectives on Digital Literature. 2010. PDF. The NEXT, Vancouver, WA.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1605/0/0/"
                  >Sondheim, Alan, and Sandy Baldwin. Computing Literature Vol. 2: Writing Under:
                  Selections from the Internet Text. 2012. PDF. The NEXT, Vancouver, WA.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1606/0/0/"
                  >Rettberg, Scott, et al. Computing Literature Vol. 3: ELMCIP: A Report from the
                  HERA Joint Research Project. 2014. PDF. The NEXT, Vancouver, WA.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1607/0/0/"
                  >Torres, Rui, et al. Computing Literature Vol. 4: PO.EX: Essays from Portugal on
                  Cyberliterature and Intermedia. 2014. PDF. The NEXT, Vancouver, WA.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1608/0/0/"
                  >Rosenberg, Jim, and Sandy Baldwin. Computing Literature Vol. 5: Word Space
                  Multiplicities, Openings, Andings. 2015. PDF. The NEXT, Vancouver, WA.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1609/0/0/"
                  >Rettberg, Scott, et al. Computing Literature Vol. 6: Electronic Literature
                  Communities. 2015. PDF. The NEXT, Vancouver, WA.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1610/0/0/"
                  >Strehovec, Janez, et al. Computing Literature Vol. 7: Text as Ride. 2016. PDF.
                  The NEXT, Vancouver, WA.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1603/0/0/"
                  >Mencia, Maria, et al. Computing Literature Vol. 8: #WomenTechLit. 2017. PDF. The
                  NEXT, Vancouver, WA.</a
                >
              </li>
            </ul>
          </li>
          <li>
            <h3 class="text-l">
              <a class="link">Pathfinders</a>
            </h3>
            <p class="py-1">
              Documenting the Experience of Early Digital Literature is an open source book created
              by Dene Grigar and Stuart Moulthrop in 2015 that documents the experience of early
              electronic literature, specifically pre-web hypertext fiction and poetry, from
              1986-1995. The collection contains 404 files derived from videos, images, sound files,
              text, and webpages from the book and features the work of four major writers and works
              of electronic literature: Judy Malloy's Uncle Roger, John McDaid's Uncle Buddy's
              Phantom Funhouse, Shelley Jackson's Patchwork Girl, and Bill Bly's We Descend.
            </p>
            <ul class="indent-4 list-disc list-inside">
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1484/0/0/"
                  >Grigar, Dene, and Stuart Moulthrop. "Pathfinders Chapter 1: Introduction"..
                  Nouspace Publications. 2015.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1485/0/0/"
                  >Grigar, Dene, et al. "Pathfinders Chapter 2: Judy Malloy's Uncle Roger". Nouspace
                  Publications. 2015.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1486/0/0/"
                  >Grigar, Dene, et al. "Pathfinders Chapter 3: John McDaid's Uncle Buddy's Phantom
                  Funhouse". Nouspace Publications. 2015.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1487/0/0/"
                  >Grigar, Dene, et al. "Pathfinders Chapter 4: Shelley Jackson's Patchwork Girl".
                  Nouspace Publications. 2015.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1488/0/0/"
                  >Grigar, Dene, et al. "Pathfinders Chapter 5: Bill Bly's We Descend".. Nouspace
                  Publications. 2015.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1489/0/0/"
                  >Grigar, Dene, and Stuart Moulthrop. "Pathfinders Chapter 6: Traversals and
                  Interviews Documentation".. Nouspace Publications. 2015.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1490/0/0/"
                  >Grigar, Dene, and Stuart Moulthrop. "Pathfinders Chapter 7: Authors' and
                  Contributors' Bios".. Nouspace Publications. 2015.</a
                >
              </li>
              <li>
                <a class="link" href="https://the-next.eliterature.org/works/1491/0/0/"
                  >Grigar, Dene, and Stuart Moulthrop. "Pathfinders Chapter 8: References and For
                  Further Reading".. Nouspace Publications. 2015.</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .context {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>
